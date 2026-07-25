/**
 * Local mutation-journal types (backend-agnostic). Every local write is
 * recorded to an outbox for bookkeeping/audit purposes.
 *
 * Note: real cross-device sync does NOT go through this outbox — the
 * web-first amendment (2026-07-21) explicitly dropped offline-first and the
 * "full offline sync/CRDT/conflict reconciliation" architecture this outbox
 * was originally built for. Two-device sync instead happens directly through
 * the Supabase repos (see lib/daily/supabaseRepo.ts and siblings), which write
 * straight to the shared backend rather than queueing for a later transport.
 * `synced`/`markSynced` are currently unused by any caller; the outbox exists
 * only to journal local mutations, not to feed a sync engine.
 */

export type MutationOp = 'put' | 'delete';

/** A single recorded local change. */
export interface Mutation {
  id: string;
  /** The logical table this change targets. */
  table: string;
  op: MutationOp;
  record_id: string;
  /**
   * Encrypted payload for the record (put only). Stored as an opaque string so
   * the outbox never holds plaintext once field encryption is active.
   */
  payload?: string;
  /** Wall-clock time + record version. */
  timestamp: number;
  version: number;
  /** Legacy field from the original sync-transport design; always 0 now that no transport consumes the outbox. */
  synced: 0 | 1;
}
