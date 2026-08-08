/**
 * Story — the compounding archive (Milestone 2). Reads the kept memories newest
 * first: from Supabase (relationship-scoped, RLS) when configured, else the local
 * encrypted store. Journals (Write) are owner-only and never appear here.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { spCreateMemory, spGetMemories, spPhotoUrl, spUploadPhoto } from './supabaseRepo';
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

/**
 * Keep a memory directly (not from a daily exchange), optionally with one
 * photo (Phase 1: one image per memory). The photo goes to private storage on
 * Supabase, or into the local images store otherwise.
 */
export async function createMemory(
  relId: string,
  fields: { title: string; description?: string; memory_date?: number; photo?: File | Blob | null },
  service: DatabaseService = getService(),
): Promise<void> {
  const title = fields.title.trim();
  if (!title) throw new Error('Give the memory a name first.');
  const memory_date = fields.memory_date ?? Date.now();
  const description = fields.description?.trim() ?? '';

  if (isSupabaseConfigured()) {
    const image_ref = fields.photo ? await spUploadPhoto(relId, fields.photo) : null;
    await spCreateMemory(relId, { title, description, memory_date, image_ref });
    return;
  }

  let image_ref: string | null = null;
  if (fields.photo) {
    const data = await fields.photo.arrayBuffer();
    image_ref = await service.putImage(data, fields.photo.type || 'image/jpeg');
  }
  await service.createMemory({ relationship_id: relId, title, description, memory_date, image_ref });
}

/**
 * Resolve a memory's `image_ref` to a displayable URL: a signed URL from
 * private storage on Supabase, or an object URL from the local images store.
 * Local object URLs should be revoked by the caller when done.
 */
export async function photoUrl(
  ref: string | null,
  service: DatabaseService = getService(),
): Promise<string | null> {
  if (!ref) return null;
  if (isSupabaseConfigured()) return spPhotoUrl(ref);
  const img = await service.getImage(ref);
  if (!img) return null;
  return URL.createObjectURL(new Blob([img.data], { type: img.mime }));
}
