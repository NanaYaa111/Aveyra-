import { describe, it, expect, afterEach, vi } from 'vitest';
import { isPersisted, requestPersistentStorage, storageStatus } from '@/lib/platform/storage';

afterEach(() => vi.unstubAllGlobals());

/** Replace `navigator` for the duration of a test (undefined → no Storage API). */
function withStorage(storage: unknown) {
  vi.stubGlobal('navigator', storage === undefined ? {} : { storage });
}

describe('platform/storage', () => {
  it('reports not-persisted and null usage when the Storage API is unavailable', async () => {
    withStorage(undefined);
    expect(await isPersisted()).toBe(false);
    expect(await requestPersistentStorage()).toBe(false);
    expect(await storageStatus()).toEqual({ persisted: false, usageRatio: null });
  });

  it('reports persisted when the browser has granted it', async () => {
    withStorage({ persisted: async () => true });
    expect(await isPersisted()).toBe(true);
  });

  it('requests persistence only when it is not already granted', async () => {
    let persistCalls = 0;
    withStorage({
      persisted: async () => true,
      persist: async () => {
        persistCalls++;
        return true;
      },
    });
    expect(await requestPersistentStorage()).toBe(true);
    expect(persistCalls).toBe(0); // already granted → persist() not called

    withStorage({
      persisted: async () => false,
      persist: async () => {
        persistCalls++;
        return true;
      },
    });
    expect(await requestPersistentStorage()).toBe(true);
    expect(persistCalls).toBe(1);
  });

  it('computes a usage ratio from the storage estimate', async () => {
    withStorage({
      persisted: async () => true,
      estimate: async () => ({ usage: 25, quota: 100 }),
    });
    const status = await storageStatus();
    expect(status.persisted).toBe(true);
    expect(status.usageRatio).toBeCloseTo(0.25);
  });
});
