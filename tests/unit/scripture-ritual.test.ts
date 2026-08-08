import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { getRitual, chooseScripture, respondToScripture, todayKey } from '@/lib/scripture/ritual';

let service: DatabaseService;
let db: AveyraDB;
const REL = 'rel_1';
const VERSE = { reference: 'Psalm 143:8', text: 'Cause me to hear thy lovingkindness…' };

beforeEach(() => {
  db = new AveyraDB('aveyra-ritual-' + crypto.randomUUID());
  __setDB(db);
  service = new DatabaseService(db);
});

/** Simulate the partner getting there first. */
async function partnerChose() {
  await service.createDailyScripture({
    relationship_id: REL,
    date_key: todayKey(),
    chooser: 'partner_two',
    reference: VERSE.reference,
    text: VERSE.text,
    chooser_note: 'this one felt right',
    response: '',
    responded_at: null,
  });
}

describe('the daily scripture ritual', () => {
  it('starts open, with a suggestion so it is never a blank page', async () => {
    const r = await getRitual(REL, 'web', service);
    expect(r.stage).toBe('open');
    expect(r.entry).toBeNull();
    expect(r.suggestion.reference).toBeTruthy();
    expect(r.suggestion.text).toBeTruthy();
  });

  it('choosing first puts me in waiting', async () => {
    await chooseScripture(REL, VERSE, 'thinking of you', service);
    const r = await getRitual(REL, 'web', service);
    expect(r.stage).toBe('waiting');
    expect(r.entry!.reference).toBe(VERSE.reference);
    expect(r.entry!.chooser_note).toBe('thinking of you');
  });

  it('only one verse a day — a second choice is refused, not an overwrite', async () => {
    await chooseScripture(REL, VERSE, '', service);
    await expect(
      chooseScripture(REL, { reference: 'John 3:16', text: 'For God so loved…' }, '', service),
    ).rejects.toThrow(/already chosen/i);

    const r = await getRitual(REL, 'web', service);
    expect(r.entry!.reference).toBe(VERSE.reference);
  });

  it("when they chose, it's mine to answer", async () => {
    await partnerChose();
    const r = await getRitual(REL, 'web', service);
    expect(r.stage).toBe('to-respond');
  });

  it('answering completes the day and keeps both voices', async () => {
    await partnerChose();
    await respondToScripture(REL, 'it made me think of the morning we…', service);

    const r = await getRitual(REL, 'web', service);
    expect(r.stage).toBe('complete');
    expect(r.entry!.chooser_note).toBe('this one felt right');
    expect(r.entry!.response).toBe('it made me think of the morning we…');
    expect(r.entry!.responded_at).not.toBeNull();
  });

  it("I can't answer my own verse — it takes two", async () => {
    await chooseScripture(REL, VERSE, '', service);
    await expect(respondToScripture(REL, 'talking to myself', service)).rejects.toThrow(/theirs to answer/i);
  });

  it('refuses a second answer', async () => {
    await partnerChose();
    await respondToScripture(REL, 'first thought', service);
    await expect(respondToScripture(REL, 'second thought', service)).rejects.toThrow(/already answered/i);
  });

  it('refuses an empty answer', async () => {
    await partnerChose();
    await expect(respondToScripture(REL, '   ', service)).rejects.toThrow(/something/i);
  });

  it('encrypts the verse text and both voices at rest', async () => {
    await chooseScripture(REL, VERSE, 'a private thought', service);
    const r = await getRitual(REL, 'web', service);
    const raw = await db.dailyScriptures.get(r.entry!.id);
    expect(raw!.chooser_note).not.toBe('a private thought');
    expect(raw!.text).not.toBe(VERSE.text);
    // The citation stays readable — it isn't private prose.
    expect(raw!.reference).toBe(VERSE.reference);
  });
});
