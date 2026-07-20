import { getDB } from '../database/db';
import type { User } from '../database/types';

/**
 * Local identity (amendment A3 — minimal identity for pairing). A stable device
 * id distinguishes this device from a partner's; the self User carries only a
 * display name. No accounts, no personal data beyond what pairing needs.
 */
const DEVICE_ID_KEY = 'aveyra-device-id';

/** A stable per-device identifier, generated once and persisted locally. */
export function getDeviceId(): string {
  if (typeof localStorage === 'undefined') return 'server';
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/** Create the self user for this device if one does not already exist. */
export async function ensureSelfUser(displayName: string): Promise<User> {
  const db = getDB();
  const existing = await db.users.filter((u) => u.is_self).first();
  if (existing) return existing;
  const user: User = {
    id: crypto.randomUUID(),
    display_name: displayName,
    device_id: getDeviceId(),
    created_at: Date.now(),
    is_self: true,
  };
  await db.users.add(user);
  return user;
}

export async function getSelfUser(): Promise<User | undefined> {
  return getDB().users.filter((u) => u.is_self).first();
}
