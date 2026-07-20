import { getKeyManager, KeyManager } from './keyManager';
import { encryptString, decryptString, type Envelope } from './primitives';

/** Prefix marking a stored value as an Aveyra ciphertext envelope. */
const PREFIX = 'enc:v1:';

/**
 * Field-level cipher for content stored in IndexedDB. Encrypts sensitive
 * strings (answers, journal content, memory text, partner name) with the active
 * content key. Metadata/index fields (ids, timestamps) stay plaintext so the
 * database remains queryable (Constitution Part 3 §9 implementation note).
 */
export class Cipher {
  constructor(private keys: KeyManager = getKeyManager()) {}

  async isReady(): Promise<boolean> {
    return (await this.keys.getDataKey()) !== null;
  }

  /** Encrypt a string field to a self-describing token. */
  async encrypt(value: string): Promise<string> {
    const key = await this.keys.getDataKey();
    if (!key) throw new Error('Cannot encrypt: no content key available (locked?).');
    const env = await encryptString(key, value);
    return PREFIX + JSON.stringify(env);
  }

  /** Decrypt a token produced by encrypt(). Plaintext values pass through. */
  async decrypt(token: string): Promise<string> {
    if (!token.startsWith(PREFIX)) return token; // tolerate legacy plaintext
    const key = await this.keys.getDataKey();
    if (!key) throw new Error('Cannot decrypt: no content key available (locked?).');
    const env = JSON.parse(token.slice(PREFIX.length)) as Envelope;
    return decryptString(key, env);
  }

  isEncrypted(token: string): boolean {
    return token.startsWith(PREFIX);
  }
}

let cipher: Cipher | null = null;
export function getCipher(): Cipher {
  if (!cipher) cipher = new Cipher();
  return cipher;
}
