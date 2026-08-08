/**
 * What's here when you arrive — the whole of Aveyra's notification surface.
 *
 * Constitution Section J resolved notifications for v1 as "none — in-app
 * reminders/indicators only; push/email deferred", and constrains what an
 * indicator may be: no badges, no counts, no urgency, and never anything that
 * frames the other person as waiting on you ("your partner is waiting" and
 * "you missed…" are named as prohibited copy). Nothing here reveals content —
 * a journal entry is private and is never signalled at all.
 *
 * So this is a plain statement of fact you read once on Today and then it's
 * gone. It does not follow you around the interface, accumulate, turn red, or
 * persist as unread state — there is deliberately no "seen" flag, because
 * tracking what you've looked at is the machinery that turns a signal into an
 * obligation.
 */
import { getService, type DatabaseService } from '../database/service';
import { getTodayCheckIns } from '../checkins';
import { getMessages } from '../messages';
import type { DailyState } from '../daily/service';

/** A single calm line, or nothing at all. */
export interface Presence {
  /** Plain sentences, at most a few. Empty when there is nothing to say. */
  lines: string[];
}

/** Messages from the partner since they last had the floor, counted quietly. */
function partnerSpokeLast(messages: { author: string; created_at: number }[]): boolean {
  const last = messages[messages.length - 1];
  return last != null && last.author !== 'partner_one';
}

/**
 * Build the arrival line for Today. Reads existing state — it introduces no
 * storage of its own, so there is nothing to sync, expire, or mark as read.
 *
 * `daily` is passed in because Today has already loaded it; re-fetching would
 * double the work on the screen this appears on.
 */
export async function getPresence(
  relId: string | null,
  daily: DailyState | null,
  partnerName: string,
  service: DatabaseService = getService(),
): Promise<Presence> {
  if (!relId) return { lines: [] };

  const lines: string[] = [];

  // The reveal is the one thing worth arriving to. Stated as a fact about them,
  // never as a prompt about you.
  if (daily?.status === 'revealed') {
    lines.push(`${partnerName} answered today's question.`);
  }

  const [{ partner: theirCheckIn }, messages] = await Promise.all([
    getTodayCheckIns(relId, service),
    getMessages(relId, service),
  ]);

  if (theirCheckIn) {
    lines.push(`${partnerName} checked in today.`);
  }

  // No count — that a conversation is waiting is the whole of the information.
  if (partnerSpokeLast(messages)) {
    lines.push(`There's a message from ${partnerName}.`);
  }

  return { lines };
}
