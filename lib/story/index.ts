/**
 * Story — the compounding archive (Milestone 2). Reads the kept memories from the
 * encrypted local store, newest first. Backend-agnostic: when Supabase lands the
 * same shape comes from the synced store. Journals (Write) are owner-only and
 * never appear here (Constitution — private journal stays private).
 */
import { getService, type DatabaseService } from '../database/service';
import type { Memory } from '../database/types';

/** All kept memories for the relationship, newest first (by memory date). */
export async function getMemories(service: DatabaseService = getService()): Promise<Memory[]> {
  const all = await service.listLive<Memory>('memories');
  return all.sort((a, b) => b.memory_date - a.memory_date);
}
