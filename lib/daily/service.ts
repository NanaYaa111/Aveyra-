/**
 * Daily-question loop (Milestone 2) — the core Aveyra ritual.
 *
 * One question per day (deterministic rotation), each partner answers privately,
 * and the answers reveal only once BOTH have submitted ("answer-to-unlock", the
 * proven Paired pattern — see design-research-today-loop.md). An answer stays
 * editable until the reveal (there is no authenticity cost: you cannot see your
 * partner's answer while yours is still editable). After a reveal, the couple may
 * keep the exchange as a Memory with one tap.
 *
 * Backend-agnostic: reads/writes go through the encrypted DatabaseService; the
 * rotation lives in rotationStore. "Reveal" is DERIVED from both answers
 * existing — no separate reveal record to keep in sync.
 *
 * Participant mapping is a stub for the no-backend phase: this device is
 * `partner_one`; the partner is `partner_two` (dev-simulated). With Supabase the
 * mapping becomes per-account and the simulate control disappears.
 */
import { getService, type DatabaseService } from '../database/service';
import { getQuestion } from '../questions/bank';
import { questionForDate, dateKeyInTimeZone } from '../questions/rotation';
import { isSupabaseConfigured } from '../supabase/client';
import { spAnswersFor, spSubmitAnswer, spSubscribeAnswers } from './supabaseRepo';
import { spCreateMemory, spGetMemories } from '../story/supabaseRepo';
import type { QuestionSeed } from '../questions/types';
import type { Answer, Memory } from '../database/types';
import {
  advanceDayOffset,
  getDayOffset,
  loadRotation,
  resetRotation,
  saveRotation,
} from './rotationStore';

export const ME: Answer['author'] = 'partner_one';
export const PARTNER: Answer['author'] = 'partner_two';

export type DailyStatus = 'answering' | 'waiting' | 'revealed';

export interface DailyState {
  question: QuestionSeed;
  dateKey: string;
  myAnswer: Answer | null;
  partnerAnswer: Answer | null;
  status: DailyStatus;
  /** True once this exchange has been kept as a Memory. */
  saved: boolean;
}

function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** The effective day key, including the dev-only simulated day offset. */
function todayKey(): string {
  const when = new Date(Date.now() + getDayOffset() * 86_400_000);
  return dateKeyInTimeZone(when, localTimeZone());
}

async function answersFor(
  service: DatabaseService,
  questionId: string,
  relId: string,
): Promise<{ mine: Answer | null; partner: Answer | null }> {
  if (isSupabaseConfigured()) return spAnswersFor(relId, questionId);
  const all = await service.listLive<Answer>('answers');
  const forQ = all.filter((a) => a.question_id === questionId);
  return {
    mine: forQ.find((a) => a.author === ME) ?? null,
    partner: forQ.find((a) => a.author === PARTNER) ?? null,
  };
}

function statusOf(mine: Answer | null, partner: Answer | null): DailyStatus {
  if (!mine) return 'answering';
  if (!partner) return 'waiting';
  return 'revealed';
}

/** Today's question and the current state of its exchange. */
export async function getToday(
  relId: string,
  service: DatabaseService = getService(),
): Promise<DailyState> {
  const dateKey = todayKey();
  const rotation = loadRotation(relId);
  const { state, questionId } = questionForDate(rotation, dateKey);
  saveRotation(relId, state);

  const question = getQuestion(questionId);
  if (!question) throw new Error('Today’s question could not be found.');

  const { mine, partner } = await answersFor(service, questionId, relId);
  const saved =
    mine != null && partner != null && (await isSavedAsMemory(service, question.text, relId));
  return { question, dateKey, myAnswer: mine, partnerAnswer: partner, status: statusOf(mine, partner), saved };
}

/**
 * Subscribe to live changes in today's exchange, calling `onChange` when either
 * partner's answer lands. On Supabase this is a realtime channel; on the local
 * stub there is no second device, so it's a no-op (dev-simulate drives changes
 * explicitly). Returns an unsubscribe the caller runs on teardown.
 */
export function subscribeToday(relId: string, onChange: () => void): () => void {
  if (isSupabaseConfigured()) return spSubscribeAnswers(relId, onChange);
  return () => {};
}

/**
 * Submit or edit my answer. Allowed until the reveal (partner has not answered).
 * Rejects an edit after reveal — the exchange is then immutable.
 */
export async function submitMyAnswer(
  relId: string,
  questionId: string,
  content: string,
  service: DatabaseService = getService(),
): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) throw new Error('Write a little something before submitting.');
  const { mine, partner } = await answersFor(service, questionId, relId);
  if (mine && partner) throw new Error('This answer is already revealed and can’t be changed.');
  if (isSupabaseConfigured()) {
    await spSubmitAnswer(relId, questionId, trimmed);
    return;
  }
  if (mine) {
    await service.updateAnswer(mine.id, { content: trimmed });
  } else {
    await service.createAnswer({ question_id: questionId, author: ME, content: trimmed });
  }
}

/** Keep this revealed exchange as a Memory (one tap). Returns the memory id. */
export async function saveAsMemory(
  relId: string,
  state: DailyState,
  opts: { title?: string; partnerName?: string } = {},
  service: DatabaseService = getService(),
): Promise<string> {
  if (state.status !== 'revealed' || !state.myAnswer || !state.partnerAnswer) {
    throw new Error('Only a revealed conversation can be saved as a memory.');
  }
  const partnerLabel = opts.partnerName?.trim() || 'Partner';
  const description =
    `“${state.question.text}”\n\n` +
    `You: ${state.myAnswer.content}\n\n` +
    `${partnerLabel}: ${state.partnerAnswer.content}`;
  const title = opts.title?.trim() || state.question.text;
  const memoryDate = Date.now();

  if (isSupabaseConfigured()) {
    return spCreateMemory(relId, { title, description, memory_date: memoryDate });
  }
  const memory = await service.createMemory({
    relationship_id: relId,
    title,
    description,
    memory_date: memoryDate,
    image_ref: null,
  });
  return memory.id;
}

async function isSavedAsMemory(
  service: DatabaseService,
  questionText: string,
  relId: string,
): Promise<boolean> {
  const memories = isSupabaseConfigured()
    ? await spGetMemories(relId)
    : await service.listLive<Memory>('memories');
  return memories.some((m) => m.description.includes(`“${questionText}”`));
}

// ---- DEV-ONLY controls (no backend yet) -----------------------------------

/** DEV: simulate the partner answering, so the reveal can be exercised now. */
export async function devSimulatePartner(
  questionId: string,
  service: DatabaseService = getService(),
): Promise<void> {
  const { partner } = await answersFor(service, questionId, '');
  if (partner) return;
  await service.createAnswer({
    question_id: questionId,
    author: PARTNER,
    content: 'This is a simulated partner answer (development build only).',
  });
}

/** DEV: advance the simulated day so tomorrow's question can be tested now. */
export function devAdvanceDay(): void {
  advanceDayOffset();
}

/** DEV: clear today's answers so the loop can be replayed. */
export async function devResetToday(
  questionId: string,
  service: DatabaseService = getService(),
): Promise<void> {
  const { mine, partner } = await answersFor(service, questionId, '');
  if (mine) await service.softDelete('answers', mine.id);
  if (partner) await service.softDelete('answers', partner.id);
}

/** DEV: reset the whole rotation + simulated day. */
export function devResetRotation(relId: string): void {
  resetRotation(relId);
}
