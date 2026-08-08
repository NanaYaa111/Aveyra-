/**
 * The private message thread on Supabase. Relationship-scoped (RLS: members
 * only); "mine" vs "partner" resolved by `author_id` against the signed-in
 * user. Plaintext-under-RLS (staged privacy, Q26). Realtime keeps the thread
 * live on both devices.
 */
import { getSupabaseClient } from '../supabase/client';
import type { Message } from '../database/types';

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

function toMessage(row: Record<string, unknown>, me: string): Message {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  return {
    id: row.id as string,
    relationship_id: row.relationship_id as string,
    author: row.author_id === me ? 'partner_one' : 'partner_two',
    content: (row.content as string) ?? '',
    created_at: created,
    updated_at: created,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

/** The thread, oldest first (a conversation reads downward). */
export async function spGetMessages(relId: string): Promise<Message[]> {
  const me = await uid();
  const { data } = await client()
    .from('messages')
    .select('*')
    .eq('relationship_id', relId)
    .order('created_at', { ascending: true });
  return ((data ?? []) as Record<string, unknown>[]).map((r) => toMessage(r, me));
}

export async function spSendMessage(relId: string, content: string): Promise<void> {
  const me = await uid();
  const { error } = await client()
    .from('messages')
    .insert({ relationship_id: relId, author_id: me, content });
  if (error) throw new Error(error.message);
}

/** Watch the thread; `onChange` fires when either partner sends. Returns unsubscribe. */
export function spSubscribeMessages(relId: string, onChange: () => void): () => void {
  const c = client();
  const channel = c
    .channel(`messages:${relId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages', filter: `relationship_id=eq.${relId}` },
      () => onChange(),
    )
    .subscribe();
  return () => {
    void c.removeChannel(channel);
  };
}
