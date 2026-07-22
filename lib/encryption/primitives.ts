/**
 * Web Crypto primitives (Constitution Part 3 §7–9; research dossier §5.2).
 *
 * - AES-GCM for authenticated encryption, with a FRESH random 12-byte IV per
 *   operation (never reuse an IV with a key).
 * - PBKDF2 (SHA-256, high iteration count) to derive a key-encryption-key from
 *   a passphrase. Argon2 would need a dependency, so PBKDF2 it is.
 * - ECDH P-256 device keypair for FUTURE end-to-end key exchange (amendment
 *   A4); generated now so the identity is E2EE-ready, exercised in Milestone 2.
 *
 * Honest threat model: this protects data at rest against casual/opportunistic
 * access, not against a compromised bundle, malware, or forensic recovery.
 */

// OWASP 2023 guidance for PBKDF2-HMAC-SHA256.
export const PBKDF2_ITERATIONS = 600_000;
const IV_BYTES = 12;

const subtle = () => globalThis.crypto.subtle;

export function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  return globalThis.crypto.getRandomValues(new Uint8Array(length));
}

// ---- base64 (works in browser and Node) ---------------------------------
export function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (const b of arr) binary += String.fromCharCode(b);
  return btoa(binary);
}
export function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

const enc = new TextEncoder();
const dec = new TextDecoder();
/** Encode to an ArrayBuffer-backed view accepted by Web Crypto's BufferSource. */
const encode = (s: string): Uint8Array<ArrayBuffer> => enc.encode(s) as Uint8Array<ArrayBuffer>;

/** A serialisable encrypted value. `v` allows format evolution. */
export interface Envelope {
  v: 1;
  iv: string;
  ct: string;
}

// ---- AES-GCM -------------------------------------------------------------
export async function aesEncrypt(key: CryptoKey, data: BufferSource): Promise<Envelope> {
  const iv = randomBytes(IV_BYTES);
  const ct = await subtle().encrypt({ name: 'AES-GCM', iv }, key, data);
  return { v: 1, iv: toBase64(iv), ct: toBase64(ct) };
}

export async function aesDecrypt(key: CryptoKey, env: Envelope): Promise<ArrayBuffer> {
  const iv = fromBase64(env.iv);
  const ct = fromBase64(env.ct);
  return subtle().decrypt({ name: 'AES-GCM', iv }, key, ct);
}

export async function encryptString(key: CryptoKey, value: string): Promise<Envelope> {
  return aesEncrypt(key, encode(value));
}
export async function decryptString(key: CryptoKey, env: Envelope): Promise<string> {
  return dec.decode(await aesDecrypt(key, env));
}

// ---- Data key (content encryption key) ----------------------------------
/** Generate 32 random bytes for a fresh content key. */
export function generateDataKeyBytes(): Uint8Array<ArrayBuffer> {
  return randomBytes(32);
}

/** Import raw key bytes as a non-extractable AES-GCM key held in memory. */
export function importDataKey(bytes: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  return subtle().importKey('raw', bytes, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ]);
}

// ---- Passphrase → key-encryption-key (KEK) ------------------------------
export async function deriveKek(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const base = await subtle().importKey('raw', encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return subtle().deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ---- Device keypair (ECDH) for future E2EE key exchange -----------------
export function generateDeviceKeyPair(): Promise<CryptoKeyPair> {
  // Private key non-extractable; public key extractable so it can be shared in
  // an invitation. Used to derive a shared secret with the partner in M2.
  return subtle().generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, [
    'deriveKey',
    'deriveBits',
  ]) as Promise<CryptoKeyPair>;
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const raw = await subtle().exportKey('raw', key);
  return toBase64(raw);
}
export function importPublicKey(b64: string): Promise<CryptoKey> {
  return subtle().importKey('raw', fromBase64(b64), { name: 'ECDH', namedCurve: 'P-256' }, true, []);
}

/** Derive a shared AES-GCM key from our private key + partner's public key. */
export function deriveSharedKey(
  privateKey: CryptoKey,
  partnerPublicKey: CryptoKey,
): Promise<CryptoKey> {
  return subtle().deriveKey(
    { name: 'ECDH', public: partnerPublicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}
