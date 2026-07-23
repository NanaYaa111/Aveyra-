/**
 * Auth module entry point (Milestone 2).
 *
 * The app talks to `getAuthProvider()`; it never news up a concrete backend. The
 * default is the {@link LocalStubAuthProvider} so every auth surface is built and
 * tested against the real contract now. When the **Supabase** project is
 * provisioned (Q25 — author-owned; env keys required), a `SupabaseAuthProvider`
 * implementing the same {@link AuthProvider} interface is injected via
 * {@link setAuthProvider} at app bootstrap — nothing above this module changes.
 */
import { LocalStubAuthProvider } from './localStubProvider';
import type { AuthProvider } from './types';

export type {
  AuthProvider,
  AuthUser,
  AuthSession,
  OtpChallenge,
  AuthError,
  AuthErrorCode,
  AuthResult,
} from './types';
export { LocalStubAuthProvider } from './localStubProvider';
export { isLive, loadSession, saveSession, clearSession } from './session';

let provider: AuthProvider | null = null;

/**
 * Whether Supabase credentials are present in the environment. The concrete
 * `SupabaseAuthProvider` is wired in the provisioning increment; until then this
 * gates nothing but documents the seam and lets bootstrap decide.
 */
export function isSupabaseConfigured(): boolean {
  return (
    typeof process !== 'undefined' &&
    !!process.env?.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** The active auth provider (defaults to the local stub until one is injected). */
export function getAuthProvider(): AuthProvider {
  if (!provider) provider = new LocalStubAuthProvider();
  return provider;
}

/** Inject a provider (the Supabase adapter at bootstrap, or a fake in tests). */
export function setAuthProvider(next: AuthProvider): void {
  provider = next;
}

/** Reset to the default. Test-only convenience. */
export function resetAuthProvider(): void {
  provider = null;
}
