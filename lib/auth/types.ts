/**
 * Authentication foundation types (backend-agnostic) — Milestone 2.
 *
 * Aveyra sign-in is **passwordless email OTP** (open-questions Q15; Document 0 §4).
 * This module defines the boundary the rest of the app is written against; the
 * concrete backend is **Supabase** (GoTrue `signInWithOtp`/`verifyOtp`, Q25),
 * dropped in behind `AuthProvider` when the project is provisioned — no code above
 * this boundary changes when that happens (mirrors how M1 built sync behind
 * `SyncTransport`).
 *
 * The contract mirrors Volume 2 Part 4 Documents P & G (retained as the behavioural
 * spec our Supabase integration must satisfy): 6-digit code, 10-minute validity,
 * 30-day session, enumeration protection, per-email/per-request limits, no PII/OTP
 * in logs. NO passwords, NO social login (Document 0 §6.2).
 */

/** A signed-in account holder. Minimal by design (data minimization, §10). */
export interface AuthUser {
  /** Stable account id (Supabase user id once live; a uuid under the stub). */
  id: string;
  /** Email is the sole account identifier (Q15). */
  email: string;
  /** Account creation time (epoch ms). */
  createdAt: number;
}

/**
 * An authenticated session. Content-free beyond the identity + an opaque token;
 * never carries relationship content. Persisted per {@link session}.
 */
export interface AuthSession {
  user: AuthUser;
  /** Opaque bearer token (a Supabase access token once live). Never logged. */
  token: string;
  /** Session expiry (epoch ms). 30 days from issue (Document P/G). */
  expiresAt: number;
}

/** The pending state after an OTP has been requested but not yet verified. */
export interface OtpChallenge {
  /** Opaque handle tying a later verify to this request. Never the code itself. */
  requestId: string;
  /** Seconds until the code expires (600 = 10 minutes, Document P/G). */
  expiresInSeconds: number;
}

/**
 * Expected, non-exceptional failure reasons. Names match the Document P error
 * codes so UI copy and any future server agree on semantics. `network` covers a
 * transport/connectivity failure (web-first: surface calmly, let the user retry).
 */
export type AuthErrorCode =
  | 'invalid_email'
  | 'invalid_code'
  | 'code_expired'
  | 'too_many_requests'
  | 'network'
  | 'unknown';

/** A typed, user-safe error. `retryAfterSeconds` is set for `too_many_requests`. */
export interface AuthError {
  code: AuthErrorCode;
  /** Short, calm, non-technical message safe to show a user (Document 0 §11). */
  message: string;
  retryAfterSeconds?: number;
}

/** Discriminated result so expected failures don't throw. */
export type AuthResult<T> = { ok: true; value: T } | { ok: false; error: AuthError };

/**
 * The seam between the app and any authentication backend. Implementations move
 * only identity + opaque tokens; they never see or store relationship content.
 */
export interface AuthProvider {
  /** A short identifier for diagnostics (e.g. `'local-stub'`, `'supabase'`). */
  readonly name: string;

  /**
   * Request a one-time code for `email`. Resolves with a challenge regardless of
   * whether the email is registered (enumeration protection, Document P §5.2.1);
   * only rate-limit or transport failures produce an error.
   */
  requestOtp(email: string): Promise<AuthResult<OtpChallenge>>;

  /**
   * Verify a code against a prior challenge. On success returns a 30-day session.
   * After the max attempts the challenge is invalidated (`code_expired`).
   */
  verifyOtp(requestId: string, code: string): Promise<AuthResult<AuthSession>>;

  /** The current session if one is live and unexpired, else null. */
  getSession(): Promise<AuthSession | null>;

  /** Clear the session locally (and server-side where the backend supports it). */
  signOut(): Promise<void>;
}
