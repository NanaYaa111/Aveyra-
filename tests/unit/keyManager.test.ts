import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { KeyManager, WrongPassphraseError } from '@/lib/encryption/keyManager';
import { Cipher } from '@/lib/encryption/cipher';

/**
 * KeyManager reads through the module-singleton DB (getDB), so each test swaps
 * in a fresh named database via __setDB for full isolation.
 */
function freshManager() {
  __setDB(new AveyraDB('aveyra-keys-' + crypto.randomUUID()));
  return new KeyManager();
}

describe('KeyManager — no-passphrase mode', () => {
  let km: KeyManager;
  beforeEach(() => {
    km = freshManager();
  });

  it('initialises, is never locked, and yields a usable content key', async () => {
    expect(await km.isInitialised()).toBe(false);
    await km.initialise();
    expect(await km.isInitialised()).toBe(true);
    expect(await km.hasPassphrase()).toBe(false);
    expect(await km.isLocked()).toBe(false);
    expect(await km.getDataKey()).not.toBeNull();
  });

  it('recovers the content key from storage on a fresh manager (new session)', async () => {
    await km.initialise();
    // Simulate a new app session: a brand-new manager over the same DB.
    const km2 = new KeyManager();
    expect(await km2.getDataKey()).not.toBeNull();
    expect(await km2.isLocked()).toBe(false);
  });

  it('exposes a device public key for future pairing', async () => {
    await km.initialise();
    const pub = await km.devicePublicKey();
    expect(typeof pub).toBe('string');
    expect(pub!.length).toBeGreaterThan(0);
  });

  it('initialise is idempotent (a second call does not replace the vault)', async () => {
    await km.initialise();
    const pub1 = await km.devicePublicKey();
    await km.initialise();
    const pub2 = await km.devicePublicKey();
    expect(pub2).toBe(pub1);
  });
});

describe('KeyManager — passphrase mode', () => {
  let km: KeyManager;
  beforeEach(() => {
    km = freshManager();
  });

  it('locks after init on a new session and unlocks with the right passphrase', async () => {
    await km.initialise('open sesame please');
    expect(await km.hasPassphrase()).toBe(true);

    // New session: the in-memory key is gone, so the vault reads as locked.
    const km2 = new KeyManager();
    expect(await km2.isLocked()).toBe(true);
    expect(await km2.getDataKey()).toBeNull();

    await km2.unlock('open sesame please');
    expect(await km2.isLocked()).toBe(false);
    expect(await km2.getDataKey()).not.toBeNull();
  });

  it('rejects a wrong passphrase with WrongPassphraseError', async () => {
    await km.initialise('correct passphrase');
    const km2 = new KeyManager();
    await expect(km2.unlock('WRONG passphrase')).rejects.toBeInstanceOf(WrongPassphraseError);
    expect(await km2.isLocked()).toBe(true);
  });

  it('lock() drops the in-memory key', async () => {
    await km.initialise('a good passphrase');
    expect(await km.getDataKey()).not.toBeNull();
    km.lock();
    expect(await km.isLocked()).toBe(true);
    expect(await km.getDataKey()).toBeNull();
  });

  it('throws when there is no passphrase vault to unlock', async () => {
    await km.initialise(); // no passphrase
    await expect(km.unlock('anything')).rejects.toThrow(/no passphrase/i);
  });
});

describe('Cipher — field encryption', () => {
  let km: KeyManager;
  beforeEach(() => {
    km = freshManager();
  });

  it('round-trips a string field through the active key', async () => {
    await km.initialise();
    const cipher = new Cipher(km);
    expect(await cipher.isReady()).toBe(true);
    const token = await cipher.encrypt('a private thought');
    expect(cipher.isEncrypted(token)).toBe(true);
    expect(token).not.toContain('a private thought');
    expect(await cipher.decrypt(token)).toBe('a private thought');
  });

  it('passes legacy plaintext through decrypt unchanged', async () => {
    await km.initialise();
    const cipher = new Cipher(km);
    expect(await cipher.decrypt('not-an-envelope')).toBe('not-an-envelope');
  });

  it('refuses to encrypt while locked', async () => {
    await km.initialise('locked up');
    const km2 = new KeyManager();
    const cipher = new Cipher(km2);
    expect(await cipher.isReady()).toBe(false);
    await expect(cipher.encrypt('secret')).rejects.toThrow(/no content key/i);
  });

  it('encrypts unicode content losslessly', async () => {
    await km.initialise();
    const cipher = new Cipher(km);
    const value = 'café ☕ — 我们的故事 🌤️';
    expect(await cipher.decrypt(await cipher.encrypt(value))).toBe(value);
  });
});
