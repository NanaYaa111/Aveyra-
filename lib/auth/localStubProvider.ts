import type {
  AuthErrorCode,
  AuthProvider,
  AuthResult,
  AuthSession,
  OtpChallenge,
} from './types';
import { clearSession, loadSession, saveSession } from './session';

const OTP_TTL_SECONDS = 600; // 10 minutes (Document P/G)
const SESSION_TTL_MS = 2_592_000_000; // 30 days (Document P/G)
const MAX_VERIFY_ATTEMPTS = 3; // then the challenge is invalidated (Document P/G)
const REQUESTS_PER_EMAIL_WINDOW = 3; // Document P/G: 3 requests/min per email
const REQUEST_WINDOW_MS = 60_000;

interface PendingChallenge {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

/** Options for the stub. `deliver` models the email side-channel; `now`/`random` make it testable. */
export interface LocalStubOptions {
  /**
   * Receives the code the way an email would. Defaults to a no-op so the code is
   * never logged (Document H §9.2). Dev UIs can pass a handler that surfaces it;
   * tests capture it here.
   */
  deliver?: (email: string, code: string) => void;
  now?: () => number;
  /** Injectable RNG for deterministic tests. Returns [0,1). */
  random?: () => number;
}

/**
 * The default auth provider for Milestone 2 until the Supabase project is
 * provisioned — a faithful, in-memory OTP implementation so the whole app (auth
 * screens, session, route guards) is built and tested against the real
 * {@link AuthProvider} contract today, with the Supabase adapter dropped in
 * behind the same interface (Q25; mirrors M1's `LocalStubTransport`).
 *
 * It honours the Document P/G behavioural contract: 6-digit code, 10-minute
 * validity, 30-day session, enumeration protection (always returns a challenge),
 * per-email request throttling, and challenge invalidation after too many
 * attempts. It never logs the code (delivery is an injected side-channel).
 */
export class LocalStubAuthProvider implements AuthProvider {
  readonly name = 'local-stub';

  private readonly deliver: (email: string, code: string) => void;
  private readonly now: () => number;
  private readonly random: () => number;

  private readonly challenges = new Map<string, PendingChallenge>();
  /** Recent request timestamps per email, for throttling. */
  private readonly recentRequests = new Map<string, number[]>();

  constructor(opts: LocalStubOptions = {}) {
    this.deliver = opts.deliver ?? (() => {});
    this.now = opts.now ?? (() => Date.now());
    this.random = opts.random ?? Math.random;
  }

  async requestOtp(email: string): Promise<AuthResult<OtpChallenge>> {
    const normalized = email.trim().toLowerCase();
    if (!isEmail(normalized)) {
      return fail('invalid_email', 'Please enter a valid email address.');
    }

    const now = this.now();
    const throttled = this.throttle(normalized, now);
    if (throttled) return throttled;

    const requestId = this.randomId();
    const code = this.sixDigitCode();
    this.challenges.set(requestId, {
      email: normalized,
      code,
      expiresAt: now + OTP_TTL_SECONDS * 1000,
      attempts: 0,
    });
    // Hand the code to the side-channel (an email in production). Never logged.
    this.deliver(normalized, code);

    return { ok: true, value: { requestId, expiresInSeconds: OTP_TTL_SECONDS } };
  }

  async verifyOtp(requestId: string, code: string): Promise<AuthResult<AuthSession>> {
    const challenge = this.challenges.get(requestId);
    const now = this.now();
    if (!challenge || challenge.expiresAt <= now) {
      this.challenges.delete(requestId);
      return fail('code_expired', 'That code has expired. Request a new one.');
    }

    challenge.attempts += 1;
    if (challenge.code !== code.trim()) {
      if (challenge.attempts >= MAX_VERIFY_ATTEMPTS) {
        this.challenges.delete(requestId);
        return fail('code_expired', 'Too many attempts. Request a new code.');
      }
      return fail('invalid_code', 'That code is incorrect. Try again.');
    }

    // Success: mint a 30-day session and retire the challenge.
    this.challenges.delete(requestId);
    const session: AuthSession = {
      user: {
        id: this.randomId(),
        email: challenge.email,
        createdAt: now,
      },
      token: this.randomId() + this.randomId(),
      expiresAt: now + SESSION_TTL_MS,
    };
    saveSession(session);
    return { ok: true, value: session };
  }

  async getSession(): Promise<AuthSession | null> {
    return loadSession(this.now());
  }

  async signOut(): Promise<void> {
    clearSession();
  }

  // --- internals -----------------------------------------------------------

  private throttle(email: string, now: number): AuthResult<never> | null {
    const stamps = (this.recentRequests.get(email) ?? []).filter(
      (t) => now - t < REQUEST_WINDOW_MS,
    );
    if (stamps.length >= REQUESTS_PER_EMAIL_WINDOW) {
      const oldest = stamps[0] ?? now;
      const retryAfter = Math.ceil((REQUEST_WINDOW_MS - (now - oldest)) / 1000);
      return {
        ok: false,
        error: {
          code: 'too_many_requests',
          message: 'Too many requests. Please wait a moment and try again.',
          retryAfterSeconds: Math.max(1, retryAfter),
        },
      };
    }
    stamps.push(now);
    this.recentRequests.set(email, stamps);
    return null;
  }

  private sixDigitCode(): string {
    return String(Math.floor(this.random() * 1_000_000)).padStart(6, '0');
  }

  private randomId(): string {
    // Prefer a real UUID when available; fall back to the injected RNG so tests
    // stay deterministic without touching global crypto.
    if (this.random === Math.random && typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.floor(this.random() * 1e16).toString(36) + this.now().toString(36);
  }
}

function isEmail(value: string): boolean {
  // Deliberately permissive: reject only obvious non-emails. Real validity is a
  // deliverability question the OTP flow answers by whether the code arrives.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function fail(code: AuthErrorCode, message: string): AuthResult<never> {
  return { ok: false, error: { code, message } };
}
