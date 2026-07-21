import { describe, it, expect } from 'vitest';
import {
  toBase64,
  fromBase64,
  randomBytes,
  generateDataKeyBytes,
  importDataKey,
  encryptString,
  decryptString,
  aesEncrypt,
  aesDecrypt,
} from '@/lib/encryption/primitives';

describe('base64 helpers', () => {
  it('round-trips arbitrary bytes, including high values and zeros', () => {
    const bytes = new Uint8Array([0, 1, 2, 127, 128, 200, 254, 255, 0, 65]);
    expect(Array.from(fromBase64(toBase64(bytes)))).toEqual(Array.from(bytes));
  });

  it('round-trips random 256-byte buffers', () => {
    for (let i = 0; i < 5; i++) {
      const bytes = randomBytes(256);
      expect(Array.from(fromBase64(toBase64(bytes)))).toEqual(Array.from(bytes));
    }
  });

  it('accepts an ArrayBuffer as well as a Uint8Array', () => {
    const bytes = randomBytes(16);
    expect(toBase64(bytes.buffer)).toBe(toBase64(bytes));
  });
});

describe('randomBytes', () => {
  it('returns the requested length', () => {
    expect(randomBytes(12)).toHaveLength(12);
    expect(randomBytes(32)).toHaveLength(32);
  });

  it('is overwhelmingly unlikely to repeat', () => {
    const a = toBase64(randomBytes(32));
    const b = toBase64(randomBytes(32));
    expect(a).not.toBe(b);
  });
});

describe('AES-GCM authentication', () => {
  it('rejects a tampered ciphertext (auth tag fails)', async () => {
    const key = await importDataKey(generateDataKeyBytes());
    const env = await encryptString(key, 'integrity matters');

    // Flip a byte in the ciphertext.
    const ct = fromBase64(env.ct);
    ct[0] = ct[0]! ^ 0xff;
    const tampered = { ...env, ct: toBase64(ct) };

    await expect(aesDecrypt(key, tampered)).rejects.toBeTruthy();
  });

  it('fails to decrypt with a different key', async () => {
    const keyA = await importDataKey(generateDataKeyBytes());
    const keyB = await importDataKey(generateDataKeyBytes());
    const env = await encryptString(keyA, 'for A only');
    await expect(decryptString(keyB, env)).rejects.toBeTruthy();
  });

  it('rejects a tampered IV', async () => {
    const key = await importDataKey(generateDataKeyBytes());
    const env = await aesEncrypt(key, new TextEncoder().encode('hello'));
    const iv = fromBase64(env.iv);
    iv[0] = iv[0]! ^ 0x01;
    await expect(aesDecrypt(key, { ...env, iv: toBase64(iv) })).rejects.toBeTruthy();
  });

  it('encrypts empty strings and long strings losslessly', async () => {
    const key = await importDataKey(generateDataKeyBytes());
    for (const value of ['', 'x', 'a'.repeat(10_000)]) {
      expect(await decryptString(key, await encryptString(key, value))).toBe(value);
    }
  });
});
