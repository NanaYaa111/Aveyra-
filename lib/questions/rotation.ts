/**
 * Question rotation engine (pure, deterministic, backend-agnostic).
 *
 * Serves one question per day per relationship (Parts 3–4 decisions):
 *   • Day one is always the fixed opening question.
 *   • Thereafter, questions come from a shuffled cycle over the whole pool.
 *   • No two consecutive days repeat a question, even across a cycle boundary.
 *   • When a cycle is exhausted, the pool reshuffles into a fresh cycle
 *     ("exhaustion → shuffle → new cycle").
 *   • A skip is silent (no partner notification) and the skipped question
 *     returns later — it is re-queued to the end of the current cycle.
 *
 * Everything here is a pure function over a serialisable `RotationState`, so it
 * is trivially testable and storage-agnostic. The engine holds NO opinion about
 * timezones beyond the `dateKey` the caller passes: the caller is responsible
 * for computing the day key in the relationship's primary timezone (that policy
 * lives with the relationship, not the pool). See `dateKeyInTimeZone`.
 *
 * NOTE (draft assumption, to confirm in Parts 3–4): "skip returns later" is
 * modelled as re-queue-to-end-of-cycle and immediately advance to the next
 * question for the SAME day, so the couple is never left without a prompt.
 */

export interface RotationState {
  readonly version: 1;
  /** Deterministic base seed (derived from the relationship id). */
  seed: number;
  /** The fixed opening question id, served on day one. */
  firstQuestionId: string;
  /** Every selectable question id (the stable pool). */
  pool: string[];
  /** Completed-cycle counter (0 = still in the first shuffled cycle). */
  cycle: number;
  /** The shuffled id order for the current cycle. */
  order: string[];
  /** Index into `order` of the NEXT id to serve. */
  cursor: number;
  /** The last id served, to prevent consecutive repeats across cycles. */
  lastServedId: string | null;
  /** The day (dateKey) the current question was assigned. */
  assignedDateKey: string | null;
  /** The question assigned for `assignedDateKey` (idempotent within a day). */
  currentQuestionId: string | null;
  /** True once the fixed opener has been served. */
  started: boolean;
}

// ---- deterministic RNG ----------------------------------------------------

/** xfnv1a string hash → 32-bit seed. Stable across platforms. */
export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 PRNG — small, fast, deterministic. Returns a [0,1) generator. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic Fisher–Yates shuffle (does not mutate the input). */
export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const out = items.slice();
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const a = out[i]!;
    const b = out[j]!;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

// ---- date helpers ---------------------------------------------------------

/**
 * The calendar day key (YYYY-MM-DD) for an instant in a given IANA timezone.
 * The relationship's primary timezone decides when "a new day" begins
 * (Parts 3–4 decisions). Falls back to UTC for an unknown/invalid zone.
 */
export function dateKeyInTimeZone(when: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(when);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    return `${get('year')}-${get('month')}-${get('day')}`;
  } catch {
    return when.toISOString().slice(0, 10);
  }
}

// ---- engine ---------------------------------------------------------------

/** Build the initial rotation state for a relationship. */
export function createRotation(
  relationshipId: string,
  pool: readonly string[],
  firstQuestionId: string,
): RotationState {
  const seed = hashSeed(relationshipId);
  // First cycle excludes the opener (already served on day one); it rejoins
  // the pool from the next cycle onward.
  const firstCycle = shuffle(
    pool.filter((id) => id !== firstQuestionId),
    seed,
  );
  return {
    version: 1,
    seed,
    firstQuestionId,
    pool: pool.slice(),
    cycle: 0,
    order: firstCycle,
    cursor: 0,
    lastServedId: null,
    assignedDateKey: null,
    currentQuestionId: null,
    started: false,
  };
}

/** Reshuffle into the next cycle, avoiding an immediate repeat of the last id. */
function beginNextCycle(state: RotationState): void {
  state.cycle += 1;
  // Mix seed and cycle (rather than add) so relationships with seed-adjacent
  // hashes don't produce correlated per-cycle orders.
  const cycleSeed = (state.seed ^ Math.imul(state.cycle + 1, 0x9e3779b1)) >>> 0;
  const order = shuffle(state.pool, cycleSeed);
  // Guard against a cross-cycle consecutive repeat.
  if (order.length > 1 && order[0] === state.lastServedId) {
    const swap = order[1]!;
    order[1] = order[0]!;
    order[0] = swap;
  }
  state.order = order;
  state.cursor = 0;
}

/** Pop the next non-repeating question id, wrapping cycles as needed. */
function advance(state: RotationState): string {
  // Degenerate pool with nothing to rotate (an empty pool): keep serving
  // whatever was last served rather than indexing past the end. `advance` must
  // always return a real id, never `undefined`.
  if (state.pool.length === 0) {
    const id = state.lastServedId ?? state.firstQuestionId;
    state.lastServedId = id;
    return id;
  }
  if (state.cursor >= state.order.length) beginNextCycle(state);
  let id = state.order[state.cursor]!;
  // Extremely small pools could still line up a repeat; nudge forward once.
  if (id === state.lastServedId && state.order.length > 1) {
    state.cursor += 1;
    if (state.cursor >= state.order.length) beginNextCycle(state);
    id = state.order[state.cursor]!;
  }
  state.cursor += 1;
  state.lastServedId = id;
  return id;
}

/**
 * The question for a given day. Idempotent within a day: calling repeatedly
 * with the same `dateKey` returns the same question and the same state. A new
 * `dateKey` advances the rotation by exactly one.
 *
 * Callers must pass NON-DECREASING day keys. Any `dateKey` that differs from
 * the assigned one — including an earlier day — advances the rotation, so a
 * backward clock/timezone jump hands out a new question rather than
 * reproducing that day's prompt. (`dateKeyInTimeZone` returns a calendar date,
 * so DST alone never triggers this — only a genuine backward day jump does.)
 *
 * Returns a NEW state (never mutates the input) plus the chosen question id.
 */
export function questionForDate(
  state: RotationState,
  dateKey: string,
): { state: RotationState; questionId: string } {
  // Same day → return what was already assigned (stable within the day). Gated
  // on the date alone (a `dateKey` is a non-empty string and `assignedDateKey`
  // starts null); `!= null` (not truthiness) so a legitimately-assigned
  // empty-string id would still count as assigned rather than reassigned.
  if (state.assignedDateKey === dateKey && state.currentQuestionId != null) {
    return { state, questionId: state.currentQuestionId };
  }

  const next: RotationState = {
    ...state,
    pool: state.pool.slice(),
    order: state.order.slice(),
  };

  let questionId: string;
  if (!next.started) {
    questionId = next.firstQuestionId;
    next.started = true;
    next.lastServedId = questionId;
  } else {
    questionId = advance(next);
  }

  next.assignedDateKey = dateKey;
  next.currentQuestionId = questionId;
  return { state: next, questionId };
}

/**
 * Silently skip the current day's question. The skipped question is re-queued
 * to the end of the current cycle (it "returns later") and the next question
 * is assigned for the SAME day, so the couple always has a prompt. No-op-safe:
 * if nothing is assigned yet, this just assigns the day's question.
 */
export function skipQuestion(
  state: RotationState,
  dateKey: string,
): { state: RotationState; questionId: string } {
  const base = questionForDate(state, dateKey);
  const skipped = base.state.currentQuestionId;
  if (!skipped) return base;

  const next: RotationState = {
    ...base.state,
    pool: base.state.pool.slice(),
    order: base.state.order.slice(),
  };
  // Re-queue the skipped id so it comes back later this cycle.
  next.order.push(skipped);
  const questionId = advance(next);
  next.assignedDateKey = dateKey;
  next.currentQuestionId = questionId;
  return { state: next, questionId };
}
