import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { getPresence } from '@/lib/presence';
import { submitCheckIn } from '@/lib/checkins';
import { sendMessage } from '@/lib/messages';
import { todayKey } from '@/lib/checkins';
import type { DailyState } from '@/lib/daily/service';

let service: DatabaseService;
let db: AveyraDB;
const REL = 'rel_1';
const NAME = 'Sam';

beforeEach(() => {
  db = new AveyraDB('aveyra-presence-' + crypto.randomUUID());
  __setDB(db);
  service = new DatabaseService(db);
});

function daily(status: DailyState['status']): DailyState {
  return {
    question: { id: 'q1', category: 'memories', text: 'Q?', depth: 1 } as DailyState['question'],
    dateKey: '2026-08-08',
    myAnswer: null,
    partnerAnswer: null,
    status,
    saved: false,
  };
}

/** A check-in authored by the partner (the local stub writes mine as partner_one). */
async function partnerCheckedIn() {
  await service.createCheckIn({
    relationship_id: REL,
    author: 'partner_two',
    date_key: todayKey(),
    mood: 'calm',
    note: '',
  });
}

describe('presence — the whole notification surface', () => {
  it('says nothing when there is nothing to say', async () => {
    const { lines } = await getPresence(REL, daily('answering'), NAME, service);
    expect(lines).toEqual([]);
  });

  it('says nothing at all without a relationship', async () => {
    const { lines } = await getPresence(null, daily('revealed'), NAME, service);
    expect(lines).toEqual([]);
  });

  it('names the partner when the day has revealed', async () => {
    const { lines } = await getPresence(REL, daily('revealed'), NAME, service);
    expect(lines).toContain("Sam answered today's question.");
  });

  it('does not announce a reveal while still waiting on them', async () => {
    const { lines } = await getPresence(REL, daily('waiting'), NAME, service);
    expect(lines.join(' ')).not.toMatch(/answered/i);
  });

  it("mentions the partner's check-in, never my own", async () => {
    await submitCheckIn(REL, 'happy', 'mine', service);
    let { lines } = await getPresence(REL, daily('answering'), NAME, service);
    expect(lines).toEqual([]);

    await partnerCheckedIn();
    ({ lines } = await getPresence(REL, daily('answering'), NAME, service));
    expect(lines).toContain('Sam checked in today.');
  });

  it('mentions a message only when they spoke last', async () => {
    await sendMessage(REL, 'hello', service);
    let { lines } = await getPresence(REL, daily('answering'), NAME, service);
    expect(lines.join(' ')).not.toMatch(/message/i);

    await service.createMessage({ relationship_id: REL, author: 'partner_two', content: 'hi back' });
    ({ lines } = await getPresence(REL, daily('answering'), NAME, service));
    expect(lines).toContain("There's a message from Sam.");
  });

  it('never carries a count — that something is waiting is the whole message', async () => {
    for (let i = 0; i < 4; i++) {
      await service.createMessage({ relationship_id: REL, author: 'partner_two', content: `m${i}` });
    }
    const { lines } = await getPresence(REL, daily('answering'), NAME, service);
    const text = lines.join(' ');
    expect(text).toContain("There's a message from Sam.");
    expect(text).not.toMatch(/\d/); // no numbers anywhere
  });

  it('never uses pressuring or content-revealing copy (Section J)', async () => {
    await partnerCheckedIn();
    await service.createMessage({ relationship_id: REL, author: 'partner_two', content: 'secret' });
    const text = (await getPresence(REL, daily('revealed'), NAME, service)).lines.join(' ');

    expect(text).not.toMatch(/waiting for you|is waiting|you missed|don't forget|still haven't/i);
    expect(text).not.toMatch(/streak|keep it up|don't break/i);
    // The message body is never surfaced, only that one exists.
    expect(text).not.toContain('secret');
  });

  it('never mentions the private journal, even when entries exist', async () => {
    await service.createJournalEntry({ owner_id: 'me', title: 'Private', content: 'inner life' });
    const text = (await getPresence(REL, daily('answering'), NAME, service)).lines.join(' ');
    expect(text).not.toMatch(/journal|Private|inner life/i);
  });
});
