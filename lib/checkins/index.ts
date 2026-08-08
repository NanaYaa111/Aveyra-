/**
 * Check-in — a daily emotional weather report, shared the moment it's made.
 * One feeling word (+ an optional line) per person per day, editable all day.
 * Never a score: no numbers, no streaks, no history-trend charts, no prompts
 * to "keep it up" (Q23). Its whole job is "here's how I'm arriving today."
 * Backend-agnostic: Supabase (with realtime) when configured, else local.
 */
import { getService, type DatabaseService } from '../database/service';
import { isSupabaseConfigured } from '../supabase/client';
import { dateKeyInTimeZone } from '../questions/rotation';
import { ME } from '../daily/service';
import { spCheckInsFor, spSubmitCheckIn, spSubscribeCheckIns } from './supabaseRepo';
import type { CheckIn, Mood } from '../database/types';

/** Friendly display for each feeling word. */
export const MOOD_LABELS: Record<Mood, { emoji: string; label: string }> = {
  calm: { emoji: '🌿', label: 'Calm' },
  happy: { emoji: '🌞', label: 'Happy' },
  grateful: { emoji: '🕊️', label: 'Grateful' },
  tired: { emoji: '🌙', label: 'Tired' },
  stressed: { emoji: '🌧️', label: 'Stretched' },
  sad: { emoji: '🌫️', label: 'Low' },
};

function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** Today's local YYYY-MM-DD key. */
export function todayKey(): string {
  return dateKeyInTimeZone(new Date(), localTimeZone());
}

/** Today's check-ins for the relationship, resolved to mine/partner. */
export async function getTodayCheckIns(
  relId: string | null,
  service: DatabaseService = getService(),
): Promise<{ mine: CheckIn | null; partner: CheckIn | null }> {
  const key = todayKey();
  if (isSupabaseConfigured()) {
    if (!relId) return { mine: null, partner: null };
    return spCheckInsFor(relId, key);
  }
  const all = await service.listLive<CheckIn>('checkIns');
  const today = all.filter((c) => c.date_key === key);
  return {
    mine: today.find((c) => c.author === ME) ?? null,
    partner: today.find((c) => c.author !== ME) ?? null,
  };
}

/** Submit or revise today's check-in. */
export async function submitCheckIn(
  relId: string,
  mood: Mood,
  note: string,
  service: DatabaseService = getService(),
): Promise<void> {
  const key = todayKey();
  const trimmed = note.trim();
  if (isSupabaseConfigured()) {
    await spSubmitCheckIn(relId, key, mood, trimmed);
    return;
  }
  const { mine } = await getTodayCheckIns(relId, service);
  if (mine) {
    await service.updateCheckIn(mine.id, { mood, note: trimmed });
  } else {
    await service.createCheckIn({
      relationship_id: relId,
      author: ME,
      date_key: key,
      mood,
      note: trimmed,
    });
  }
}

/** Live partner check-ins. Realtime on Supabase; no-op on the local stub. */
export function subscribeCheckIns(relId: string, onChange: () => void): () => void {
  if (isSupabaseConfigured()) return spSubscribeCheckIns(relId, onChange);
  return () => {};
}
