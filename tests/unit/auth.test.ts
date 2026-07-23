import { beforeEach, describe, expect, it } from 'vitest';
import { LocalStubAuthProvider } from '../../lib/auth/localStubProvider';
import {
  clearSession,
  getAuthProvider,
  isLive,
  resetAuthProvider,
  setAuthProvider,
} from '../../lib/auth';
import type { AuthProvider } from '../../lib/auth';

/** A controllable clock + captured "email" channel for deterministic tests. */
function makeProvider() {
  let now = 1_000_000;
  let lastCode = '';
  const provider = new LocalStubAuthProvider({
    now: () => now,
    // Fixed RNG keeps ids/codes deterministic and avoids global crypto.
    random: () => 0.123456,
    deliver: (_email, code) => {
      lastCode = code;
    },
  });
  return {
    provider,
    getCode: () => lastCode,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

beforeEach(() => {
  clearSession();
  resetAuthProvider();
});

describe('LocalStubAuthProvider — OTP flow', () => {
  it('issues a challenge and signs in with the delivered code', async () => {
    const { provider, getCode } = makeProvider();
    const req = await provider.requestOtp('Alex@Example.com');
    expect(req.ok).toBe(true);
    if (!req.ok) return;
    expect(req.value.expiresInSeconds).toBe(600);

    const verify = await provider.verifyOtp(req.value.requestId, getCode());
    expect(verify.ok).toBe(true);
    if (!verify.ok) return;
    // Email is normalised (trimmed + lowercased).
    expect(verify.value.user.email).toBe('alex@example.com');
    // 30-day session.
    expect(verify.value.expiresAt - 1_000_000).toBe(2_592_000_000);
  });

  it('rejects an invalid email before issuing a challenge', async () => {
    const { provider } = makeProvider();
    const req = await provider.requestOtp('not-an-email');
    expect(req.ok).toBe(false);
    if (req.ok) return;
    expect(req.error.code).toBe('invalid_email');
  });

  it('rejects an incorrect code, then invalidates after 3 attempts', async () => {
    const { provider, getCode } = makeProvider();
    const req = await provider.requestOtp('a@b.co');
    if (!req.ok) return;
    const id = req.value.requestId;
    const wrong = getCode() === '000000' ? '111111' : '000000';

    const a1 = await provider.verifyOtp(id, wrong);
    expect(a1.ok === false && a1.error.code).toBe('invalid_code');
    const a2 = await provider.verifyOtp(id, wrong);
    expect(a2.ok === false && a2.error.code).toBe('invalid_code');
    // 3rd wrong attempt invalidates the challenge.
    const a3 = await provider.verifyOtp(id, wrong);
    expect(a3.ok === false && a3.error.code).toBe('code_expired');
    // Even the right code no longer works.
    const after = await provider.verifyOtp(id, getCode());
    expect(after.ok).toBe(false);
  });

  it('expires the code after 10 minutes', async () => {
    const { provider, getCode, advance } = makeProvider();
    const req = await provider.requestOtp('a@b.co');
    if (!req.ok) return;
    advance(600_000 + 1);
    const verify = await provider.verifyOtp(req.value.requestId, getCode());
    expect(verify.ok === false && verify.error.code).toBe('code_expired');
  });

  it('does not reveal whether an email is registered (enumeration protection)', async () => {
    const { provider } = makeProvider();
    const a = await provider.requestOtp('known@x.io');
    const b = await provider.requestOtp('unknown@x.io');
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
  });

  it('throttles more than 3 requests per email per minute', async () => {
    const { provider } = makeProvider();
    for (let i = 0; i < 3; i++) {
      const r = await provider.requestOtp('spam@x.io');
      expect(r.ok).toBe(true);
    }
    const fourth = await provider.requestOtp('spam@x.io');
    expect(fourth.ok).toBe(false);
    if (fourth.ok) return;
    expect(fourth.error.code).toBe('too_many_requests');
    expect(fourth.error.retryAfterSeconds).toBeGreaterThan(0);
  });
});

describe('session lifecycle', () => {
  it('persists the session across getSession and clears on signOut', async () => {
    const { provider, getCode } = makeProvider();
    const req = await provider.requestOtp('a@b.co');
    if (!req.ok) return;
    await provider.verifyOtp(req.value.requestId, getCode());

    const session = await provider.getSession();
    expect(session).not.toBeNull();

    await provider.signOut();
    expect(await provider.getSession()).toBeNull();
  });

  it('isLive is false for an expired session', () => {
    const base = { user: { id: 'u', email: 'a@b.co', createdAt: 0 }, token: 't' };
    expect(isLive({ ...base, expiresAt: 100 }, 50)).toBe(true);
    expect(isLive({ ...base, expiresAt: 100 }, 200)).toBe(false);
    expect(isLive(null)).toBe(false);
  });
});

describe('provider registry', () => {
  it('defaults to the local stub and honours injection', () => {
    expect(getAuthProvider().name).toBe('local-stub');
    const fake: AuthProvider = {
      name: 'fake',
      requestOtp: async () => ({ ok: true, value: { requestId: 'x', expiresInSeconds: 1 } }),
      verifyOtp: async () => ({ ok: false, error: { code: 'unknown', message: 'no' } }),
      getSession: async () => null,
      signOut: async () => {},
    };
    setAuthProvider(fake);
    expect(getAuthProvider().name).toBe('fake');
  });
});
