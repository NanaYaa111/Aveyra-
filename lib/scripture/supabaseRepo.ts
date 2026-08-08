/**
 * The daily scripture ritual on Supabase. One row per relationship per day,
 * held by a unique constraint on `(relationship_id, date_key)` — so if you both
 * open the app at the same moment, the second insert loses cleanly rather than
 * creating two competing verses for the same day.
 */
import { getSupabaseClient } from '../supabase/client';
import type { DailyScripture } from '../database/types';

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

function toEntry(row: Record<string, unknown>, me: string): DailyScripture {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  return {
    id: row.id as string,
    relationship_id: row.relationship_id as string,
    date_key: (row.date_key as string) ?? '',
    chooser: row.chooser_id === me ? 'partner_one' : 'partner_two',
    reference: (row.reference as string) ?? '',
    text: (row.text as string) ?? '',
    chooser_note: (row.chooser_note as string) ?? '',
    response: (row.response as string) ?? '',
    responded_at: row.responded_at ? Date.parse(row.responded_at as string) : null,
    created_at: created,
    updated_at: created,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

export async function spGetDailyScripture(
  relId: string,
  dateKey: string,
): Promise<DailyScripture | null> {
  const me = await uid();
  const { data } = await client()
    .from('daily_scriptures')
    .select('*')
    .eq('relationship_id', relId)
    .eq('date_key', dateKey)
    .maybeSingle();
  return data ? toEntry(data as Record<string, unknown>, me) : null;
}

export async function spChooseScripture(
  relId: string,
  dateKey: string,
  verse: { reference: string; text: string },
  note: string,
): Promise<void> {
  const me = await uid();
  const { error } = await client().from('daily_scriptures').insert({
    relationship_id: relId,
    date_key: dateKey,
    chooser_id: me,
    reference: verse.reference,
    text: verse.text,
    chooser_note: note,
  });
  // A duplicate means the other person got there first — not an error worth
  // showing as a failure, just a race the UI resolves by re-reading.
  if (error && !/duplicate|unique/i.test(error.message)) throw new Error(error.message);
}

export async function spRespondToScripture(id: string, response: string): Promise<void> {
  const { error } = await client()
    .from('daily_scriptures')
    .update({ response, responded_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** Live updates so the other person's verse or answer appears as it lands. */
export function spSubscribeScripture(relId: string, onChange: () => void): () => void {
  const c = client();
  const channel = c
    .channel(`scripture:${relId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_scriptures',
        filter: `relationship_id=eq.${relId}`,
      },
      () => onChange(),
    )
    .subscribe();
  return () => {
    void c.removeChannel(channel);
  };
}
