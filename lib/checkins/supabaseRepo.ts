/**
 * Daily emotional check-ins on Supabase. Relationship-scoped (RLS: members
 * only). One row per person per day, enforced by the
 * `(relationship_id, date_key, author_id)` unique constraint — resubmitting
 * the same day upserts (edits), never duplicates. Realtime shares a partner's
 * check-in the moment it's made.
 */
import { getSupabaseClient } from '../supabase/client';
import { MOODS, type CheckIn, type Mood } from '../database/types';

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

function toCheckIn(row: Record<string, unknown>, me: string): CheckIn {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  const mood = MOODS.includes(row.mood as Mood) ? (row.mood as Mood) : 'calm';
  return {
    id: row.id as string,
    relationship_id: row.relationship_id as string,
    author: row.author_id === me ? 'partner_one' : 'partner_two',
    date_key: (row.date_key as string) ?? '',
    mood,
    note: (row.note as string) ?? '',
    created_at: created,
    updated_at: row.updated_at ? Date.parse(row.updated_at as string) : created,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

/** Both partners' check-ins for a given day, resolved to mine/partner. */
export async function spCheckInsFor(
  relId: string,
  dateKey: string,
): Promise<{ mine: CheckIn | null; partner: CheckIn | null }> {
  const me = await uid();
  const { data } = await client()
    .from('checkins')
    .select('*')
    .eq('relationship_id', relId)
    .eq('date_key', dateKey);
  const rows = (data ?? []) as Record<string, unknown>[];
  const mineRow = rows.find((r) => r.author_id === me) ?? null;
  const partnerRow = rows.find((r) => r.author_id !== me) ?? null;
  return {
    mine: mineRow ? toCheckIn(mineRow, me) : null,
    partner: partnerRow ? toCheckIn(partnerRow, me) : null,
  };
}

/** Submit or revise today's check-in (atomic upsert on the day's unique key). */
export async function spSubmitCheckIn(
  relId: string,
  dateKey: string,
  mood: Mood,
  note: string,
): Promise<void> {
  const me = await uid();
  const { error } = await client()
    .from('checkins')
    .upsert(
      {
        relationship_id: relId,
        date_key: dateKey,
        author_id: me,
        mood,
        note,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'relationship_id,date_key,author_id' },
    );
  if (error) throw new Error(error.message);
}

/** Watch the relationship's check-ins; `onChange` fires on either partner's. */
export function spSubscribeCheckIns(relId: string, onChange: () => void): () => void {
  const c = client();
  const channel = c
    .channel(`checkins:${relId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'checkins', filter: `relationship_id=eq.${relId}` },
      () => onChange(),
    )
    .subscribe();
  return () => {
    void c.removeChannel(channel);
  };
}
