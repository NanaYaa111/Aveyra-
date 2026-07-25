/**
 * Private journal on Supabase (Milestone 2 backend, Q25). Owner-only (RLS:
 * owner_id = auth.uid()); never shared, never in Story/search/partner views.
 * Plaintext-under-RLS (staged privacy, Q26). Soft-delete only, matching the
 * local store's soft-delete + Recently Deleted: `spDeleteEntry` sets
 * `deleted_at` rather than removing the row; a hard-delete purge is a later
 * refinement.
 */
import { getSupabaseClient } from '../supabase/client';
import type { JournalEntry } from '../database/types';

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

function toEntry(row: Record<string, unknown>): JournalEntry {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  return {
    id: row.id as string,
    owner_id: row.owner_id as string,
    title: (row.title as string) ?? '',
    content: (row.content as string) ?? '',
    created_at: created,
    updated_at: row.updated_at ? Date.parse(row.updated_at as string) : created,
    deleted_at: row.deleted_at ? Date.parse(row.deleted_at as string) : null,
    schema_version: 1,
    version: 1,
  };
}

export async function spGetEntries(): Promise<JournalEntry[]> {
  const me = await uid();
  const { data } = await client()
    .from('journal_entries')
    .select('*')
    .eq('owner_id', me)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  return ((data ?? []) as Record<string, unknown>[]).map(toEntry);
}

export async function spCreateEntry(fields: { title?: string; content: string }): Promise<void> {
  const me = await uid();
  const { error } = await client()
    .from('journal_entries')
    .insert({ owner_id: me, title: fields.title?.trim() ?? '', content: fields.content.trim() });
  if (error) throw new Error(error.message);
}

/** Soft-delete: sets `deleted_at` rather than removing the row (matches the local store). */
export async function spDeleteEntry(id: string): Promise<void> {
  const { error } = await client()
    .from('journal_entries')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
