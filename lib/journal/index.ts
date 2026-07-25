/**
 * Write — the private journal (Milestone 2). Owner-only reflection: entries are
 * NEVER shared, never surfaced in Story, search, or partner views (Constitution —
 * the journal is private everywhere). Content is encrypted at rest. Backend-
 * agnostic; with Supabase, owner-only access is enforced by RLS as well.
 */
import { getService, type DatabaseService } from '../database/service';
import { getSelfUser } from '../identity';
import type { JournalEntry } from '../database/types';

/** This device owner's entries, newest first. */
export async function getEntries(service: DatabaseService = getService()): Promise<JournalEntry[]> {
  const all = await service.listLive<JournalEntry>('journalEntries');
  return all.sort((a, b) => b.created_at - a.created_at);
}

/** Write a new private entry. Title optional; content required. */
export async function createEntry(
  fields: { title?: string; content: string },
  service: DatabaseService = getService(),
): Promise<JournalEntry> {
  const content = fields.content.trim();
  if (!content) throw new Error('Write something before saving.');
  const self = await getSelfUser();
  return service.createJournalEntry({
    owner_id: self?.id ?? 'self',
    title: fields.title?.trim() ?? '',
    content,
  });
}

/** Move an entry to Recently Deleted (recoverable in Settings). */
export async function deleteEntry(
  id: string,
  service: DatabaseService = getService(),
): Promise<void> {
  await service.softDelete('journalEntries', id);
}
