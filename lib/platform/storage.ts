/**
 * Durable storage (Constitution Part 3 §4; research §5.1). We ask the browser
 * not to evict our data and report the result honestly — persistence is never
 * a guarantee, so the app still encourages regular export.
 */

export interface StorageStatus {
  persisted: boolean;
  /** Fraction of quota used (0–1), when the browser reports it. */
  usageRatio: number | null;
}

export async function isPersisted(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persisted) return false;
  return navigator.storage.persisted();
}

/** Request persistent storage. Returns whether it is now granted. */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}

export async function storageStatus(): Promise<StorageStatus> {
  const persisted = await isPersisted();
  let usageRatio: number | null = null;
  if (navigator.storage?.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    if (usage != null && quota) usageRatio = usage / quota;
  }
  return { persisted, usageRatio };
}
