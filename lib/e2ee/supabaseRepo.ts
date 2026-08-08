/**
 * Public-key directory. The server stores each member's ECDH *public* key so
 * the two devices can complete a key agreement — public keys are not secret and
 * carry nothing that would let the server derive the shared key.
 */
import { getSupabaseClient } from '../supabase/client';

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

/** Store this device's public key on my own profile row (RLS: self-write only). */
export async function spPublishPublicKey(devicePublic: string): Promise<void> {
  const me = await uid();
  const { error } = await client()
    .from('profiles')
    .update({ device_public: devicePublic })
    .eq('id', me);
  if (error) throw new Error(error.message);
}

/** The partner's published public key, or null if they haven't opened the vault yet. */
export async function spGetPartnerPublicKey(relId: string): Promise<string | null> {
  const me = await uid();
  const { data: members } = await client()
    .from('relationship_members')
    .select('user_id')
    .eq('relationship_id', relId);

  const partnerId = ((members ?? []) as { user_id: string }[]).find((m) => m.user_id !== me)
    ?.user_id;
  if (!partnerId) return null;

  const { data } = await client()
    .from('profiles')
    .select('device_public')
    .eq('id', partnerId)
    .maybeSingle();

  return (data as { device_public?: string } | null)?.device_public ?? null;
}
