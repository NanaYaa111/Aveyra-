/**
 * Date plans on Supabase. Relationship-scoped (RLS: members only) and shared —
 * either partner can add, move, or remove a plan. Plaintext-under-RLS (staged
 * privacy, Q26); soft-delete only, matching the local store.
 */
import { getSupabaseClient } from '../supabase/client';
import type { DatePlan, DatePlanStatus } from '../database/types';

function client() {
  const c = getSupabaseClient();
  if (!c) throw new Error('Supabase is not configured.');
  return c;
}

function toPlan(row: Record<string, unknown>): DatePlan {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  return {
    id: row.id as string,
    relationship_id: row.relationship_id as string,
    title: (row.title as string) ?? '',
    notes: (row.notes as string) ?? '',
    status: (row.status as DatePlanStatus) ?? 'idea',
    planned_for: row.planned_for ? Date.parse(row.planned_for as string) : null,
    created_at: created,
    updated_at: row.updated_at ? Date.parse(row.updated_at as string) : created,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

export async function spGetPlans(relId: string): Promise<DatePlan[]> {
  const { data } = await client()
    .from('date_plans')
    .select('*')
    .eq('relationship_id', relId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  return ((data ?? []) as Record<string, unknown>[]).map(toPlan);
}

export async function spCreatePlan(
  relId: string,
  fields: { title: string; notes: string; planned_for: number | null },
): Promise<void> {
  const { error } = await client()
    .from('date_plans')
    .insert({
      relationship_id: relId,
      title: fields.title,
      notes: fields.notes,
      status: fields.planned_for ? 'planned' : 'idea',
      planned_for: fields.planned_for ? new Date(fields.planned_for).toISOString() : null,
    });
  if (error) throw new Error(error.message);
}

export async function spUpdatePlan(
  id: string,
  patch: { status?: DatePlanStatus; planned_for?: number | null; notes?: string },
): Promise<void> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.planned_for !== undefined) {
    row.planned_for = patch.planned_for ? new Date(patch.planned_for).toISOString() : null;
  }
  if (patch.notes !== undefined) row.notes = patch.notes;
  const { error } = await client().from('date_plans').update(row).eq('id', id);
  if (error) throw new Error(error.message);
}

/** Soft-delete: sets `deleted_at`, never removes the row. */
export async function spDeletePlan(id: string): Promise<void> {
  const { error } = await client()
    .from('date_plans')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
