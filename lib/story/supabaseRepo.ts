/**
 * Memories on Supabase (Milestone 2 backend, Q25). Shared, relationship-scoped
 * (RLS: members only), newest first. Plaintext-under-RLS (staged privacy, Q26).
 */
import { getSupabaseClient } from '../supabase/client';
import type { Memory } from '../database/types';

function client() {
  const c = getSupabaseClient();
  if (!c) throw new Error('Supabase is not configured.');
  return c;
}

function toMemory(row: Record<string, unknown>): Memory {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  return {
    id: row.id as string,
    relationship_id: row.relationship_id as string,
    title: (row.title as string) ?? '',
    description: (row.description as string) ?? '',
    memory_date: row.memory_date ? Date.parse(row.memory_date as string) : created,
    image_ref: null,
    created_at: created,
    updated_at: row.updated_at ? Date.parse(row.updated_at as string) : created,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

export async function spGetMemories(relId: string): Promise<Memory[]> {
  const { data } = await client()
    .from('memories')
    .select('*')
    .eq('relationship_id', relId)
    .order('memory_date', { ascending: false });
  return ((data ?? []) as Record<string, unknown>[]).map(toMemory);
}

export async function spCreateMemory(
  relId: string,
  m: { title: string; description: string; memory_date: number },
): Promise<string> {
  const { data, error } = await client()
    .from('memories')
    .insert({
      relationship_id: relId,
      title: m.title,
      description: m.description,
      memory_date: new Date(m.memory_date).toISOString(),
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}
