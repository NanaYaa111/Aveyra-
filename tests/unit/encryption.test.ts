import { describe, it, expect } from 'vitest';
import {
  generateDataKeyBytes,
  importDataKey,
  encryptString,
  decryptString,
  deriveKek,
  aesEncrypt,
  aesDecrypt,
  randomBytes,
  generateDeviceKeyPair,
  exportPublicKey,
  importPublicKey,
  deriveSharedKey,
} from '@/lib/encryption/primitives';

describe('AES-GCM content encryption', () => {
  it('round-trips a string', async () => {
    const key = await importDataKey(generateDataKeyBytes());
    const env = await encryptString(key, 'a quiet, private thought');
    expect(env.iv).toBeTruthy();
    expect(env.ct).toBeTruthy();
    expect(await decryptString(key, env)).toBe('a quiet, private thought');
  });

  it('uses a fresh IV each time (no reuse)', async () => {
    const key = await importDataKey(generateDataKeyBytes());
    const a = await encryptString(key, 'same text');
    const b = await encryptString(key, 'same text');
    expect(a.iv).not.toBe(b.iv);
    expect(a.ct).not.toBe(b.ct);
  });
});

describe('passphrase-derived key (PBKDF2)', () => {
  it('unwraps with the correct passphrase and fails with a wrong one', async () => {
    const salt = randomBytes(16);
    const secret = generateDataKeyBytes();

    const kek = await deriveKek('correct horse battery', salt);
    const wrapped = await aesEncrypt(kek, secret);

    const good = await deriveKek('correct horse battery', salt);
    const unwrapped = new Uint8Array(await aesDecrypt(good, wrapped));
    expect(Array.from(unwrapped)).toEqual(Array.from(secret));

    const bad = await deriveKek('wrong passphrase', salt);
    await expect(aesDecrypt(bad, wrapped)).rejects.toBeTruthy();
  });
});

describe('ECDH device key exchange (E2EE-ready)', () => {
  it('two devices derive the same shared key', async () => {
    const a = await generateDeviceKeyPair();
    const b = await generateDeviceKeyPair();

    const aPubExported = await exportPublicKey(a.publicKey);
    const bPubExported = await exportPublicKey(b.publicKey);

    const aShared = await deriveSharedKey(a.privateKey, await importPublicKey(bPubExported));
    const bShared = await deriveSharedKey(b.privateKey, await importPublicKey(aPubExported));

    const env = await encryptString(aShared, 'hello partner');
    expect(await decryptString(bShared, env)).toBe('hello partner');
  });
});
