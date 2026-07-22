import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';

function fresh() {
  const db = new AveyraDB('aveyra-enc-' + crypto.randomUUID());
  // Default keys/cipher bind to this db (KeyManager(db)), so the vault lives
  // in the same store as the data.
  return { db, service: new DatabaseService(db, new Outbox(db)) };
}

describe('DatabaseService — encryption at rest', () => {
  let db: AveyraDB;
  let service: DatabaseService;
  beforeEach(() => {
    ({ db, service } = fresh());
  });

  it('stores answer content as ciphertext but returns plaintext through the service', async () => {
    const a = await service.createAnswer({
      question_id: 'q-open-01',
      author: 'partner_one',
      content: 'a private, tender answer',
    });
    // Raw row is ciphertext.
    const raw = await db.answers.get(a.id);
    expect(raw!.content).not.toBe('a private, tender answer');
    expect(raw!.content.startsWith('enc:')).toBe(true);
    // Index/metadata stays plaintext.
    expect(raw!.question_id).toBe('q-open-01');
    // Service round-trips to plaintext.
    const back = await service.get<typeof a>('answers', a.id);
    expect(back!.content).toBe('a private, tender answer');
  });

  it('encrypts memory title + description and decrypts on listLive', async () => {
    await service.createMemory({
      relationship_id: 'r1',
      title: 'The lighthouse',
      description: 'We watched the storm roll in.',
      memory_date: Date.now(),
      image_ref: null,
    });
    const rawRows = await db.memories.toArray();
    expect(rawRows[0]!.title.startsWith('enc:')).toBe(true);
    expect(rawRows[0]!.description.startsWith('enc:')).toBe(true);
    expect(typeof rawRows[0]!.memory_date).toBe('number'); // metadata plaintext

    const live = (await service.listLive('memories')) as unknown as {
      title: string;
      description: string;
    }[];
    expect(live[0]!.title).toBe('The lighthouse');
    expect(live[0]!.description).toBe('We watched the storm roll in.');
  });

  it('encrypts the partner name on a relationship', async () => {
    const rel = await service.createRelationship({
      creator_id: 'u1',
      partner_id: null,
      status: 'solo',
      partner_name: 'Adwoa',
      relationship_start_date: null,
    });
    const raw = await db.relationships.get(rel.id);
    expect(raw!.partner_name.startsWith('enc:')).toBe(true);
    expect((await service.getRelationship())!.partner_name).toBe('Adwoa');
  });

  it('re-encrypts updated fields', async () => {
    const entry = await service.createJournalEntry({ owner_id: 'u1', title: 'Draft', content: 'one' });
    await service.updateJournalEntry(entry.id, { content: 'a longer, revised entry' });
    const raw = await db.journalEntries.get(entry.id);
    expect(raw!.content.startsWith('enc:')).toBe(true);
    expect(raw!.content).not.toContain('revised');
    const live = (await service.listLive('journalEntries')) as unknown as { content: string }[];
    expect(live[0]!.content).toBe('a longer, revised entry');
  });

  it('serialises vault init under concurrent first-writes (no key corruption)', async () => {
    // Regression guard for the auto-init race: four concurrent first-writes
    // must all end up under ONE content key, so every value still decrypts.
    await Promise.all([
      service.createAnswer({ question_id: 'q', author: 'partner_one', content: 'one' }),
      service.createJournalEntry({ owner_id: 'u1', title: 't', content: 'two' }),
      service.createMemory({
        relationship_id: 'r',
        title: 'three',
        description: 'd',
        memory_date: Date.now(),
        image_ref: null,
      }),
      service.createRelationship({
        creator_id: 'u',
        partner_id: null,
        status: 'solo',
        partner_name: 'Nana',
        relationship_start_date: null,
      }),
    ]);
    const answers = (await service.listLive('answers')) as unknown as { content: string }[];
    const journals = (await service.listLive('journalEntries')) as unknown as { content: string }[];
    expect(answers[0]!.content).toBe('one');
    expect(journals[0]!.content).toBe('two');
    expect((await service.getRelationship())!.partner_name).toBe('Nana');
    expect(await db.keyvault.count()).toBe(1);
  });

  it('decrypts labels in Recently Deleted', async () => {
    const mem = await service.createMemory({
      relationship_id: 'r1',
      title: 'Secret picnic',
      description: '',
      memory_date: Date.now(),
      image_ref: null,
    });
    await service.softDelete('memories', mem.id);
    const deleted = await service.recentlyDeleted();
    expect(deleted[0]!.label).toBe('Secret picnic'); // decrypted, not ciphertext
  });
});
