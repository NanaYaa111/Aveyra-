/**
 * The daily scripture ritual: whoever arrives first chooses the verse, and the
 * other one answers it.
 *
 * The shape matters. Not two people posting past each other, and not the same
 * verse handed to both by an algorithm — one person picks something *for* the
 * other, and the other reads it and says what it stirred. Whoever is first
 * changes day to day, so neither of you is permanently the one who leads.
 *
 * A suggested verse is offered (from the bundled rotation) so choosing isn't a
 * blank page, but it can always be swapped for another.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { dateKeyInTimeZone } from '../questions/rotation';
import { ME } from '../daily/service';
import { verseForDate, textOf, VERSES, type Translation } from './index';
import {
  spGetDailyScripture,
  spChooseScripture,
  spRespondToScripture,
  spSubscribeScripture,
} from './supabaseRepo';
import type { DailyScripture } from '../database/types';

export type RitualStage =
  /** Nobody has chosen today. Whoever opens this first gets to. */
  | 'open'
  /** I chose; waiting to hear what they make of it. */
  | 'waiting'
  /** They chose; it's mine to respond to. */
  | 'to-respond'
  /** Both parts are in. */
  | 'complete';

export interface RitualState {
  dateKey: string;
  entry: DailyScripture | null;
  stage: RitualStage;
  /** Offered when nothing is chosen yet, so the day doesn't start on a blank page. */
  suggestion: { reference: string; text: string };
}

function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function todayKey(): string {
  return dateKeyInTimeZone(new Date(), localTimeZone());
}

function stageOf(entry: DailyScripture | null): RitualStage {
  if (!entry) return 'open';
  if (entry.responded_at !== null) return 'complete';
  return entry.chooser === ME ? 'waiting' : 'to-respond';
}

/** Today's state of the ritual. */
export async function getRitual(
  relId: string | null,
  translation: Translation,
  service: DatabaseService = getService(),
): Promise<RitualState> {
  const dateKey = todayKey();
  const suggested = relId ? verseForDate(relId) : VERSES[0]!;
  const suggestion = { reference: suggested.ref, text: textOf(suggested, translation) };

  if (!relId) return { dateKey, entry: null, stage: 'open', suggestion };

  const entry = isSupabaseConfigured()
    ? await spGetDailyScripture(relId, dateKey)
    : ((await service.listLive<DailyScripture>('dailyScriptures')).find(
        (s) => s.date_key === dateKey,
      ) ?? null);

  return { dateKey, entry, stage: stageOf(entry), suggestion };
}

/**
 * Live updates: their verse, or their answer, appears as it lands. The second
 * half of this ritual is reading what the other person said, so waiting on a
 * manual refresh would be waiting on the wrong thing.
 */
export function subscribeRitual(relId: string, onChange: () => void): () => void {
  if (isSupabaseConfigured()) return spSubscribeScripture(relId, onChange);
  return () => {};
}

/**
 * Choose today's verse. Only the first person to arrive can — a second attempt
 * is refused rather than overwriting, so nobody's choice is quietly replaced.
 */
export async function chooseScripture(
  relId: string,
  verse: { reference: string; text: string },
  note: string,
  service: DatabaseService = getService(),
): Promise<void> {
  const { entry } = await getRitual(relId, 'web', service);
  if (entry) throw new Error('Today’s verse is already chosen.');

  const dateKey = todayKey();
  if (isSupabaseConfigured()) {
    await spChooseScripture(relId, dateKey, verse, note.trim());
    return;
  }
  await service.createDailyScripture({
    relationship_id: relId,
    date_key: dateKey,
    chooser: ME,
    reference: verse.reference,
    text: verse.text,
    chooser_note: note.trim(),
    response: '',
    responded_at: null,
  });
}

/**
 * Answer the verse the other person chose. Refused if you're the one who chose
 * it — the ritual is two voices, not one talking to itself.
 */
export async function respondToScripture(
  relId: string,
  response: string,
  service: DatabaseService = getService(),
): Promise<void> {
  const trimmed = response.trim();
  if (!trimmed) throw new Error('Write a little something first.');

  const { entry } = await getRitual(relId, 'web', service);
  if (!entry) throw new Error('Nothing has been chosen today yet.');
  if (entry.chooser === ME) throw new Error('You chose today’s verse — this one is theirs to answer.');
  if (entry.responded_at !== null) throw new Error('You’ve already answered today.');

  if (isSupabaseConfigured()) {
    await spRespondToScripture(entry.id, trimmed);
    return;
  }
  await service.updateDailyScripture(entry.id, { response: trimmed, responded_at: Date.now() });
}
