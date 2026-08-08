/**
 * Pings on Supabase. They are message rows with `kind = 'ping'`, so they reuse
 * the thread's RLS (members only, insert-as-yourself) and its realtime channel
 * — a ping arrives on the other device the same way a message does.
 */
import { getSupabaseClient } from '../supabase/client';
import type { PingKind } from '../database/types';

function client() {
  const c = getSupabaseClient();
  if (!c) throw new Error('Supabase is not configured.');
  return c;
}

export async function spSendPing(relId: string, ping: PingKind): Promise<void> {
  const { data } = await client().auth.getUser();
  if (!data.user) throw new Error('You need to be signed in.');
  const { error } = await client()
    .from('messages')
    .insert({ relationship_id: relId, author_id: data.user.id, content: ping, kind: 'ping' });
  if (error) throw new Error(error.message);
}
