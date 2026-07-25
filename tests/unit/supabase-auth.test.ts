import { describe, it, expect, vi, beforeEach } from 'vitest';

// A controllable fake Supabase auth client.
const auth = {
  signInWithOtp: vi.fn(),
  verifyOtp: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
};
vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => ({ auth }),
  isSupabaseConfigured: () => true,
}));

import { SupabaseAuthProvider } from '@/lib/auth/supabaseProvider';

function session(overrides: Record<string, unknown> = {}) {
  return {
    access_token: 'tok_abc',
    expires_at: 1_800_000_000,
    user: { id: 'user_1', email: 'alex@example.com', created_at: '2026-01-01T00:00:00Z' },
    ...overrides,
  };
}

beforeEach(() => {
  Object.values(auth).forEach((fn) => fn.mockReset());
});

describe('SupabaseAuthProvider', () => {
  it('requests an OTP (enumeration-safe) and returns a challenge', async () => {
    auth.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    const p = new SupabaseAuthProvider();
    const res = await p.requestOtp('Alex@Example.com ');
    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'alex@example.com',
      options: { shouldCreateUser: true },
    });
    expect(res.ok).toBe(true);
  });

  it('maps a rate-limit error to too_many_requests', async () => {
    auth.signInWithOtp.mockResolvedValue({ data: {}, error: { message: 'rate limit', status: 429 } });
    const res = await new SupabaseAuthProvider().requestOtp('a@b.co');
    expect(res.ok === false && res.error.code).toBe('too_many_requests');
  });

  it('verifies a code and maps the session', async () => {
    auth.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    auth.verifyOtp.mockResolvedValue({ data: { session: session() }, error: null });
    const p = new SupabaseAuthProvider();
    const req = await p.requestOtp('alex@example.com');
    if (!req.ok) throw new Error('request failed');

    const res = await p.verifyOtp(req.value.requestId, '123456');
    expect(auth.verifyOtp).toHaveBeenCalledWith({
      email: 'alex@example.com',
      token: '123456',
      type: 'email',
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.value.token).toBe('tok_abc');
    expect(res.value.user.email).toBe('alex@example.com');
    expect(res.value.expiresAt).toBe(1_800_000_000 * 1000);
  });

  it('rejects verify without a prior request', async () => {
    const res = await new SupabaseAuthProvider().verifyOtp('missing', '123456');
    expect(res.ok === false && res.error.code).toBe('code_expired');
  });

  it('maps an invalid code error', async () => {
    auth.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    auth.verifyOtp.mockResolvedValue({
      data: { session: null },
      error: { message: 'Token has expired or is invalid', status: 403 },
    });
    const p = new SupabaseAuthProvider();
    const req = await p.requestOtp('a@b.co');
    if (!req.ok) return;
    const res = await p.verifyOtp(req.value.requestId, '000000');
    // "expired or is invalid" → we surface expiry first; either is a safe message.
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(['invalid_code', 'code_expired']).toContain(res.error.code);
  });

  it('maps getSession, and returns null when signed out', async () => {
    auth.getSession.mockResolvedValueOnce({ data: { session: session() } });
    const live = await new SupabaseAuthProvider().getSession();
    expect(live?.token).toBe('tok_abc');

    auth.getSession.mockResolvedValueOnce({ data: { session: null } });
    expect(await new SupabaseAuthProvider().getSession()).toBeNull();
  });

  it('signs out via the client', async () => {
    auth.signOut.mockResolvedValue({ error: null });
    await new SupabaseAuthProvider().signOut();
    expect(auth.signOut).toHaveBeenCalled();
  });
});
