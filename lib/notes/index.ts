/**
 * Notes — saying the thing, with the kind of thing said up front.
 *
 * Three channels, because "there's something bothering me", "I saw something
 * lovely" and "here's an idea" are not the same act and shouldn't arrive
 * looking identical. Labelling the register does real work: nobody has to open
 * a message cold and brace, and a hard thing can be said without it landing as
 * an ambush.
 *
 * Two deliberate constraints:
 *
 * - **Acknowledgement is one-way.** The recipient can mark that they've read a
 *   note, and that's for *them* — the sender is never shown a receipt. A
 *   "delivered/read" signal on "something is bothering me" would turn silence
 *   into an accusation, which is the opposite of the point.
 * - **A weighing note is never counted.** No tally of open concerns, no badge,
 *   no history of who raised what. A list of grievances with numbers on it is a
 *   scoreboard, and scoreboards are how this kind of feature goes wrong.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { ME } from '../daily/service';
import { spCreateNote, spGetNotes, spAcknowledgeNote, spSubscribeNotes } from './supabaseRepo';
import { NOTE_KINDS, type Note, type NoteKind } from '../database/types';

/** How each kind introduces itself. The wording is the feature. */
export const NOTE_KIND_LABELS: Record<
  NoteKind,
  { emoji: string; title: string; prompt: string; placeholder: string }
> = {
  weighing: {
    emoji: '🌧️',
    title: 'Something’s weighing on me',
    prompt: 'Say it plainly. It doesn’t have to be tidy.',
    placeholder: 'What’s sitting heavy right now',
  },
  lovely: {
    emoji: '🌞',
    title: 'Something lovely',
    prompt: 'Something you saw, or thought, or want them to know.',
    placeholder: 'What made you think of them',
  },
  idea: {
    emoji: '🌿',
    title: 'Something to try',
    prompt: 'An idea, a suggestion, something you’d like the two of you to do.',
    placeholder: 'What you’d like to try together',
  },
};

/** All notes for the relationship, newest first. */
export async function getNotes(
  relId: string | null,
  service: DatabaseService = getService(),
): Promise<Note[]> {
  if (!relId) return [];
  if (isSupabaseConfigured()) return spGetNotes(relId);
  const all = await service.listLive<Note>('notes');
  return all.sort((a, b) => b.created_at - a.created_at);
}

/** Write a note of a given kind. */
export async function createNote(
  relId: string,
  kind: NoteKind,
  content: string,
  service: DatabaseService = getService(),
): Promise<void> {
  if (!NOTE_KINDS.includes(kind)) throw new Error('That isn’t one of the kinds.');
  const trimmed = content.trim();
  if (!trimmed) throw new Error('Write a little something first.');

  if (isSupabaseConfigured()) {
    await spCreateNote(relId, kind, trimmed);
    return;
  }
  await service.createNote({
    relationship_id: relId,
    author: ME,
    kind,
    content: trimmed,
    acknowledged_at: null,
  });
}

/**
 * Mark that I've read their note. This is for the reader's own sense of what
 * they've dealt with — it is deliberately never surfaced back to the sender.
 */
export async function acknowledgeNote(
  id: string,
  service: DatabaseService = getService(),
): Promise<void> {
  if (isSupabaseConfigured()) {
    await spAcknowledgeNote(id);
    return;
  }
  await service.updateNote(id, { acknowledged_at: Date.now() });
}

/** Live updates so a note arrives without anyone pulling to refresh. */
export function subscribeNotes(relId: string, onChange: () => void): () => void {
  if (isSupabaseConfigured()) return spSubscribeNotes(relId, onChange);
  return () => {};
}

/** Notes from the other person that I haven't marked as read. */
export function unreadFromPartner(notes: Note[]): Note[] {
  return notes.filter((n) => n.author !== ME && n.acknowledged_at === null);
}
