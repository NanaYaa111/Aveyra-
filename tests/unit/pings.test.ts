import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { sendPing, pingsSentToday, pingText, PING_TEXT, DAILY_PING_LIMIT } from '@/lib/pings';
import { getMessages, sendMessage } from '@/lib/messages';
import { PINGS, type PingKind } from '@/lib/database/types';

let service: DatabaseService;
let db: AveyraDB;
const REL = 'rel_1';

beforeEach(() => {
  db = new AveyraDB('aveyra-pings-' + crypto.randomUUID());
  __setDB(db);
  service = new DatabaseService(db);
});

describe('pings', () => {
  it('sends a ping as a thread entry marked as a ping', async () => {
    await sendPing(REL, 'thinking-of-you', service);
    const [m] = await getMessages(REL, service);
    expect(m!.kind).toBe('ping');
    expect(m!.content).toBe('thinking-of-you');
    expect(m!.author).toBe('partner_one');
  });

  it('rejects anything outside the closed vocabulary', async () => {
    await expect(sendPing(REL, 'hey-babe' as PingKind, service)).rejects.toThrow(/one of the pings/i);
  });

  it('every ping has warm display text and none of them asks a question', () => {
    for (const p of PINGS) {
      expect(PING_TEXT[p].text).toBeTruthy();
      expect(PING_TEXT[p].emoji).toBeTruthy();
      // A ping that asked something could be "left unanswered" — the exact
      // guilt mechanic the feature exists to avoid.
      expect(PING_TEXT[p].text).not.toContain('?');
    }
  });

  it('stops at the gentle daily cap, with kind wording rather than a scolding', async () => {
    for (let i = 0; i < DAILY_PING_LIMIT; i++) {
      await sendPing(REL, 'miss-you', service);
    }
    expect(await pingsSentToday(REL, service)).toBe(DAILY_PING_LIMIT);

    await expect(sendPing(REL, 'miss-you', service)).rejects.toThrow(/thinking of them/i);
    // Refused, not silently dropped — still exactly the cap in the thread.
    expect(await pingsSentToday(REL, service)).toBe(DAILY_PING_LIMIT);
  });

  it("counts only my own pings toward the cap, not my partner's", async () => {
    for (let i = 0; i < 3; i++) {
      await service.createMessage({
        relationship_id: REL,
        author: 'partner_two',
        content: 'goodnight',
        kind: 'ping',
      });
    }
    expect(await pingsSentToday(REL, service)).toBe(0);
    await sendPing(REL, 'goodnight', service);
    expect(await pingsSentToday(REL, service)).toBe(1);
  });

  it('written messages are not pings and never touch the cap', async () => {
    await sendMessage(REL, 'a real message', service);
    expect(await pingsSentToday(REL, service)).toBe(0);
    const [m] = await getMessages(REL, service);
    expect(m!.kind).toBe('message');
  });

  it('renders a stored ping, degrading to plain text for anything unknown', () => {
    expect(pingText('miss-you').text).toBe('Missing you');
    expect(pingText('something-else').text).toBe('something-else');
  });

  it('encrypts ping content at rest like any other thread entry', async () => {
    await sendPing(REL, 'goodnight', service);
    const [m] = await getMessages(REL, service);
    const raw = await db.messages.get(m!.id);
    expect(raw!.content).not.toBe('goodnight');
  });
});
