import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';
import { createEntry, getEntries, deleteEntry } from '@/lib/journal';

function freshService() {
  const db = new AveyraDB('aveyra-test-' + crypto.randomUUID());
  return new DatabaseService(db, new Outbox(db));
}

let service: DatabaseService;
beforeEach(() => {
  service = freshService();
});

describe('journal (Write)', () => {
  it('creates and lists entries newest first', async () => {
    await createEntry({ title: 'One', content: 'first' }, service);
    await new Promise((r) => setTimeout(r, 2));
    await createEntry({ content: 'second, untitled' }, service);

    const entries = await getEntries(service);
    expect(entries).toHaveLength(2);
    expect(entries[0]!.content).toBe('second, untitled');
    expect(entries[0]!.title).toBe('');
    expect(entries[1]!.title).toBe('One');
  });

  it('rejects an empty entry', async () => {
    await expect(createEntry({ content: '   ' }, service)).rejects.toThrow(/write something/i);
  });

  it('soft-deletes an entry (removed from the live list)', async () => {
    await createEntry({ content: 'to remove' }, service);
    const [entry] = await getEntries(service);
    await deleteEntry(entry!.id, service);
    expect(await getEntries(service)).toHaveLength(0);
  });

  it('trims content and title', async () => {
    await createEntry({ title: '  Trim  ', content: '  padded  ' }, service);
    const [entry] = await getEntries(service);
    expect(entry!.title).toBe('Trim');
    expect(entry!.content).toBe('padded');
  });
});
