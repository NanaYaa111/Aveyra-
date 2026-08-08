/**
 * End-to-end encryption for the private vault.
 *
 * Everything else in Aveyra is "plaintext under RLS" (Q26): the server can read
 * it, and that is an honest trade for recoverability. The vault holds intimate
 * photos, where that trade is the wrong way round — so its contents are
 * encrypted on the device with a key the server never receives.
 *
 * **How the two devices agree on a key.** Each device already generates an ECDH
 * P-256 keypair at onboarding, with a *non-extractable* private key. Only the
 * public halves are published. Each side then runs ECDH against the other's
 * public key and HKDFs the result into a vault key. Both arrive at the same key
 * without it ever crossing the network, and the server — which only ever sees
 * two public keys — cannot derive it.
 *
 * **What this does not protect against.** Screenshots. An unlocked phone.
 * Malware on either device. And, unavoidably: if both of you lose every device,
 * the vault is gone, because there is no copy of the key anywhere else. That is
 * what end-to-end actually means, and the UI says so rather than implying a
 * recovery that doesn't exist.
 */
import { getKeyManager, type KeyManager } from '../encryption/keyManager';
import { derivePurposeKey, importPublicKey } from '../encryption/primitives';
import { isSupabaseConfigured } from '../supabase/client';
import { spGetPartnerPublicKey, spPublishPublicKey } from './supabaseRepo';

/** Label binding a derived key to this purpose; changing it invalidates old keys. */
const VAULT_PURPOSE = 'aveyra-vault-v1';

export class NoPartnerKeyError extends Error {
  constructor() {
    super('Your partner hasn’t opened the vault on their device yet.');
    this.name = 'NoPartnerKeyError';
  }
}

/** Cached per relationship — derivation is cheap but not free, and this is hot. */
const cache = new Map<string, CryptoKey>();

/**
 * Publish this device's public key so the partner can complete the agreement.
 * Safe to call repeatedly; public keys are not secret.
 */
export async function publishPublicKey(keys: KeyManager = getKeyManager()): Promise<void> {
  if (!isSupabaseConfigured()) return; // nothing to publish to
  const vault = await ensureKeyMaterial(keys);
  await spPublishPublicKey(vault.device_public);
}

/**
 * Get this device's key material, creating it if this is the first thing the
 * user has done. Opening the Vault before writing anything else is a perfectly
 * normal first action, and it shouldn't fail because no other feature happened
 * to initialise the keystore first. `initialise` is idempotent.
 */
async function ensureKeyMaterial(keys: KeyManager) {
  let vault = await keys.getVault();
  if (!vault) {
    await keys.initialise();
    vault = await keys.getVault();
  }
  if (!vault) throw new Error('This device could not set up its keys.');
  return vault;
}

/**
 * The shared vault key for this relationship.
 *
 * With a backend, this is the real two-party ECDH agreement. Without one there
 * is no second device to agree with, so the key is derived against this
 * device's own public key — still encrypted at rest, but honestly single-party;
 * the dev stub is not a security claim.
 */
export async function getVaultKey(
  relationshipId: string,
  keys: KeyManager = getKeyManager(),
): Promise<CryptoKey> {
  const cached = cache.get(relationshipId);
  if (cached) return cached;

  const vault = await ensureKeyMaterial(keys);

  const partnerPublicB64 = isSupabaseConfigured()
    ? await spGetPartnerPublicKey(relationshipId)
    : vault.device_public;

  if (!partnerPublicB64) throw new NoPartnerKeyError();

  const key = await derivePurposeKey(
    vault.device_private,
    await importPublicKey(partnerPublicB64),
    relationshipId,
    VAULT_PURPOSE,
  );
  cache.set(relationshipId, key);
  return key;
}

/** Drop derived keys from memory (sign-out, or after the partner re-keys). */
export function forgetVaultKeys(): void {
  cache.clear();
}
