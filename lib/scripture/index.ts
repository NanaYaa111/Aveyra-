/**
 * Scripture — a verse a day, the same one for both of you.
 *
 * Uses the same deterministic shuffle the daily question uses, seeded from the
 * relationship id: both devices compute the same verse for the same date with no
 * server involved, and the sequence doesn't repeat until it has been all the way
 * through. Nothing to sync, nothing to schedule.
 *
 * Translation is a **personal** setting, not a shared one — each of you reads in
 * the voice you prefer while receiving the same verse (Volume 2 Section K:
 * personal settings stay personal).
 */
import { hashSeed, shuffle, dateKeyInTimeZone } from '../questions/rotation';
import { VERSES, type Translation, type Verse } from './verses';

const TRANSLATION_KEY = 'aveyra.scripture.translation';

function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** Days since the epoch for a YYYY-MM-DD key — the index into the shuffled set. */
function dayNumber(dateKey: string): number {
  return Math.floor(Date.parse(dateKey + 'T00:00:00Z') / 86_400_000);
}

/**
 * Today's verse for this relationship. Deterministic: same inputs, same verse,
 * on both devices and on every reload.
 */
export function verseForDate(relId: string, when: Date = new Date()): Verse {
  const dateKey = dateKeyInTimeZone(when, localTimeZone());
  const order = shuffle(VERSES, hashSeed(relId));
  const index = ((dayNumber(dateKey) % order.length) + order.length) % order.length;
  return order[index]!;
}

/** The reader's chosen translation. Personal, per device. */
export function getTranslation(): Translation {
  if (typeof localStorage === 'undefined') return 'web';
  const stored = localStorage.getItem(TRANSLATION_KEY);
  return stored === 'kjv' || stored === 'web' ? stored : 'web';
}

export function setTranslation(t: Translation): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(TRANSLATION_KEY, t);
}

export { textOf, TRANSLATION_NAMES, VERSES, type Translation, type Verse } from './verses';
