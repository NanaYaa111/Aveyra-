// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { getDeviceId, ensureSelfUser, getSelfUser } from '@/lib/identity';

// getDeviceId needs localStorage, so this file runs in jsdom (see docblock).
beforeEach(() => {
  __setDB(new AveyraDB('aveyra-identity-' + crypto.randomUUID()));
  localStorage.clear();
});
afterEach(() => {
  localStorage.clear();
  __setDB(new AveyraDB('aveyra-identity-reset-' + crypto.randomUUID()));
});

describe('identity', () => {
  it('generates and persists a stable device id', () => {
    const a = getDeviceId();
    const b = getDeviceId();
    expect(a).toBe(b); // stable across calls
    expect(a).not.toBe('server');
    expect(localStorage.getItem('aveyra-device-id')).toBe(a);
  });

  it('creates the self user once and does not recreate it', async () => {
    const u1 = await ensureSelfUser('Ama');
    expect(u1.is_self).toBe(true);
    expect(u1.display_name).toBe('Ama');
    expect(u1.device_id).toBeTruthy();

    const u2 = await ensureSelfUser('A different name');
    expect(u2.id).toBe(u1.id); // same record, not a second self
    expect(u2.display_name).toBe('Ama'); // existing self is returned unchanged
  });

  it('getSelfUser returns undefined until a self user exists, then that user', async () => {
    expect(await getSelfUser()).toBeUndefined();
    const u = await ensureSelfUser('Kofi');
    expect((await getSelfUser())?.id).toBe(u.id);
  });
});
