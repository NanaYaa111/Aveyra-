import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';
import {
  getToday,
  submitMyAnswer,
  saveAsMemory,
  devSimulatePartner,
} from '@/lib/daily/service';
import { FIRST_QUESTION_ID } from '@/lib/questions/bank';
import type { Memory } from '@/lib/database/types';

function freshService() {
  const db = new AveyraDB('aveyra-test-' + crypto.randomUUID());
  return new DatabaseService(db, new Outbox(db));
}

const REL = 'rel-daily-' + Math.random().toString(36).slice(2);
let service: DatabaseService;

beforeEach(() => {
  // Fresh DB per test. Rotation persistence is a localStorage no-op in Node, so
  // every getToday serves day one (the fixed opener) — which is what these
  // exercise; answers drive the status transitions.
  if (typeof localStorage !== 'undefined') localStorage.clear();
  service = freshService();
});

describe('daily loop', () => {
  it('serves the fixed opening question on day one, unanswered', async () => {
    const state = await getToday(REL, service);
    expect(state.question.id).toBe(FIRST_QUESTION_ID);
    expect(state.status).toBe('answering');
    expect(state.myAnswer).toBeNull();
    expect(state.partnerAnswer).toBeNull();
  });

  it('moves to waiting after I submit, and my answer is editable', async () => {
    const first = await getToday(REL, service);
    await submitMyAnswer(REL, first.question.id, '  my first thought  ', service);

    let state = await getToday(REL, service);
    expect(state.status).toBe('waiting');
    expect(state.myAnswer?.content).toBe('my first thought'); // trimmed

    // Editable until reveal.
    await submitMyAnswer(REL, first.question.id, 'a better thought', service);
    state = await getToday(REL, service);
    expect(state.status).toBe('waiting');
    expect(state.myAnswer?.content).toBe('a better thought');
  });

  it('reveals only once both have answered', async () => {
    const first = await getToday(REL, service);
    await submitMyAnswer(REL, first.question.id, 'mine', service);
    await devSimulatePartner(first.question.id, service);

    const state = await getToday(REL, service);
    expect(state.status).toBe('revealed');
    expect(state.partnerAnswer).not.toBeNull();
  });

  it('rejects an edit after reveal', async () => {
    const first = await getToday(REL, service);
    await submitMyAnswer(REL, first.question.id, 'mine', service);
    await devSimulatePartner(first.question.id, service);
    await expect(submitMyAnswer(REL, first.question.id, 'too late', service)).rejects.toThrow(
      /already revealed/i,
    );
  });

  it('rejects an empty answer', async () => {
    const first = await getToday(REL, service);
    await expect(submitMyAnswer(REL, first.question.id, '   ', service)).rejects.toThrow(/something/i);
  });

  it('saves a revealed exchange as a memory (question + both answers)', async () => {
    const first = await getToday(REL, service);
    await submitMyAnswer(REL, first.question.id, 'I hope you remember my laugh', service);
    await devSimulatePartner(first.question.id, service);
    const state = await getToday(REL, service);

    const id = await saveAsMemory(REL, state, { partnerName: 'Sam' }, service);
    expect(id).toBeTruthy();

    const memories = await service.listLive<Memory>('memories');
    expect(memories).toHaveLength(1);
    expect(memories[0]!.description).toContain(first.question.text);
    expect(memories[0]!.description).toContain('I hope you remember my laugh');
    expect(memories[0]!.description).toContain('Sam:');

    // getToday now reports it saved.
    const after = await getToday(REL, service);
    expect(after.saved).toBe(true);
  });

  it('only saves a revealed conversation', async () => {
    const first = await getToday(REL, service);
    await submitMyAnswer(REL, first.question.id, 'mine', service);
    const waiting = await getToday(REL, service);
    await expect(saveAsMemory(REL, waiting, {}, service)).rejects.toThrow(/revealed/i);
  });
});
