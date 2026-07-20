import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';

function freshService() {
  const db = new AveyraDB('aveyra-test-' + crypto.randomUUID());
  return { db, service: new DatabaseService(db, new Outbox(db)) };
}

describe('DatabaseService', () => {
  let db: AveyraDB;
  let service: DatabaseService;

  beforeEach(() => {
    ({ db, service } = freshService());
  });

  it('creates a relationship and reads it back', async () => {
    const rel = await service.createRelationship({
      creator_id: 'u1',
      partner_id: null,
      status: 'solo',
      partner_name: 'Sam',
      relationship_start_date: Date.now(),
    });
    expect(rel.id).toBeTruthy();
    expect(rel.deleted_at).toBeNull();
    const found = await service.getRelationship();
    expect(found?.partner_name).toBe('Sam');
  });

  it('soft-deletes, appears in Recently Deleted, and restores', async () => {
    const memory = await service.createMemory({
      relationship_id: 'r1',
      title: 'The beach',
      description: 'A good day',
      memory_date: Date.now(),
      image_ref: null,
    });

    const undo = await service.softDelete('memories', memory.id);
    let deleted = await service.recentlyDeleted();
    expect(deleted.map((d) => d.id)).toContain(memory.id);
    expect(await service.listLive('memories')).toHaveLength(0);

    await undo();
    deleted = await service.recentlyDeleted();
    expect(deleted).toHaveLength(0);
    expect(await service.listLive('memories')).toHaveLength(1);
  });

  it('purge is the only hard delete', async () => {
    const entry = await service.createJournalEntry({ owner_id: 'u1', title: '', content: 'hi' });
    await service.softDelete('journalEntries', entry.id);
    await service.purge('journalEntries', entry.id);
    expect(await db.journalEntries.get(entry.id)).toBeUndefined();
    expect(await service.recentlyDeleted()).toHaveLength(0);
  });

  it('journals every mutation to the outbox', async () => {
    const outbox = new Outbox(db);
    await service.createMemory({
      relationship_id: 'r1',
      title: 'A note',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    expect(await outbox.count()).toBeGreaterThan(0);
    const pending = await outbox.pending();
    expect(pending[0]?.table).toBe('memories');
    expect(pending[0]?.op).toBe('put');
  });

  it('persists and updates settings', async () => {
    const initial = await service.getSettings();
    expect(initial.onboarded).toBe(false);
    const updated = await service.updateSettings({ onboarded: true, theme: 'dark' });
    expect(updated.onboarded).toBe(true);
    expect((await service.getSettings()).theme).toBe('dark');
  });
});
