/**
 * Vault storage. The server holds ciphertext and two timestamps; it has no key
 * and no way to derive one, so `vault_items` rows and the objects they point at
 * are opaque to it.
 *
 * Deletion here is a real delete — the row and the storage object both go. The
 * soft-delete pattern used everywhere else exists so people can undo mistakes;
 * for this content, an "undo" is the mistake.
 */
import { getSupabaseClient } from '../supabase/client';
import type { VaultItem } from './index';

export const VAULT_BUCKET = 'vault';

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

export async function spListVault(relId: string): Promise<VaultItem[]> {
  const me = await uid();
  const { data } = await client()
    .from('vault_items')
    .select('*')
    .eq('relationship_id', relId)
    .order('created_at', { ascending: false });

  return ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    id: r.id as string,
    created_at: r.created_at ? Date.parse(r.created_at as string) : Date.now(),
    mine: r.author_id === me,
  }));
}

/** Upload the encrypted blob, then record it. Path is prefixed by relationship. */
export async function spUploadVaultItem(relId: string, encrypted: Blob): Promise<void> {
  const me = await uid();
  const path = `${relId}/${crypto.randomUUID()}.bin`;

  const { error: upErr } = await client()
    .storage.from(VAULT_BUCKET)
    .upload(path, encrypted, { contentType: 'application/octet-stream' });
  if (upErr) throw new Error(upErr.message);

  const { error } = await client()
    .from('vault_items')
    .insert({ relationship_id: relId, author_id: me, object_path: path });
  if (error) {
    // Don't leave an orphaned object behind if the row fails to write.
    await client().storage.from(VAULT_BUCKET).remove([path]);
    throw new Error(error.message);
  }
}

/** Download the ciphertext for one item; decryption happens on the device. */
export async function spFetchVaultBytes(id: string): Promise<string | null> {
  const { data: row } = await client()
    .from('vault_items')
    .select('object_path')
    .eq('id', id)
    .maybeSingle();
  const path = (row as { object_path?: string } | null)?.object_path;
  if (!path) return null;

  const { data, error } = await client().storage.from(VAULT_BUCKET).download(path);
  if (error || !data) return null;
  return data.text();
}

/** Hard delete: the object first, then the row. */
export async function spDeleteVaultItem(id: string): Promise<void> {
  const { data: row } = await client()
    .from('vault_items')
    .select('object_path')
    .eq('id', id)
    .maybeSingle();
  const path = (row as { object_path?: string } | null)?.object_path;

  if (path) {
    const { error } = await client().storage.from(VAULT_BUCKET).remove([path]);
    if (error) throw new Error(error.message);
  }
  const { error } = await client().from('vault_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
