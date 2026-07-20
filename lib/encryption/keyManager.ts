import { getDB } from '../database/db';
import {
  type Envelope,
  aesEncrypt,
  aesDecrypt,
  deriveKek,
  generateDataKeyBytes,
  importDataKey,
  generateDeviceKeyPair,
  exportPublicKey,
  encryptString,
  decryptString,
  randomBytes,
  toBase64,
  fromBase64,
} from './primitives';

const VAULT_ID = 'vault';
const CHECK_PLAINTEXT = 'aveyra-unlock-check';

/**
 * Persisted key material. Stored as CryptoKey objects (structured-clone into
 * IndexedDB) or ciphertext — never raw key bytes in plaintext (research §5.2).
 */
export interface KeyVaultRecord {
  id: string;
  has_passphrase: boolean;
  device_public: string;
  device_private: CryptoKey;
  /** No-passphrase mode: the content key stored as a non-extractable CryptoKey. */
  data_key?: CryptoKey;
  /** Passphrase mode: the content key bytes, encrypted under the passphrase KEK. */
  salt?: string;
  wrapped_data_key?: Envelope;
  check?: Envelope;
}

/**
 * KeyManager owns the lifecycle of the content-encryption key and the device
 * keypair (Constitution Part 3 §7–9).
 *
 * Two modes, chosen once at onboarding:
 *  - No passphrase: content key stored as a non-extractable CryptoKey. Usable
 *    every launch; protects the JSON tables against casual inspection, not
 *    against someone using the device. Honest messaging reflects this.
 *  - Passphrase: content key wrapped under a PBKDF2 key; must be unlocked each
 *    session; there is no recovery if the passphrase is lost.
 *
 * The unlocked content key lives in memory only and is dropped on lock.
 */
export class KeyManager {
  private dataKey: CryptoKey | null = null;

  private get db() {
    return getDB();
  }

  async getVault(): Promise<KeyVaultRecord | undefined> {
    return this.db.keyvault.get(VAULT_ID);
  }

  async isInitialised(): Promise<boolean> {
    return (await this.getVault()) !== undefined;
  }

  async hasPassphrase(): Promise<boolean> {
    return (await this.getVault())?.has_passphrase ?? false;
  }

  /** True when a passphrase is set but the key is not yet unlocked this session. */
  async isLocked(): Promise<boolean> {
    const vault = await this.getVault();
    if (!vault) return false;
    if (!vault.has_passphrase) return false;
    return this.dataKey === null;
  }

  /** Create the vault. Called once during onboarding. */
  async initialise(passphrase?: string): Promise<void> {
    if (await this.isInitialised()) return;
    const device = await generateDeviceKeyPair();
    const device_public = await exportPublicKey(device.publicKey);
    const keyBytes = generateDataKeyBytes();
    this.dataKey = await importDataKey(keyBytes);

    if (passphrase && passphrase.length > 0) {
      const salt = randomBytes(16);
      const kek = await deriveKek(passphrase, salt);
      const wrapped = await aesEncrypt(kek, keyBytes);
      const check = await encryptString(this.dataKey, CHECK_PLAINTEXT);
      await this.db.keyvault.put({
        id: VAULT_ID,
        has_passphrase: true,
        device_public,
        device_private: device.privateKey,
        salt: toBase64(salt),
        wrapped_data_key: wrapped,
        check,
      });
    } else {
      await this.db.keyvault.put({
        id: VAULT_ID,
        has_passphrase: false,
        device_public,
        device_private: device.privateKey,
        data_key: this.dataKey,
      });
    }
    keyBytes.fill(0);
  }

  /** Unlock a passphrase-protected vault for this session. Throws if wrong. */
  async unlock(passphrase: string): Promise<void> {
    const vault = await this.getVault();
    if (!vault || !vault.has_passphrase || !vault.salt || !vault.wrapped_data_key || !vault.check) {
      throw new Error('No passphrase-protected vault to unlock.');
    }
    const kek = await deriveKek(passphrase, fromBase64(vault.salt));
    let keyBytes: ArrayBuffer;
    try {
      keyBytes = await aesDecrypt(kek, vault.wrapped_data_key);
    } catch {
      throw new WrongPassphraseError();
    }
    const candidate = await importDataKey(new Uint8Array(keyBytes));
    // Verify against the known-plaintext check.
    try {
      const plain = await decryptString(candidate, vault.check);
      if (plain !== CHECK_PLAINTEXT) throw new WrongPassphraseError();
    } catch {
      throw new WrongPassphraseError();
    }
    this.dataKey = candidate;
  }

  /** Drop the in-memory content key (e.g. on session end). */
  lock(): void {
    this.dataKey = null;
  }

  /** The active content key, or null if locked / not initialised. */
  async getDataKey(): Promise<CryptoKey | null> {
    if (this.dataKey) return this.dataKey;
    const vault = await this.getVault();
    if (vault && !vault.has_passphrase && vault.data_key) {
      this.dataKey = vault.data_key;
      return this.dataKey;
    }
    return null;
  }

  /** This device's public key (base64), for a future partner invitation. */
  async devicePublicKey(): Promise<string | null> {
    return (await this.getVault())?.device_public ?? null;
  }
}

export class WrongPassphraseError extends Error {
  constructor() {
    super("That passphrase didn't match. There is no way to recover it if it's lost.");
    this.name = 'WrongPassphraseError';
  }
}

let manager: KeyManager | null = null;
export function getKeyManager(): KeyManager {
  if (!manager) manager = new KeyManager();
  return manager;
}
