import { describe, it, expect } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { Outbox } from '@/lib/sync/outbox';
import { SyncEngine, LocalStubTransport } from '@/lib/sync';
import type { Mutation } from '@/lib/sync/types';

function freshOutbox() {
  return new Outbox(new AveyraDB('aveyra-test-' + crypto.randomUUID()));
}

describe('outbox', () => {
  it('records and lists pending mutations oldest-first', async () => {
    const outbox = freshOutbox();
    await outbox.record('memories', 'put', 'm1', 1);
    await outbox.record('answers', 'put', 'a1', 1);
    const pending = await outbox.pending();
    expect(pending).toHaveLength(2);
    expect(pending[0]!.timestamp).toBeLessThanOrEqual(pending[1]!.timestamp);
  });

  it('marks mutations synced', async () => {
    const outbox = freshOutbox();
    await outbox.record('memories', 'put', 'm1', 1);
    const [m] = await outbox.pending();
    await outbox.markSynced([m!.id]);
    expect(await outbox.pending()).toHaveLength(0);
  });
});

describe('SyncEngine', () => {
  it('the stub transport accepts nothing and leaves the outbox pending', async () => {
    const outbox = freshOutbox();
    await outbox.record('memories', 'put', 'm1', 1);
    const engine = new SyncEngine(new LocalStubTransport(), outbox);
    expect(await engine.flush()).toBe(0);
    expect(await outbox.pending()).toHaveLength(1);
  });

  it('resolves conflicts by version, then timestamp', () => {
    const base: Omit<Mutation, 'version' | 'timestamp'> = {
      id: 'x',
      table: 'answers',
      op: 'put',
      record_id: 'a1',
      synced: 0,
    };
    const older = { ...base, version: 1, timestamp: 100 };
    const newerVersion = { ...base, version: 2, timestamp: 50 };
    expect(SyncEngine.resolveConflict(older, newerVersion)).toBe(newerVersion);

    const sameVersionNewer = { ...base, version: 1, timestamp: 200 };
    expect(SyncEngine.resolveConflict(older, sameVersionNewer)).toBe(sameVersionNewer);
  });

  it('resolveConflict is argument-order-agnostic and resolves ties deterministically', () => {
    const base: Omit<Mutation, 'version' | 'timestamp'> = {
      id: 'x',
      table: 'answers',
      op: 'put',
      record_id: 'a1',
      synced: 0,
    };
    const lowV = { ...base, version: 1, timestamp: 100 };
    const highV = { ...base, version: 2, timestamp: 100 };
    // Higher version wins regardless of which argument it is.
    expect(SyncEngine.resolveConflict(highV, lowV)).toBe(highV);
    expect(SyncEngine.resolveConflict(lowV, highV)).toBe(highV);

    // Same version → higher timestamp wins regardless of order.
    const t1 = { ...base, version: 1, timestamp: 100 };
    const t2 = { ...base, version: 1, timestamp: 200 };
    expect(SyncEngine.resolveConflict(t2, t1)).toBe(t2);
    expect(SyncEngine.resolveConflict(t1, t2)).toBe(t2);

    // Full tie (equal version AND timestamp) resolves to the remote (the `>=`
    // branch) so replaying the same pair is stable.
    const tieL = { ...base, version: 1, timestamp: 100 };
    const tieR = { ...base, version: 1, timestamp: 100 };
    expect(SyncEngine.resolveConflict(tieL, tieR)).toBe(tieR);
  });
});
