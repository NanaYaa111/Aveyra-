/**
 * Daily-answers on Supabase (Milestone 2 backend, Q25). Real two-person exchange:
 * each partner's answer is a row scoped to the relationship (RLS: members only).
 * "Mine" vs "partner" is decided by `author_id` against the signed-in user — no
 * dev simulation here (a real partner answers on their own device).
 *
 * Content is plaintext-under-RLS (staged privacy, Q26); the local field encryption
 * protects only the on-device cache. Rotation stays client-side and deterministic,
 * so both devices independently compute the same question per day.
 */
import { getSupabaseClient } from '../supabase/client';
import type { Answer } from '../database/types';

function client() {
  const c = getSupabaseClient();
  if (!c) throw new Error('Supabase is not configured.');
  return c;
}

async function uid(): Promise<string> {
  const { data } = await client().auth.getUser();
  if (!data.user) throw new Error('You need to be signed in.');
  return data.user.id;
}

function toAnswer(row: Record<string, unknown>, mine: boolean): Answer {
  const created = row.created_at ? Date.parse(row.created_at as string) : Date.now();
  return {
    id: row.id as string,
    question_id: row.question_id as string,
    author: mine ? 'partner_one' : 'partner_two',
    content: (row.content as string) ?? '',
    created_at: created,
    updated_at: row.updated_at ? Date.parse(row.updated_at as string) : created,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

/** Both answers for a question in this relationship, resolved to mine/partner. */
export async function spAnswersFor(
  relId: string,
  questionId: string,
): Promise<{ mine: Answer | null; partner: Answer | null }> {
  const me = await uid();
  const { data } = await client()
    .from('answers')
    .select('*')
    .eq('relationship_id', relId)
    .eq('question_id', questionId);
  const rows = (data ?? []) as Record<string, unknown>[];
  const mineRow = rows.find((r) => r.author_id === me) ?? null;
  const partnerRow = rows.find((r) => r.author_id !== me) ?? null;
  return {
    mine: mineRow ? toAnswer(mineRow, true) : null,
    partner: partnerRow ? toAnswer(partnerRow, false) : null,
  };
}

/**
 * Insert or update my answer for a question (RLS ensures it's my own).
 *
 * A single atomic upsert on the `(relationship_id, question_id, author_id)`
 * unique constraint — not a select-then-insert/update — so a double-tap or a
 * retried request after a timeout can't create two rows for the same
 * person/question (the reveal logic assumes exactly one row per author).
 */
export async function spSubmitAnswer(
  relId: string,
  questionId: string,
  content: string,
): Promise<void> {
  const me = await uid();
  const { error } = await client()
    .from('answers')
    .upsert(
      {
        relationship_id: relId,
        question_id: questionId,
        author_id: me,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'relationship_id,question_id,author_id' },
    );
  if (error) throw new Error(error.message);
}
