/**
 * Sync foundation types (backend-agnostic). Milestone 1 journals every local
 * mutation into an outbox behind an abstract transport; the concrete backend
 * and live cross-device sync arrive in Milestone 2 (two-device amendment §
 * sequencing). There is deliberately NO user-facing sync state yet
 * (Constitution Part 2 §5 — no sync UI until sync exists).
 */

export type MutationOp = 'put' | 'delete';

/** A single recorded change, ready to be shipped to a partner device later. */
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
  /** Wall-clock time + record version for conflict resolution (last-writer). */
  timestamp: number;
  version: number;
  /** Whether this mutation has been accepted by a transport. */
  synced: 0 | 1;
}

/**
 * The boundary between local truth and any future remote state. Implementations
 * move opaque, already-encrypted mutations; they never see plaintext or keys
 * (amendment A2 — the relay stores only ciphertext).
 */
export interface SyncTransport {
  readonly name: string;
  /** Push locally-journalled mutations. Resolves with the ids accepted. */
  push(mutations: Mutation[]): Promise<string[]>;
  /** Pull mutations from the partner since a cursor. */
  pull(sinceTimestamp: number): Promise<Mutation[]>;
}
