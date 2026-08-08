import { describe, it, expect } from 'vitest';
import {
  generateDeviceKeyPair,
  derivePurposeKey,
  exportPublicKey,
  importPublicKey,
  aesEncrypt,
  aesDecrypt,
} from '@/lib/encryption/primitives';
import { isEmailAllowed, isAllowlistActive } from '@/lib/auth/allowlist';

/** Stand-ins for two phones: each holds a private key the other never sees. */
async function twoDevices() {
  return { her: await generateDeviceKeyPair(), him: await generateDeviceKeyPair() };
}

describe('vault key agreement (E2EE)', () => {
  it('both devices independently derive the same key', async () => {
    const { her, him } = await twoDevices();

    // Only public halves are ever exchanged.
    const herPublic = await importPublicKey(await exportPublicKey(her.publicKey));
    const hisPublic = await importPublicKey(await exportPublicKey(him.publicKey));

    const herKey = await derivePurposeKey(her.privateKey, hisPublic, 'rel_1', 'aveyra-vault-v1');
    const hisKey = await derivePurposeKey(him.privateKey, herPublic, 'rel_1', 'aveyra-vault-v1');

    // Same key: what one encrypts, the other opens.
    const env = await aesEncrypt(herKey, new TextEncoder().encode('a photo'));
    const out = await aesDecrypt(hisKey, env);
    expect(new TextDecoder().decode(out)).toBe('a photo');
  });

  it('a third device cannot derive the key from public information alone', async () => {
    const { her, him } = await twoDevices();
    const stranger = await generateDeviceKeyPair();

    const hisPublic = await importPublicKey(await exportPublicKey(him.publicKey));
    const herKey = await derivePurposeKey(her.privateKey, hisPublic, 'rel_1', 'aveyra-vault-v1');
    // The stranger has both public keys — everything the server has — and their
    // own private key. That is not enough.
    const strangerKey = await derivePurposeKey(
      stranger.privateKey,
      hisPublic,
      'rel_1',
      'aveyra-vault-v1',
    );

    const env = await aesEncrypt(herKey, new TextEncoder().encode('private'));
    await expect(aesDecrypt(strangerKey, env)).rejects.toThrow();
  });

  it('keys are separated by relationship — the same pair gets a different key elsewhere', async () => {
    const { her, him } = await twoDevices();
    const hisPublic = await importPublicKey(await exportPublicKey(him.publicKey));

    const forOne = await derivePurposeKey(her.privateKey, hisPublic, 'rel_1', 'aveyra-vault-v1');
    const forTwo = await derivePurposeKey(her.privateKey, hisPublic, 'rel_2', 'aveyra-vault-v1');

    const env = await aesEncrypt(forOne, new TextEncoder().encode('x'));
    await expect(aesDecrypt(forTwo, env)).rejects.toThrow();
  });

  it('keys are separated by purpose — a vault key is useless for anything else', async () => {
    const { her, him } = await twoDevices();
    const hisPublic = await importPublicKey(await exportPublicKey(him.publicKey));

    const vault = await derivePurposeKey(her.privateKey, hisPublic, 'rel_1', 'aveyra-vault-v1');
    const other = await derivePurposeKey(her.privateKey, hisPublic, 'rel_1', 'something-else');

    const env = await aesEncrypt(vault, new TextEncoder().encode('x'));
    await expect(aesDecrypt(other, env)).rejects.toThrow();
  });

  it('the private key cannot be extracted, so it cannot be uploaded by mistake', async () => {
    const { her } = await twoDevices();
    expect(her.privateKey.extractable).toBe(false);
  });
});

describe('private-beta allowlist', () => {
  it('lets everyone in when unset — the public default', () => {
    expect(isAllowlistActive()).toBe(false);
    expect(isEmailAllowed('anyone@example.com')).toBe(true);
  });

  it('matches case-insensitively and ignores surrounding spaces', () => {
    process.env.NEXT_PUBLIC_ALLOWED_EMAILS = 'her@example.com, him@example.com';
    expect(isEmailAllowed('HER@Example.com')).toBe(true);
    expect(isEmailAllowed('  him@example.com  ')).toBe(true);
    expect(isEmailAllowed('stranger@example.com')).toBe(false);
    delete process.env.NEXT_PUBLIC_ALLOWED_EMAILS;
  });
});
