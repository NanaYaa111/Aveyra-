'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  getAuthProvider,
  isSupabaseConfigured,
  setAuthProvider,
  LocalStubAuthProvider,
} from './index';
import type { AuthError, AuthResult, AuthSession, OtpChallenge } from './types';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

/** The pending sign-in between requesting a code and verifying it. */
interface PendingChallenge extends OtpChallenge {
  email: string;
}

interface AuthContextValue {
  status: Status;
  session: AuthSession | null;
  /** The email awaiting a code, if a sign-in is mid-flight. */
  pending: PendingChallenge | null;
  /**
   * The delivered code, surfaced ONLY when there is no real email backend (the
   * local stub). Once Supabase is wired the code goes to the user's inbox and
   * this is always null.
   */
  devCode: string | null;
  requestOtp: (email: string) => Promise<AuthResult<OtpChallenge>>;
  verifyOtp: (code: string) => Promise<AuthResult<AuthSession>>;
  resend: () => Promise<AuthResult<OtpChallenge>>;
  changeEmail: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const NO_PENDING: AuthError = {
  code: 'unknown',
  message: 'Your sign-in expired. Please enter your email again.',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [pending, setPending] = useState<PendingChallenge | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const configured = useRef(false);

  // Configure the provider once (stub until Supabase creds exist), then resolve
  // any persisted session. The stub delivers the code to `setDevCode` so the app
  // is usable end-to-end without a real inbox.
  useEffect(() => {
    if (!configured.current) {
      configured.current = true;
      if (!isSupabaseConfigured()) {
        setAuthProvider(new LocalStubAuthProvider({ deliver: (_email, code) => setDevCode(code) }));
      }
    }
    let active = true;
    getAuthProvider()
      .getSession()
      .then((s) => {
        if (!active) return;
        setSession(s);
        setStatus(s ? 'authenticated' : 'unauthenticated');
      });
    return () => {
      active = false;
    };
  }, []);

  const requestOtp = useCallback(async (email: string) => {
    setDevCode(null);
    const result = await getAuthProvider().requestOtp(email);
    if (result.ok) {
      setPending({ email: email.trim().toLowerCase(), ...result.value });
    }
    return result;
  }, []);

  const resend = useCallback(async (): Promise<AuthResult<OtpChallenge>> => {
    if (!pending) return { ok: false, error: NO_PENDING };
    setDevCode(null);
    const result = await getAuthProvider().requestOtp(pending.email);
    if (result.ok) setPending({ email: pending.email, ...result.value });
    return result;
  }, [pending]);

  const verifyOtp = useCallback(
    async (code: string): Promise<AuthResult<AuthSession>> => {
      if (!pending) return { ok: false, error: NO_PENDING };
      const result = await getAuthProvider().verifyOtp(pending.requestId, code);
      if (result.ok) {
        setSession(result.value);
        setStatus('authenticated');
        setPending(null);
        setDevCode(null);
      }
      return result;
    },
    [pending],
  );

  const changeEmail = useCallback(() => {
    setPending(null);
    setDevCode(null);
  }, []);

  const signOut = useCallback(async () => {
    await getAuthProvider().signOut();
    setSession(null);
    setPending(null);
    setDevCode(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, session, pending, devCode, requestOtp, verifyOtp, resend, changeEmail, signOut }),
    [status, session, pending, devCode, requestOtp, verifyOtp, resend, changeEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Access the auth state + actions. Must be used within <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
