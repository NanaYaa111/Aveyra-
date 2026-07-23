/**
 * Question content model (backend-agnostic foundation).
 *
 * A daily question is an INVITATION, never a test (Constitution Part 2 §1.2,
 * Part 5 §3). Questions deepen gradually, but "difficulty" is an internal
 * ordering hint only — it is NEVER surfaced in the UI (open-questions Q9).
 *
 * Categories are the CANONICAL 9 from Volume 2 Part 3 Section E (open-questions
 * Q14), with a Love Maps sub-tag under Discovery. This module carries content and
 * pure selection logic — no UI, no backend.
 */

/** The nine canonical content categories (Section E). Slugs are stable ids. */
export type CategorySlug =
  | 'discovery'
  | 'appreciation'
  | 'memories'
  | 'communication'
  | 'dreams-future'
  | 'growth'
  | 'reflection'
  | 'fun-play'
  | 'conflict-repair';

/** Human labels. Warm, plain, never clinical. */
export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  discovery: 'Discovery',
  appreciation: 'Appreciation',
  memories: 'Memories',
  communication: 'Communication',
  'dreams-future': 'Dreams & Future',
  growth: 'Growth',
  reflection: 'Reflection',
  'fun-play': 'Fun & Play',
  'conflict-repair': 'Conflict & Repair',
};

export const CATEGORY_SLUGS: readonly CategorySlug[] = [
  'discovery',
  'appreciation',
  'memories',
  'communication',
  'dreams-future',
  'growth',
  'reflection',
  'fun-play',
  'conflict-repair',
];

/**
 * Optional sub-category. Only "love-maps" for now — Gottman-style questions that
 * map a partner's inner world, nested under Discovery (Section E).
 */
export type SubCategory = 'love-maps';

/**
 * Internal-only depth hint (1 = light/opening, 3 = tender/vulnerable). Orders
 * questions within a category so a cycle eases inward. NEVER rendered, labelled,
 * scored, or exposed as "difficulty" (open-questions Q9). Conflict & Repair is a
 * deeper category by nature — surfaced sparingly once trust has grown (Section E).
 */
export type Depth = 1 | 2 | 3;

/** A single authored question. Immutable content; no per-user state here. */
export interface QuestionSeed {
  /** Stable id, e.g. `q-discovery-01`. Never reused for different text. */
  id: string;
  category: CategorySlug;
  /** The prompt, phrased as a gentle invitation in the partner's voice. */
  text: string;
  /** Internal ordering hint only — see Depth. */
  depth: Depth;
  /** Optional sub-category tag (e.g. Love Maps under Discovery). */
  sub?: SubCategory;
}
