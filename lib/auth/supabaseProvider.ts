import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase/client';
import type {
  AuthError,
  AuthProvider,
  AuthResult,
  AuthSession,
  OtpChallenge,
} from './types';

const OTP_TTL_SECONDS = 600; // configure Supabase Auth "OTP expiry" to 600s (setup guide)

/**
 * Real authentication backed by Supabase Auth / GoTrue (Q25). Implements the same
 * {@link AuthProvider} contract as the local stub, so every auth screen works
 * unchanged. Passwordless email OTP: `signInWithOtp` sends a code (enumeration-safe
 * — always "succeeds"); `verifyOtp` exchanges the code for a session. Supabase
 * persists and refreshes the session itself; `getSession` maps it to our shape.
 */
export class SupabaseAuthProvider implements AuthProvider {
  readonly name = 'supabase';

  /** Maps our opaque requestId → the email it was issued for (verify needs it). */
  private readonly pending = new Map<string, string>();

  private client(): SupabaseClient {
    const c = getSupabaseClient();
    if (!c) throw new Error('Supabase is not configured.');
    return c;
  }

  async requestOtp(email: string): Promise<AuthResult<OtpChallenge>> {
    const normalized = email.trim().toLowerCase();
    try {
      const { error } = await this.client().auth.signInWithOtp({
        email: normalized,
        options: { shouldCreateUser: true },
      });
      if (error) return { ok: false, error: mapError(error) };
      const requestId = crypto.randomUUID();
      this.pending.set(requestId, normalized);
      return { ok: true, value: { requestId, expiresInSeconds: OTP_TTL_SECONDS } };
    } catch {
      return { ok: false, error: networkError() };
    }
  }

  async verifyOtp(requestId: string, code: string): Promise<AuthResult<AuthSession>> {
    const email = this.pending.get(requestId);
    if (!email) {
      return {
        ok: false,
        error: { code: 'code_expired', message: 'That sign-in expired. Request a new code.' },
      };
    }
    try {
      const { data, error } = await this.client().auth.verifyOtp({
        email,
        token: code.trim(),
        type: 'email',
      });
      if (error || !data.session) {
        return { ok: false, error: mapError(error) };
      }
      this.pending.delete(requestId);
      return { ok: true, value: toSession(data.session) };
    } catch {
      return { ok: false, error: networkError() };
    }
  }

  async getSession(): Promise<AuthSession | null> {
    const c = getSupabaseClient();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    return data.session ? toSession(data.session) : null;
  }

  async signOut(): Promise<void> {
    await getSupabaseClient()?.auth.signOut();
  }
}

function toSession(session: Session): AuthSession {
  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
      createdAt: session.user.created_at ? Date.parse(session.user.created_at) : Date.now(),
    },
    token: session.access_token,
    expiresAt: (session.expires_at ?? 0) * 1000,
  };
}

function mapError(error: { message?: string; status?: number } | null): AuthError {
  const message = error?.message ?? '';
  if (error?.status === 429 || /rate limit/i.test(message)) {
    return { code: 'too_many_requests', message: 'Too many requests. Please wait a moment and try again.' };
  }
  if (/expired/i.test(message)) {
    return { code: 'code_expired', message: 'That code has expired. Request a new one.' };
  }
  if (/invalid/i.test(message)) {
    return { code: 'invalid_code', message: 'That code is incorrect. Try again.' };
  }
  return { code: 'unknown', message: 'Something went wrong. Please try again.' };
}

function networkError(): AuthError {
  return { code: 'network', message: 'Couldn’t reach the server. Check your connection and try again.' };
}
