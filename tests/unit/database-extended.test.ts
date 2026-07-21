import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';

function freshService() {
  const db = new AveyraDB('aveyra-test-' + crypto.randomUUID());
  return { db, service: new DatabaseService(db, new Outbox(db)) };
}

describe('DatabaseService — record stamping', () => {
  let service: DatabaseService;
  beforeEach(() => {
    ({ service } = freshService());
  });

  it('stamps base fields on create', async () => {
    const answer = await service.createAnswer({
      question_id: 'q-open-01',
      author: 'partner_one',
      content: 'a first answer',
    });
    expect(answer.id).toBeTruthy();
    expect(answer.created_at).toBeGreaterThan(0);
    expect(answer.updated_at).toBe(answer.created_at);
    expect(answer.deleted_at).toBeNull();
    expect(answer.schema_version).toBeGreaterThanOrEqual(1);
    expect(answer.version).toBe(1);
  });

  it('gives each record a distinct id', async () => {
    const a = await service.createMemory({
      relationship_id: 'r1',
      title: 'One',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    const b = await service.createMemory({
      relationship_id: 'r1',
      title: 'Two',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    expect(a.id).not.toBe(b.id);
  });
});

describe('DatabaseService — versioning', () => {
  let service: DatabaseService;
  beforeEach(() => {
    ({ service } = freshService());
  });

  it('increments version and bumps updated_at on relationship update', async () => {
    const rel = await service.createRelationship({
      creator_id: 'u1',
      partner_id: null,
      status: 'solo',
      partner_name: 'Sam',
      relationship_start_date: null,
    });
    await service.updateRelationship(rel.id, { partner_name: 'Samuel', status: 'pending' });
    const after = await service.getRelationship();
    expect(after?.partner_name).toBe('Samuel');
    expect(after?.status).toBe('pending');
    expect(after?.version).toBe(2);
    expect(after!.updated_at).toBeGreaterThanOrEqual(rel.updated_at);
  });

  it('increments version on journal entry update', async () => {
    const entry = await service.createJournalEntry({ owner_id: 'u1', title: 'T', content: 'hi' });
    await service.updateJournalEntry(entry.id, { content: 'hello again' });
    await service.updateJournalEntry(entry.id, { content: 'and again' });
    const rows = await service.listLive('journalEntries');
    expect(rows).toHaveLength(1);
    expect((rows[0] as { version: number }).version).toBe(3);
  });
});

describe('DatabaseService — Recently Deleted', () => {
  let service: DatabaseService;
  beforeEach(() => {
    ({ service } = freshService());
  });

  it('excludes live rows and sorts newest-first with human labels', async () => {
    const mem = await service.createMemory({
      relationship_id: 'r1',
      title: 'Sunset walk',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    const entry = await service.createJournalEntry({ owner_id: 'u1', title: 'A letter', content: 'x' });

    await service.softDelete('memories', mem.id);
    await new Promise((r) => setTimeout(r, 2));
    await service.softDelete('journalEntries', entry.id);

    const deleted = await service.recentlyDeleted();
    expect(deleted).toHaveLength(2);
    // newest-first: the journal entry was deleted last
    expect(deleted[0]!.id).toBe(entry.id);
    expect(deleted[0]!.label).toBe('A letter');
    expect(deleted[1]!.label).toBe('Sunset walk');
  });

  it('falls back to a generic label when a title is empty', async () => {
    const entry = await service.createJournalEntry({ owner_id: 'u1', title: '', content: 'x' });
    await service.softDelete('journalEntries', entry.id);
    const [row] = await service.recentlyDeleted();
    expect(row!.label).toBe('Journal entry');
  });

  it('restore() clears the deleted state', async () => {
    const mem = await service.createMemory({
      relationship_id: 'r1',
      title: 'Keep me',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    await service.softDelete('memories', mem.id);
    await service.restore('memories', mem.id);
    expect(await service.recentlyDeleted()).toHaveLength(0);
    expect(await service.listLive('memories')).toHaveLength(1);
  });
});

describe('DatabaseService — misc', () => {
  let db: AveyraDB;
  let service: DatabaseService;
  beforeEach(() => {
    ({ db, service } = freshService());
  });

  it('get returns undefined for a missing id', async () => {
    expect(await service.get('memories', 'nope')).toBeUndefined();
  });

  it('records exports with an item count', async () => {
    await service.recordExport(12);
    const rows = await db.exportRecords.toArray();
    expect(rows).toHaveLength(1);
    expect(rows[0]!.item_count).toBe(12);
  });

  it('getSettings creates a default singleton exactly once', async () => {
    const a = await service.getSettings();
    const b = await service.getSettings();
    expect(a.id).toBe('app');
    expect(b.id).toBe('app');
    expect(await db.settings.count()).toBe(1);
  });
});
