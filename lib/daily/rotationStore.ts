/**
 * Rotation-state persistence for the daily loop (Milestone 2).
 *
 * The rotation engine is pure over a serialisable `RotationState`; something has
 * to hold that state between days. For now it lives in localStorage keyed by
 * relationship id — it is question-ordering metadata, NOT relationship content
 * (answers/memories go through the encrypted DB). When the backend lands, this
 * state moves server-side so both devices share one rotation; nothing above the
 * daily service changes.
 *
 * Also holds a DEV-ONLY simulated day offset so "advance day" can exercise the
 * once-per-day rollover without waiting 24h. The offset is dev scaffolding and
 * has no meaning once real time + backend drive the cadence.
 */
import {
  createRotation,
  type RotationState,
} from '../questions/rotation';
import { QUESTION_BANK, FIRST_QUESTION_ID, ALL_QUESTION_IDS } from '../questions/bank';

const key = (relId: string) => `aveyra-rotation-${relId}`;
const DAY_OFFSET_KEY = 'aveyra-dev-day-offset';

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

/** Load the persisted rotation, creating a fresh one for this relationship. */
export function loadRotation(relId: string): RotationState {
  if (hasStorage()) {
    const raw = localStorage.getItem(key(relId));
    if (raw) {
      try {
        return JSON.parse(raw) as RotationState;
      } catch {
        /* fall through to a fresh rotation */
      }
    }
  }
  return createRotation(relId, ALL_QUESTION_IDS, FIRST_QUESTION_ID);
}

export function saveRotation(relId: string, state: RotationState): void {
  if (hasStorage()) localStorage.setItem(key(relId), JSON.stringify(state));
}

/** DEV: how many simulated days to add to "today". */
export function getDayOffset(): number {
  if (!hasStorage()) return 0;
  return Number(localStorage.getItem(DAY_OFFSET_KEY) ?? '0') || 0;
}

/** DEV: advance the simulated day by one (drives the next question). */
export function advanceDayOffset(): void {
  if (hasStorage()) localStorage.setItem(DAY_OFFSET_KEY, String(getDayOffset() + 1));
}

/** DEV: reset both the rotation and the simulated day (for testing). */
export function resetRotation(relId: string): void {
  if (!hasStorage()) return;
  localStorage.removeItem(key(relId));
  localStorage.removeItem(DAY_OFFSET_KEY);
}

/** The whole authored pool, for callers that want the QuestionSeed by id. */
export { QUESTION_BANK };
