import { describe, it, expect } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { Outbox } from '@/lib/sync/outbox';

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
