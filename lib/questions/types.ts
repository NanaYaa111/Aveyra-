/**
 * Question content model (backend-agnostic foundation).
 *
 * A daily question is an INVITATION, never a test (Constitution Part 2 §1.2,
 * Part 5 §3). Questions deepen gradually, but "difficulty" is an internal
 * ordering hint only — it is NEVER surfaced in the UI (open-questions Q9).
 *
 * This module carries content and pure selection logic. It touches no UI and
 * no backend, mirroring how invitation/sync/identity ship as foundations ahead
 * of the features that consume them.
 */

/** The ten content categories. Slugs are stable ids — never rename in place. */
export type CategorySlug =
  | 'everyday'
  | 'our-story'
  | 'dreams'
  | 'values'
  | 'growth'
  | 'gratitude'
  | 'play'
  | 'inner-world'
  | 'us'
  | 'care';

/** Human labels for categories. Warm, plain, never clinical. */
export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  everyday: 'Everyday Life & Small Joys',
  'our-story': 'Our Story',
  dreams: 'Dreams & The Future',
  values: 'Values & Beliefs',
  growth: 'Growth & Change',
  gratitude: 'Gratitude & Appreciation',
  play: 'Play & Imagination',
  'inner-world': 'Feelings & Inner World',
  us: 'Us',
  care: 'Comfort & Care',
};

export const CATEGORY_SLUGS: readonly CategorySlug[] = [
  'everyday',
  'our-story',
  'dreams',
  'values',
  'growth',
  'gratitude',
  'play',
  'inner-world',
  'us',
  'care',
];

/**
 * Internal-only depth hint (1 = light/opening, 3 = tender/vulnerable). Used to
 * order questions within a category so a cycle eases inward. NEVER rendered,
 * labelled, scored, or exposed as "difficulty" (open-questions Q9).
 */
export type Depth = 1 | 2 | 3;

/** A single authored question. Immutable content; no per-user state here. */
export interface QuestionSeed {
  /** Stable id, e.g. `q-everyday-01`. Never reused for different text. */
  id: string;
  category: CategorySlug;
  /** The prompt, phrased as a gentle invitation in the partner's voice. */
  text: string;
  /** Internal ordering hint only — see Depth. */
  depth: Depth;
}
