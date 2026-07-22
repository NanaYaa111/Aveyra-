import { describe, it, expect } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';
import {
  serializeBackup,
  parseBackup,
  suggestedFilename,
  BACKUP_FORMAT,
  BACKUP_VERSION,
} from '@/lib/backup';
import type { BackupData } from '@/lib/database/types';

function fresh() {
  const db = new AveyraDB('aveyra-backup-' + crypto.randomUUID());
  return new DatabaseService(db, new Outbox(db));
}

function freshWithDb() {
  const db = new AveyraDB('aveyra-backup-' + crypto.randomUUID());
  const outbox = new Outbox(db);
  return { db, outbox, service: new DatabaseService(db, outbox) };
}

const emptyData: BackupData = {
  relationships: [],
  answers: [],
  memories: [],
  journalEntries: [],
  settings: null,
};

describe('backup envelope', () => {
  it('serialises with a versioned envelope and round-trips', () => {
    const text = serializeBackup(emptyData, 1234);
    const parsed = JSON.parse(text);
    expect(parsed.format).toBe(BACKUP_FORMAT);
    expect(parsed.version).toBe(BACKUP_VERSION);
    expect(parsed.exported_at).toBe(1234);
    expect(parseBackup(text)).toEqual(emptyData);
  });

  it('rejects non-JSON', () => {
    expect(() => parseBackup('not json {')).toThrow(/valid JSON/i);
  });

  it('rejects a JSON file that is not an Aveyra backup', () => {
    expect(() => parseBackup(JSON.stringify({ hello: 'world' }))).toThrow(/recognised/i);
  });

  it('rejects a mismatched version', () => {
    const text = JSON.stringify({ format: BACKUP_FORMAT, version: 999, exported_at: 0, data: emptyData });
    expect(() => parseBackup(text)).toThrow(/recognised/i);
  });

  it('suggests a dated filename', () => {
    expect(suggestedFilename(new Date('2026-07-21T10:00:00Z'))).toBe('aveyra-backup-2026-07-21.json');
  });
});

describe('export → import round-trip through the service', () => {
  it('restores content onto a fresh (different-key) device with decrypted values intact', async () => {
    const source = fresh();
    await source.createRelationship({
      creator_id: 'u1',
      partner_id: null,
      status: 'solo',
      partner_name: 'Esi',
      relationship_start_date: null,
    });
    await source.createMemory({
      relationship_id: 'r1',
      title: 'First trip',
      description: 'The long drive north.',
      memory_date: Date.now(),
      image_ref: null,
    });
    await source.createJournalEntry({ owner_id: 'u1', title: 'A note', content: 'a private line' });

    const snapshot = await source.exportSnapshot();
    const text = serializeBackup(snapshot);

    // Import into a brand-new service/db with its own encryption key.
    const target = fresh();
    const { imported } = await target.importSnapshot(parseBackup(text));
    expect(imported).toBe(3);

    expect((await target.getRelationship())!.partner_name).toBe('Esi');
    const memories = (await target.listLive('memories')) as unknown as { title: string }[];
    expect(memories[0]!.title).toBe('First trip');
    const journals = (await target.listLive('journalEntries')) as unknown as { content: string }[];
    expect(journals[0]!.content).toBe('a private line');
  });

  it('includes soft-deleted records so a backup never drops Recently Deleted', async () => {
    const source = fresh();
    const mem = await source.createMemory({
      relationship_id: 'r1',
      title: 'Kept',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    await source.softDelete('memories', mem.id);

    const snapshot = await source.exportSnapshot();
    expect(snapshot.memories).toHaveLength(1);
    expect(snapshot.memories[0]!.deleted_at).not.toBeNull();
  });
});

describe('import — hardening', () => {
  it('rejects a malformed backup (non-array table) up front', () => {
    const text = JSON.stringify({
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      exported_at: 0,
      data: { answers: 'not-an-array' },
    });
    expect(() => parseBackup(text)).toThrow(/malformed/i);
  });

  it('skips structurally-invalid rows and imports the valid ones', async () => {
    const { service } = freshWithDb();
    const data = {
      relationships: [],
      answers: [
        {
          id: 'a1',
          question_id: 'q',
          author: 'partner_one',
          content: 'a good answer',
          created_at: 1,
          updated_at: 1,
          deleted_at: null,
          schema_version: 1,
          version: 1,
        },
        { content: 'no id — garbage' },
      ],
      memories: [],
      journalEntries: [],
      settings: null,
    } as unknown as BackupData;
    const { imported } = await service.importSnapshot(data);
    expect(imported).toBe(1);
    const live = (await service.listLive('answers')) as unknown as { content: string }[];
    expect(live).toHaveLength(1);
    expect(live[0]!.content).toBe('a good answer');
  });

  it('never overwrites newer local data with a stale backup (version merge)', async () => {
    const { service } = freshWithDb();
    const entry = await service.createJournalEntry({ owner_id: 'u1', title: 't', content: 'v1' });
    await service.updateJournalEntry(entry.id, { content: 'v2' });
    await service.updateJournalEntry(entry.id, { content: 'v3' }); // local version 3

    const stale = {
      relationships: [],
      answers: [],
      memories: [],
      journalEntries: [{ ...entry, content: 'STALE', version: 2, deleted_at: null }],
      settings: null,
    } as unknown as BackupData;
    await service.importSnapshot(stale);
    let live = (await service.listLive('journalEntries')) as unknown as { content: string }[];
    expect(live[0]!.content).toBe('v3'); // kept, not clobbered

    const newer = {
      ...stale,
      journalEntries: [{ ...entry, content: 'NEWER', version: 9, deleted_at: null }],
    } as unknown as BackupData;
    await service.importSnapshot(newer);
    live = (await service.listLive('journalEntries')) as unknown as { content: string }[];
    expect(live[0]!.content).toBe('NEWER'); // newer backup wins
  });

  it('journals imported rows to the outbox (so restored data can sync)', async () => {
    const { service, outbox } = freshWithDb();
    const source = fresh();
    const m = await source.createMemory({
      relationship_id: 'r1',
      title: 'Trip',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    await service.importSnapshot({
      relationships: [],
      answers: [],
      memories: [m],
      journalEntries: [],
      settings: null,
    });
    expect(await outbox.count()).toBeGreaterThan(0);
  });

  it('sanitises imported settings to a valid singleton', async () => {
    const { db, service } = freshWithDb();
    await service.importSnapshot({
      relationships: [],
      answers: [],
      memories: [],
      journalEntries: [],
      settings: {
        id: 'wrong-id',
        onboarded: 'yes',
        theme: 'purple',
        persistent_storage_granted: 'maybe',
        schema_version: 0,
      },
    } as unknown as BackupData);
    const s = await service.getSettings();
    expect(s.id).toBe('app');
    expect(s.theme).toBe('system'); // invalid → default
    expect(s.onboarded).toBe(false); // non-true → false
    expect(await db.settings.count()).toBe(1); // no orphan row
  });

  it('does not record an export when importing', async () => {
    const { db, service } = freshWithDb();
    await service.importSnapshot({
      relationships: [],
      answers: [],
      memories: [],
      journalEntries: [],
      settings: null,
    });
    expect(await db.exportRecords.count()).toBe(0);
  });
});
