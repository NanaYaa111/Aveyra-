/**
 * Messages — the couple's own quiet thread. No read receipts, no typing
 * indicators, no "last seen" (calm technology; presence pressure is a dark
 * pattern the constitution prohibits). Just words between two people.
 * Backend-agnostic: Supabase (with realtime) when configured, else local.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { spGetMessages, spSendMessage, spSubscribeMessages } from './supabaseRepo';
import { ME } from '../daily/service';
import type { Message } from '../database/types';

/** The thread, oldest first. */
export async function getMessages(
  relId: string | null,
  service: DatabaseService = getService(),
): Promise<Message[]> {
  if (isSupabaseConfigured()) {
    if (!relId) return [];
    return spGetMessages(relId);
  }
  const all = await service.listLive<Message>('messages');
  return all.sort((a, b) => a.created_at - b.created_at);
}

/** Send a message. Content required. */
export async function sendMessage(
  relId: string,
  content: string,
  service: DatabaseService = getService(),
): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) throw new Error('Write a little something first.');
  if (isSupabaseConfigured()) {
    await spSendMessage(relId, trimmed);
    return;
  }
  await service.createMessage({
    relationship_id: relId,
    author: ME,
    content: trimmed,
    kind: 'message',
  });
}

/**
 * Live thread updates. Realtime on Supabase; a no-op on the local stub (there
 * is no second device to hear from). Returns an unsubscribe.
 */
export function subscribeMessages(relId: string, onChange: () => void): () => void {
  if (isSupabaseConfigured()) return spSubscribeMessages(relId, onChange);
  return () => {};
}
