/**
 * Pings — for missing someone when you don't have the words.
 *
 * Built for the quieter half of a couple: opening a message box and finding
 * nothing to say is a real reason people go silent on each other for days. A
 * ping is one tap from a closed list of six warm things, so the hard part
 * (composing) is removed entirely.
 *
 * Two rules hold the feature honest:
 *
 * 1. **A ping never asks for anything.** None of the phrasings is a question,
 *    and the UI says so outright. It cannot be "left unanswered", so it can't
 *    become the guilt device that read receipts and unanswered texts are.
 * 2. **It cannot be used to pester.** A gentle daily cap applies (Section J caps
 *    relationship notifications at ~5/day). This is not an engagement limit —
 *    it exists because a channel that reaches someone unprompted is exactly the
 *    channel that can be turned against them, and an affectionate feature in a
 *    relationship app must be built assuming the relationship might not stay
 *    kind.
 *
 * Pings ride the existing message thread (`kind: 'ping'`) rather than inventing
 * a parallel store, so they inherit its RLS, realtime and encryption for free.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { getMessages } from '../messages';
import { spSendPing } from './supabaseRepo';
import { ME } from '../daily/service';
import { PINGS, type Message, type PingKind } from '../database/types';

/** What each ping says. Warm, short, and never a question. */
export const PING_TEXT: Record<PingKind, { emoji: string; text: string }> = {
  'thinking-of-you': { emoji: '🌿', text: 'Thinking of you' },
  'miss-you': { emoji: '🌙', text: 'Missing you' },
  'hope-today-is-kind': { emoji: '🌞', text: 'Hope today is kind to you' },
  'saw-something-you-would-like': { emoji: '🕊️', text: 'Saw something you’d like' },
  'no-need-to-reply': { emoji: '🤍', text: 'Just saying hello — no need to reply' },
  goodnight: { emoji: '✨', text: 'Goodnight' },
};

/** Gentle daily cap, matching Section J's ~5/day ceiling. */
export const DAILY_PING_LIMIT = 5;

/** Render a stored ping row for display; unknown values degrade to plain text. */
export function pingText(content: string): { emoji: string; text: string } {
  return PING_TEXT[content as PingKind] ?? { emoji: '🤍', text: content };
}

export function isPing(m: Message): boolean {
  return m.kind === 'ping';
}

/** How many pings I've sent today — used to keep the feature gentle. */
export async function pingsSentToday(
  relId: string | null,
  service: DatabaseService = getService(),
): Promise<number> {
  if (!relId) return 0;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const all = await getMessages(relId, service);
  return all.filter(
    (m) => m.kind === 'ping' && m.author === ME && m.created_at >= startOfDay.getTime(),
  ).length;
}

/**
 * Send a ping. Rejects an unknown ping (the vocabulary is closed on purpose)
 * and refuses once the day's gentle cap is reached.
 */
export async function sendPing(
  relId: string,
  ping: PingKind,
  service: DatabaseService = getService(),
): Promise<void> {
  if (!PINGS.includes(ping)) throw new Error('That isn’t one of the pings.');

  const sent = await pingsSentToday(relId, service);
  if (sent >= DAILY_PING_LIMIT) {
    throw new Error('You’ve sent a few already today — they’ll know you’re thinking of them.');
  }

  if (isSupabaseConfigured()) {
    await spSendPing(relId, ping);
    return;
  }
  await service.createMessage({
    relationship_id: relId,
    author: ME,
    content: ping,
    kind: 'ping',
  });
}
