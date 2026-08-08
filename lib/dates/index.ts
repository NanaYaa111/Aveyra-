/**
 * Date Planner — a shared, unhurried list of things to do together. Ideas can
 * become plans (given a date) and plans become done; nothing nags, nothing
 * expires, nothing scores (Q23). Both partners see and tend the same list.
 * Backend-agnostic like every feature lib: Supabase when configured, else the
 * local encrypted store.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { spCreatePlan, spDeletePlan, spGetPlans, spUpdatePlan } from './supabaseRepo';
import type { DatePlan, DatePlanStatus } from '../database/types';

/** All live plans for the relationship, newest first. */
export async function getPlans(
  relId: string | null,
  service: DatabaseService = getService(),
): Promise<DatePlan[]> {
  if (isSupabaseConfigured()) {
    if (!relId) return [];
    return spGetPlans(relId);
  }
  const all = await service.listLive<DatePlan>('datePlans');
  return all.sort((a, b) => b.created_at - a.created_at);
}

/** Add an idea (no date) or a plan (with one). Title required. */
export async function createPlan(
  relId: string,
  fields: { title: string; notes?: string; planned_for?: number | null },
  service: DatabaseService = getService(),
): Promise<void> {
  const title = fields.title.trim();
  if (!title) throw new Error('Give the idea a name first.');
  const planned_for = fields.planned_for ?? null;
  if (isSupabaseConfigured()) {
    await spCreatePlan(relId, { title, notes: fields.notes?.trim() ?? '', planned_for });
    return;
  }
  await service.createDatePlan({
    relationship_id: relId,
    title,
    notes: fields.notes?.trim() ?? '',
    status: planned_for ? 'planned' : 'idea',
    planned_for,
  });
}

/** Give an idea a date (making it planned), or move a plan's date. */
export async function schedulePlan(
  id: string,
  when: number,
  service: DatabaseService = getService(),
): Promise<void> {
  if (isSupabaseConfigured()) {
    await spUpdatePlan(id, { status: 'planned', planned_for: when });
    return;
  }
  await service.updateDatePlan(id, { status: 'planned', planned_for: when });
}

/** Mark a plan done — it joins the quiet record of dates you've had. */
export async function completePlan(
  id: string,
  service: DatabaseService = getService(),
): Promise<void> {
  if (isSupabaseConfigured()) {
    await spUpdatePlan(id, { status: 'done' });
    return;
  }
  await service.updateDatePlan(id, { status: 'done' });
}

/** Remove a plan (local → Recently Deleted; server → soft-deleted). */
export async function deletePlan(
  id: string,
  service: DatabaseService = getService(),
): Promise<void> {
  if (isSupabaseConfigured()) {
    await spDeletePlan(id);
    return;
  }
  await service.softDelete('datePlans', id);
}

/** Plans grouped for display: ideas, upcoming (soonest first), and done. */
export function groupPlans(plans: DatePlan[]): {
  ideas: DatePlan[];
  planned: DatePlan[];
  done: DatePlan[];
} {
  const by = (s: DatePlanStatus) => plans.filter((p) => p.status === s);
  return {
    ideas: by('idea'),
    planned: by('planned').sort((a, b) => (a.planned_for ?? 0) - (b.planned_for ?? 0)),
    done: by('done'),
  };
}
