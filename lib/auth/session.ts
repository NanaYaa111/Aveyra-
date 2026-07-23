import type { AuthSession } from './types';

/**
 * Session persistence for Milestone 2. Hybrid memory + localStorage per Volume 2
 * Part 4 Document G §7.1: an in-memory copy is the fast path; localStorage lets a
 * session survive a reload. Content-free — only identity + an opaque token, never
 * relationship data.
 *
 * SSR-safe: every localStorage touch is guarded, so importing this on the server
 * (static export build) is inert.
 */
const STORAGE_KEY = 'aveyra-auth-session';

let cached: AuthSession | null = null;

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

/** True when the session exists and has not passed its expiry. */
export function isLive(session: AuthSession | null, now: number = Date.now()): session is AuthSession {
  return session != null && session.expiresAt > now;
}

/** Load the persisted session (memory first, then storage). Expired → cleared. */
export function loadSession(now: number = Date.now()): AuthSession | null {
  if (isLive(cached, now)) return cached;
  cached = null;
  if (!hasStorage()) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!isLive(parsed, now)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    cached = parsed;
    return parsed;
  } catch {
    // Corrupt entry: drop it rather than trust it.
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/** Persist a session to memory + storage. */
export function saveSession(session: AuthSession): void {
  cached = session;
  if (hasStorage()) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

/** Clear the session from memory + storage (idempotent). */
export function clearSession(): void {
  cached = null;
  if (hasStorage()) localStorage.removeItem(STORAGE_KEY);
}
