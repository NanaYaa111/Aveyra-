/**
 * Notes on Supabase. Relationship-scoped (RLS: members only). Acknowledgement
 * is stored so the reader keeps track of what they've dealt with; nothing in
 * the client ever shows it back to the author.
 */
import { getSupabaseClient } from '../supabase/client';
import type { Note, NoteKind } from '../database/types';

function client() {
  const c = getSupabaseClient();
  if (!c) throw new Error('Supabase is not configured.');
  return c;
}

async function uid(): Promise<string> {
  const { data } = await client().auth.getUser();
  if (!data.user) throw new Error('You need to be signed in.');
  return data.user.id;
}

function toNote(row: Record<string, unknown>, me: string): Note {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  return {
    id: row.id as string,
    relationship_id: row.relationship_id as string,
    author: row.author_id === me ? 'partner_one' : 'partner_two',
    kind: (row.kind as NoteKind) ?? 'lovely',
    content: (row.content as string) ?? '',
    acknowledged_at: row.acknowledged_at ? Date.parse(row.acknowledged_at as string) : null,
    created_at: created,
    updated_at: created,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

export async function spGetNotes(relId: string): Promise<Note[]> {
  const me = await uid();
  const { data } = await client()
    .from('notes')
    .select('*')
    .eq('relationship_id', relId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  return ((data ?? []) as Record<string, unknown>[]).map((r) => toNote(r, me));
}

export async function spCreateNote(
  relId: string,
  kind: NoteKind,
  content: string,
): Promise<void> {
  const me = await uid();
  const { error } = await client()
    .from('notes')
    .insert({ relationship_id: relId, author_id: me, kind, content });
  if (error) throw new Error(error.message);
}

export async function spAcknowledgeNote(id: string): Promise<void> {
  const { error } = await client()
    .from('notes')
    .update({ acknowledged_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Live updates so a note appears without a refresh. */
export function spSubscribeNotes(relId: string, onChange: () => void): () => void {
  const c = client();
  const channel = c
    .channel(`notes:${relId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notes', filter: `relationship_id=eq.${relId}` },
      () => onChange(),
    )
    .subscribe();
  return () => {
    void c.removeChannel(channel);
  };
}
