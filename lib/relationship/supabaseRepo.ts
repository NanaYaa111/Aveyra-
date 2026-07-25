/**
 * Supabase-backed relationship space (Milestone 2, Q25). Mirrors the local
 * onboarding operations against the schema + RPCs in docs/supabase-setup.md, so a
 * real space is created server-side, invitations are real, and a partner truly
 * joins. Selected over the local path by `isSupabaseConfigured()`.
 *
 * Content stays plaintext-under-RLS here (staged privacy, open-questions Q26); the
 * device-local encryption protects the local cache only.
 */
import { getSupabaseClient } from '../supabase/client';
import type { Relationship, RelationshipStatus } from '../database/types';

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function client() {
  const c = getSupabaseClient();
  if (!c) throw new Error('Supabase is not configured.');
  return c;
}

async function currentUser() {
  const { data } = await client().auth.getUser();
  if (!data.user) throw new Error('You need to be signed in.');
  return data.user;
}

function randomCode(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = '';
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

async function upsertProfile(displayName: string): Promise<void> {
  const user = await currentUser();
  await client()
    .from('profiles')
    .upsert({ id: user.id, email: user.email ?? '', display_name: displayName.trim() });
}

/** Create the space server-side (RPC adds the creator as a member). */
export async function spCreateSpace(args: {
  yourName: string;
  startDate?: number | null;
}): Promise<void> {
  await upsertProfile(args.yourName);
  const start = args.startDate ? new Date(args.startDate).toISOString().slice(0, 10) : null;
  const { error } = await client().rpc('create_space', { start });
  if (error) throw new Error(error.message);
}

/** Find the caller's current relationship id, if any. */
async function myRelationshipId(): Promise<string | null> {
  const user = await currentUser();
  const { data } = await client()
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();
  return (data?.relationship_id as string | undefined) ?? null;
}

export interface Invite {
  encoded: string;
  code: string;
  expiresAt: number;
}

/** Mint a real, single-use invitation for the caller's space. */
export async function spCreateInvite(): Promise<Invite> {
  const user = await currentUser();
  const relId = await myRelationshipId();
  if (!relId) throw new Error('Create your space before inviting your partner.');
  const code = randomCode();
  const expiresAt = Date.now() + INVITE_TTL_MS;
  const { error } = await client().from('invitations').insert({
    relationship_id: relId,
    code,
    inviter_id: user.id,
    expires_at: new Date(expiresAt).toISOString(),
  });
  if (error) throw new Error(error.message);
  return { encoded: code, code, expiresAt };
}

/** Join a partner's space by invite code (RPC validates + adds membership). */
export async function spJoin(args: { yourName: string; code: string }): Promise<void> {
  await upsertProfile(args.yourName);
  const { error } = await client().rpc('accept_invitation', { invite_code: args.code.trim() });
  if (error) throw new Error(error.message);
}

/** The caller's relationship as a Relationship-shaped view, or null. */
export async function spGetRelationship(): Promise<Relationship | null> {
  const user = await currentUser();
  const relId = await myRelationshipId();
  if (!relId) return null;

  const { data: rel } = await client()
    .from('relationships')
    .select('id, start_date, created_at')
    .eq('id', relId)
    .maybeSingle();

  const { data: members } = await client()
    .from('relationship_members')
    .select('user_id')
    .eq('relationship_id', relId);

  const partnerId =
    (members ?? []).map((m) => m.user_id as string).find((uid) => uid !== user.id) ?? null;

  let partnerName = '';
  if (partnerId) {
    const { data: partner } = await client()
      .from('profiles')
      .select('display_name')
      .eq('id', partnerId)
      .maybeSingle();
    partnerName = (partner?.display_name as string | undefined) ?? '';
  }

  const status: RelationshipStatus = partnerId ? 'linked' : 'pending';
  const createdAt = rel?.created_at ? Date.parse(rel.created_at as string) : Date.now();
  const startDate = rel?.start_date ? Date.parse(rel.start_date as string) : null;

  return {
    id: relId,
    creator_id: user.id,
    partner_id: partnerId,
    status,
    partner_name: partnerName,
    relationship_start_date: startDate,
    created_at: createdAt,
    updated_at: createdAt,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}
