import { describe, it, expect } from 'vitest';
import {
  QUESTION_BANK,
  ALL_QUESTION_IDS,
  FIRST_QUESTION_ID,
  getQuestion,
} from '@/lib/questions/bank';
import { CATEGORY_SLUGS, CATEGORY_LABELS } from '@/lib/questions/types';
import {
  createRotation,
  questionForDate,
  skipQuestion,
  dateKeyInTimeZone,
  hashSeed,
  shuffle,
  type RotationState,
} from '@/lib/questions/rotation';

// ---- helpers --------------------------------------------------------------

const BASE = Date.UTC(2026, 0, 1); // 2026-01-01
const dayKey = (offset: number): string =>
  new Date(BASE + offset * 86_400_000).toISOString().slice(0, 10);

function runDays(start: RotationState, days: number) {
  let state = start;
  const ids: string[] = [];
  for (let d = 0; d < days; d++) {
    const r = questionForDate(state, dayKey(d));
    state = r.state;
    ids.push(r.questionId);
  }
  return { ids, state };
}

function makeRotation(relId = 'rel-test') {
  return createRotation(relId, ALL_QUESTION_IDS, FIRST_QUESTION_ID);
}

// ---- bank integrity -------------------------------------------------------

describe('question bank — integrity', () => {
  it('has a healthy pool size (~190)', () => {
    // Draft bank: the fixed opener + nine canonical categories (Section E).
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(175);
    expect(QUESTION_BANK.length).toBeLessThanOrEqual(215);
  });

  it('has unique ids', () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exposes the fixed opening question with the decided wording', () => {
    const opener = getQuestion(FIRST_QUESTION_ID);
    expect(opener).toBeDefined();
    expect(opener!.text).toBe(
      `What's one small thing about yourself that you hope I always remember?`,
    );
  });

  it('covers all nine canonical categories', () => {
    const present = new Set(QUESTION_BANK.map((q) => q.category));
    for (const slug of CATEGORY_SLUGS) expect(present.has(slug)).toBe(true);
    expect(present.size).toBe(CATEGORY_SLUGS.length);
  });

  it('gives every category a human label', () => {
    for (const slug of CATEGORY_SLUGS) {
      expect(CATEGORY_LABELS[slug].length).toBeGreaterThan(0);
    }
  });

  it('gives every category a meaningful spread of questions', () => {
    for (const slug of CATEGORY_SLUGS) {
      const count = QUESTION_BANK.filter((q) => q.category === slug).length;
      expect(count).toBeGreaterThanOrEqual(15);
    }
  });

  it('uses only valid depth hints (1–3)', () => {
    for (const q of QUESTION_BANK) expect([1, 2, 3]).toContain(q.depth);
  });

  it('every question is a non-empty, question-shaped prompt', () => {
    for (const q of QUESTION_BANK) {
      expect(q.text.trim().length).toBeGreaterThan(8);
      expect(q.text.trim().endsWith('?')).toBe(true);
    }
  });

  it('contains no prohibited framing (streaks, scores, ranking, "difficulty", tests)', () => {
    // Part 2 §1.2 permanent prohibitions + Q9 (never surface "difficulty").
    const banned = /\b(streak|score|scored|ranking|ranked|leaderboard|points|level up|difficulty|quiz|graded?)\b/i;
    for (const q of QUESTION_BANK) {
      expect(banned.test(q.text), `prohibited framing in "${q.text}"`).toBe(false);
    }
  });

  it('never renders a partner as a deficit ("why don\'t you", "what\'s wrong with")', () => {
    const deficit = /(what's wrong with|why don't you ever|why can't you|you never|you always)/i;
    for (const q of QUESTION_BANK) {
      expect(deficit.test(q.text), `deficit framing in "${q.text}"`).toBe(false);
    }
  });

  it('getQuestion returns undefined for unknown ids', () => {
    expect(getQuestion('q-nope-99')).toBeUndefined();
  });
});

// ---- deterministic primitives --------------------------------------------

describe('rotation primitives', () => {
  it('hashSeed is deterministic and stable', () => {
    expect(hashSeed('rel-abc')).toBe(hashSeed('rel-abc'));
    expect(hashSeed('rel-abc')).not.toBe(hashSeed('rel-xyz'));
  });

  it('shuffle is a deterministic permutation', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const a = shuffle(input, 123);
    const b = shuffle(input, 123);
    expect(a).toEqual(b);
    expect([...a].sort()).toEqual([...input].sort());
    // does not mutate the input
    expect(input).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('shuffle differs for different seeds (very likely)', () => {
    const input = Array.from({ length: 20 }, (_, i) => String(i));
    expect(shuffle(input, 1)).not.toEqual(shuffle(input, 2));
  });
});

// ---- date keys ------------------------------------------------------------

describe('dateKeyInTimeZone', () => {
  it('formats YYYY-MM-DD in the given zone', () => {
    // 2026-01-01T02:30Z is still 2025-12-31 in Honolulu (UTC-10).
    const when = new Date(Date.UTC(2026, 0, 1, 2, 30));
    expect(dateKeyInTimeZone(when, 'Pacific/Honolulu')).toBe('2025-12-31');
    expect(dateKeyInTimeZone(when, 'UTC')).toBe('2026-01-01');
  });

  it('honours Accra (the relationship\'s zone in this project) as UTC+0', () => {
    const when = new Date(Date.UTC(2026, 6, 21, 12, 0));
    expect(dateKeyInTimeZone(when, 'Africa/Accra')).toBe('2026-07-21');
  });

  it('falls back to UTC for an invalid zone', () => {
    const when = new Date(Date.UTC(2026, 0, 1, 12, 0));
    expect(dateKeyInTimeZone(when, 'Not/AZone')).toBe('2026-01-01');
  });
});

// ---- rotation behaviour ---------------------------------------------------

describe('question rotation', () => {
  it('always serves the fixed opener on day one', () => {
    const { ids } = runDays(makeRotation(), 1);
    expect(ids[0]).toBe(FIRST_QUESTION_ID);
  });

  it('is idempotent within a single day', () => {
    const state = makeRotation();
    const a = questionForDate(state, dayKey(0));
    const b = questionForDate(a.state, dayKey(0));
    expect(b.questionId).toBe(a.questionId);
    // same-day recompute returns the same state object (no drift)
    expect(b.state).toBe(a.state);
  });

  it('does not mutate the input state', () => {
    const state = makeRotation();
    const snapshot = JSON.stringify(state);
    questionForDate(state, dayKey(0));
    expect(JSON.stringify(state)).toBe(snapshot);
  });

  it('never repeats on consecutive days over a long run', () => {
    const { ids } = runDays(makeRotation(), 600);
    for (let i = 1; i < ids.length; i++) {
      expect(ids[i], `repeat at day ${i}: ${ids[i]}`).not.toBe(ids[i - 1]);
    }
  });

  it('serves every non-opener question once before repeating (first cycle)', () => {
    // Day one is the opener; the next (pool-1) days should exhaust the rest.
    const cycleLen = ALL_QUESTION_IDS.length - 1;
    const { ids } = runDays(makeRotation(), cycleLen + 1);
    const afterOpener = ids.slice(1); // drop the opener
    expect(new Set(afterOpener).size).toBe(cycleLen);
    const expected = new Set(ALL_QUESTION_IDS.filter((id) => id !== FIRST_QUESTION_ID));
    expect(new Set(afterOpener)).toEqual(expected);
  });

  it('reshuffles into a new cycle once exhausted', () => {
    const cycleLen = ALL_QUESTION_IDS.length - 1;
    const { state } = runDays(makeRotation(), cycleLen + 2);
    expect(state.cycle).toBeGreaterThanOrEqual(1);
  });

  it('is deterministic for the same relationship id', () => {
    const a = runDays(makeRotation('rel-fixed'), 300).ids;
    const b = runDays(makeRotation('rel-fixed'), 300).ids;
    expect(a).toEqual(b);
  });

  it('produces different sequences for different relationships', () => {
    const a = runDays(makeRotation('rel-one'), 50).ids;
    const b = runDays(makeRotation('rel-two'), 50).ids;
    expect(a).not.toEqual(b);
  });

  it('advances by exactly one when the day changes', () => {
    const state = makeRotation();
    const d0 = questionForDate(state, dayKey(0));
    const d1 = questionForDate(d0.state, dayKey(1));
    expect(d1.questionId).not.toBe(d0.questionId);
  });
});

// ---- skip -----------------------------------------------------------------

describe('silent skip', () => {
  it('assigns a different question for the same day', () => {
    const state = makeRotation();
    // move past the fixed opener to a normal rotation day
    const d1 = questionForDate(state, dayKey(1));
    const skipped = d1.questionId;
    const after = skipQuestion(d1.state, dayKey(1));
    expect(after.questionId).not.toBe(skipped);
    expect(after.state.currentQuestionId).toBe(after.questionId);
  });

  it('returns the skipped question later (it is not lost)', () => {
    const state = makeRotation();
    const d1 = questionForDate(state, dayKey(1));
    const skipped = d1.questionId;
    let s = skipQuestion(d1.state, dayKey(1)).state;

    const seen = new Set<string>();
    for (let d = 2; d < ALL_QUESTION_IDS.length + 5; d++) {
      const r = questionForDate(s, dayKey(d));
      s = r.state;
      seen.add(r.questionId);
    }
    expect(seen.has(skipped)).toBe(true);
  });

  it('is safe to call before any question is assigned (assigns then skips the opener)', () => {
    const state = makeRotation();
    const r = skipQuestion(state, dayKey(0));
    // Nothing was assigned yet, so it assigns the opener and skips past it —
    // no crash, and a valid pool question comes back.
    expect(r.questionId).not.toBe(FIRST_QUESTION_ID);
    expect(ALL_QUESTION_IDS).toContain(r.questionId);
    // The skipped opener is re-queued, so it still appears later.
    let s = r.state;
    const seen = new Set<string>();
    for (let d = 1; d < ALL_QUESTION_IDS.length + 2; d++) {
      const step = questionForDate(s, dayKey(d));
      s = step.state;
      seen.add(step.questionId);
    }
    expect(seen.has(FIRST_QUESTION_ID)).toBe(true);
  });
});

// ---- small-pool edge cases ------------------------------------------------

describe('rotation — small pools', () => {
  const smallPool = ['a', 'b', 'c'];

  it('alternates without consecutive repeats on a tiny pool', () => {
    let s = createRotation('rel-small', smallPool, 'a');
    const ids: string[] = [];
    for (let d = 0; d < 30; d++) {
      const r = questionForDate(s, dayKey(d));
      s = r.state;
      ids.push(r.questionId);
    }
    for (let i = 1; i < ids.length; i++) expect(ids[i]).not.toBe(ids[i - 1]);
  });

  it('handles a single-question pool without infinite loops', () => {
    let s = createRotation('rel-one-q', ['only'], 'only');
    const ids: string[] = [];
    for (let d = 0; d < 5; d++) {
      const r = questionForDate(s, dayKey(d));
      s = r.state;
      ids.push(r.questionId);
    }
    expect(ids.every((id) => id === 'only')).toBe(true);
  });
});

describe('rotation — degenerate empty pool (public-API robustness)', () => {
  it('never returns an undefined question id', () => {
    let s = createRotation('rel-empty', [], 'opener');
    for (let d = 0; d < 5; d++) {
      const r = questionForDate(s, dayKey(d));
      s = r.state;
      expect(typeof r.questionId).toBe('string');
      expect(r.questionId.length).toBeGreaterThan(0);
    }
  });

  it('stays idempotent within a day and does not drift', () => {
    const s0 = createRotation('rel-empty', [], 'opener');
    // Assign day 1 (past the opener), then re-ask the same day repeatedly.
    const d0 = questionForDate(s0, dayKey(0));
    const d1 = questionForDate(d0.state, dayKey(1));
    const again = questionForDate(d1.state, dayKey(1));
    expect(again.questionId).toBe(d1.questionId);
    expect(again.state).toBe(d1.state); // same object → no cycle drift
    expect(again.state.cycle).toBe(d1.state.cycle);
  });
});
