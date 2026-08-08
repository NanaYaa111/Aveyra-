import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { getMessages, sendMessage, subscribeMessages } from '@/lib/messages';

let service: DatabaseService;
let db: AveyraDB;
const REL = 'rel_1';

beforeEach(() => {
  db = new AveyraDB('aveyra-messages-' + crypto.randomUUID());
  __setDB(db);
  service = new DatabaseService(db);
});

describe('messages', () => {
  it('starts empty', async () => {
    expect(await getMessages(REL, service)).toEqual([]);
  });

  it('sends a message attributed to me', async () => {
    await sendMessage(REL, '  thinking of you  ', service);
    const [m] = await getMessages(REL, service);
    expect(m!.content).toBe('thinking of you');
    expect(m!.author).toBe('partner_one');
  });

  it('refuses an empty message', async () => {
    await expect(sendMessage(REL, '   ', service)).rejects.toThrow(/something/i);
  });

  it('reads oldest-first so the thread reads downward', async () => {
    await sendMessage(REL, 'first', service);
    await sendMessage(REL, 'second', service);
    await sendMessage(REL, 'third', service);

    const thread = await getMessages(REL, service);
    expect(thread.map((m) => m.content)).toEqual(['first', 'second', 'third']);
    expect(thread[0]!.created_at).toBeLessThanOrEqual(thread[2]!.created_at);
  });

  it('encrypts message content at rest', async () => {
    await sendMessage(REL, 'a private thing', service);
    const [m] = await getMessages(REL, service);
    const raw = await db.messages.get(m!.id);
    expect(raw!.content).not.toBe('a private thing');
  });

  it('subscribing without a backend is a harmless no-op that unsubscribes cleanly', () => {
    const unsubscribe = subscribeMessages(REL, () => {});
    expect(() => unsubscribe()).not.toThrow();
  });
});
