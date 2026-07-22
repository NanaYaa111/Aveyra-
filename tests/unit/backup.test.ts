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
