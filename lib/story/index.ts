/**
 * Story — the compounding archive (Milestone 2). Reads the kept memories newest
 * first: from Supabase (relationship-scoped, RLS) when configured, else the local
 * encrypted store. Journals (Write) are owner-only and never appear here.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { spGetMemories } from './supabaseRepo';
import type { Memory } from '../database/types';

/** All kept memories for the relationship, newest first (by memory date). */
export async function getMemories(
  relId: string | null,
  service: DatabaseService = getService(),
): Promise<Memory[]> {
  if (isSupabaseConfigured()) {
    if (!relId) return [];
    return spGetMemories(relId);
  }
  const all = await service.listLive<Memory>('memories');
  return all.sort((a, b) => b.memory_date - a.memory_date);
}
