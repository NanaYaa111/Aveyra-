import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import {
  createNote,
  getNotes,
  acknowledgeNote,
  unreadFromPartner,
  NOTE_KIND_LABELS,
} from '@/lib/notes';
import { NOTE_KINDS, type NoteKind } from '@/lib/database/types';

let service: DatabaseService;
let db: AveyraDB;
const REL = 'rel_1';

beforeEach(() => {
  db = new AveyraDB('aveyra-notes-' + crypto.randomUUID());
  __setDB(db);
  service = new DatabaseService(db);
});

describe('notes', () => {
  it('writes a note of each kind', async () => {
    for (const kind of NOTE_KINDS) {
      await createNote(REL, kind, `a ${kind} note`, service);
    }
    const notes = await getNotes(REL, service);
    expect(notes.map((n) => n.kind).sort()).toEqual([...NOTE_KINDS].sort());
  });

  it('refuses an unknown kind', async () => {
    await expect(createNote(REL, 'shouting' as NoteKind, 'x', service)).rejects.toThrow(/kinds/i);
  });

  it('refuses an empty note', async () => {
    await expect(createNote(REL, 'lovely', '   ', service)).rejects.toThrow(/something/i);
  });

  it('trims and keeps the content exactly otherwise', async () => {
    await createNote(REL, 'weighing', '  I felt alone on Tuesday.  ', service);
    const [note] = await getNotes(REL, service);
    expect(note!.content).toBe('I felt alone on Tuesday.');
  });

  it('lists newest first', async () => {
    await createNote(REL, 'lovely', 'first', service);
    await createNote(REL, 'idea', 'second', service);
    const notes = await getNotes(REL, service);
    expect(notes[0]!.content).toBe('second');
  });

  it('encrypts note content at rest', async () => {
    await createNote(REL, 'weighing', 'something private', service);
    const [note] = await getNotes(REL, service);
    const raw = await db.notes.get(note!.id);
    expect(raw!.content).not.toBe('something private');
  });

  it('starts unacknowledged and can be marked read by the recipient', async () => {
    await service.createNote({
      relationship_id: REL,
      author: 'partner_two',
      kind: 'weighing',
      content: 'from them',
      acknowledged_at: null,
    });
    let notes = await getNotes(REL, service);
    expect(unreadFromPartner(notes)).toHaveLength(1);

    await acknowledgeNote(notes[0]!.id, service);
    notes = await getNotes(REL, service);
    expect(unreadFromPartner(notes)).toHaveLength(0);
  });

  it('never treats my own notes as unread — I know what I wrote', async () => {
    await createNote(REL, 'lovely', 'mine', service);
    const notes = await getNotes(REL, service);
    expect(unreadFromPartner(notes)).toHaveLength(0);
  });

  it('every kind has warm, non-clinical wording', () => {
    for (const kind of NOTE_KINDS) {
      const k = NOTE_KIND_LABELS[kind];
      expect(k.title).toBeTruthy();
      expect(k.prompt).toBeTruthy();
      expect(k.placeholder).toBeTruthy();
      // Nothing that frames a note as a complaint filed against someone.
      expect(`${k.title} ${k.prompt}`).not.toMatch(/complaint|issue|report|problem with you/i);
    }
  });
});
