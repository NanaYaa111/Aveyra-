import { getDB, type AveyraDB } from '../database/db';
import type { Mutation, MutationOp } from './types';

/**
 * The mutation outbox. Every local write is journalled here so it can later be
 * synced to a partner device without changing the write path (Constitution
 * Part 3 §2.2 — local truth is never "waiting to sync"; it is stored, and the
 * outbox is a separate, non-blocking record).
 */
export class Outbox {
  constructor(private db: AveyraDB = getDB()) {}

  async record(
    table: string,
    op: MutationOp,
    recordId: string,
    version: number,
    payload?: string,
  ): Promise<void> {
    const mutation: Mutation = {
      id: crypto.randomUUID(),
      table,
      op,
      record_id: recordId,
      payload,
      timestamp: Date.now(),
      version,
      synced: 0,
    };
    await this.db.outbox.add(mutation);
  }

  /** Mutations not yet accepted by a transport, oldest first. */
  async pending(): Promise<Mutation[]> {
    const all = await this.db.outbox.toArray();
    return all.filter((m) => m.synced === 0).sort((a, b) => a.timestamp - b.timestamp);
  }

  async markSynced(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.db.outbox.update(id, { synced: 1 })));
  }

  async count(): Promise<number> {
    return this.db.outbox.count();
  }
}

let outbox: Outbox | null = null;
export function getOutbox(): Outbox {
  if (!outbox) outbox = new Outbox();
  return outbox;
}
