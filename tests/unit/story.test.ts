import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';
import { getMemories } from '@/lib/story';

function freshService() {
  const db = new AveyraDB('aveyra-test-' + crypto.randomUUID());
  return new DatabaseService(db, new Outbox(db));
}

let service: DatabaseService;
beforeEach(() => {
  service = freshService();
});

describe('story — getMemories', () => {
  it('returns memories newest first by memory_date', async () => {
    await service.createMemory({
      relationship_id: 'r1',
      title: 'Older',
      description: 'a',
      memory_date: 1000,
      image_ref: null,
    });
    await service.createMemory({
      relationship_id: 'r1',
      title: 'Newer',
      description: 'b',
      memory_date: 5000,
      image_ref: null,
    });
    await service.createMemory({
      relationship_id: 'r1',
      title: 'Middle',
      description: 'c',
      memory_date: 3000,
      image_ref: null,
    });

    const memories = await getMemories('r1', service);
    expect(memories.map((m) => m.title)).toEqual(['Newer', 'Middle', 'Older']);
  });

  it('is empty when nothing has been kept', async () => {
    expect(await getMemories('r1', service)).toEqual([]);
  });
});
