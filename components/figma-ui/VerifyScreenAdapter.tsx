'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Btn } from './primitives';
import { useAuth } from '@/lib/auth/context';

function AuthShell({ children, onBack, backLabel }: { children: React.ReactNode; onBack?: () => void; backLabel?: string }) {
  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: 'var(--color-ground)' }}>
      <header className="flex items-center px-6 py-6" style={{ position: 'relative' }}>
        {onBack && (
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: 0 }}>
            ← {backLabel ?? 'Back'}
          </button>
        )}
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--color-accent)' }}>aveyra</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div style={{ width: '100%', maxWidth: 400 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const pad = (value + '      ').slice(0, 6);

  const handle = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = pad.split('');
    arr[i] = ch || ' ';
    onChange(arr.join('').trimEnd());
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pad[i]?.trim() && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={pad[i]?.trim() ?? ''}
          onChange={e => handle(i, e)}
          onKeyDown={e => handleKey(i, e)}
          aria-label={`Digit ${i + 1} of 6`}
          style={{ width: 44, height: 52, textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 500, border: '1.5px solid var(--color-edge)', borderRadius: 10, backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)', outline: 'none' }}
        />
      ))}
    </div>
  );
}

export function VerifyScreenAdapter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp } = useAuth();
  const email = searchParams?.get('email') || '';

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const complete = code.replace(/\s/g, '').length === 6;

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!complete) return;
    setVerifying(true);
    setError('');
    const result = await verifyOtp(code);
    setVerifying(false);
    if (result.ok) {
      router.push('/onboarding');
    } else {
      setError(result.error.message);
    }
  };

  const handleResend = () => {
    setResendIn(30);
    setError('');
  };

  return (
    <AuthShell onBack={() => router.push('/sign-in')} backLabel="Use a different email">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 0.5rem', lineHeight: 1.2 }}>Confirm your email</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-muted)', margin: '0 0 2rem', lineHeight: 1.6 }}>
        A 6-digit code was sent to <strong style={{ color: 'var(--color-ink)' }}>{email || 'your email'}</strong>
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <OTPInput value={code} onChange={setCode} />
        {error && <p role="alert" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-error)', textAlign: 'center', margin: 0 }}>{error}</p>}
        <Btn type="submit" disabled={!complete || verifying} className="w-full justify-center">
          {verifying ? 'Verifying…' : 'Verify code'}
        </Btn>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-muted)', margin: '0 0 0.5rem' }}>Didn&apos;t get the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendIn > 0}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: resendIn > 0 ? 'var(--color-muted)' : 'var(--color-accent)', background: 'none', border: 'none', cursor: resendIn > 0 ? 'default' : 'pointer', textDecoration: resendIn > 0 ? 'none' : 'underline' }}>
            {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
