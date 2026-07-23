'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { useAuth } from '@/lib/auth/context';

/**
 * Verify — step two of passwordless email OTP. A single one-time-code field
 * (`autocomplete="one-time-code"`) so browser/OS autofill and paste both work,
 * which is more robust and screen-reader-friendly than split digit boxes.
 * When there is no email backend yet (the local stub), the delivered code is
 * shown inline so sign-in is testable end-to-end; that notice disappears the
 * moment Supabase is wired.
 */
export default function VerifyPage() {
  const router = useRouter();
  const { pending, devCode, verifyOtp, resend, changeEmail } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'resending'>('idle');
  const [notice, setNotice] = useState<string | null>(null);

  // No sign-in in flight (e.g. a refresh landed here directly): start over.
  useEffect(() => {
    if (!pending) router.replace('/sign-in');
  }, [pending, router]);

  if (!pending) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== 'idle') return;
    setError(null);
    setStatus('verifying');
    const result = await verifyOtp(code);
    if (result.ok) {
      router.replace('/today');
      return;
    }
    setStatus('idle');
    setError(result.error.message);
  }

  async function handleResend() {
    if (status !== 'idle') return;
    setError(null);
    setNotice(null);
    setStatus('resending');
    const result = await resend();
    setStatus('idle');
    if (result.ok) {
      setCode('');
      setNotice('A new code is on its way.');
    } else {
      setError(result.error.message);
    }
  }

  return (
    <section aria-labelledby="verify-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 id="verify-heading" className="text-display">
          Enter your code
        </h1>
        <p className="text-text-soft">
          We sent a 6-digit code to <span className="text-text font-medium">{pending.email}</span>.
          It expires in 10 minutes.
        </p>
      </div>

      {devCode && (
        <Card className="text-center">
          <p className="text-label text-text-mute">
            No email backend yet — your code is
          </p>
          <p
            className="text-heading tracking-[0.3em] mt-1"
            aria-label={`Your code is ${devCode}`}
            data-testid="dev-otp"
          >
            {devCode}
          </p>
        </Card>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
            if (error) setError(null);
          }}
          placeholder="123456"
          autoFocus
          required
          className="text-center text-heading tracking-[0.4em]"
          error={error ?? undefined}
        />
        <Button type="submit" fullWidth disabled={status !== 'idle' || code.length < 6}>
          {status === 'verifying' ? 'Verifying…' : 'Verify and continue'}
        </Button>
      </form>

      {notice && (
        <p className="text-label text-text-soft text-center" role="status">
          {notice}
        </p>
      )}

      <div className="flex flex-col items-center gap-1">
        <Button variant="quiet" size="sm" onClick={handleResend} disabled={status !== 'idle'}>
          {status === 'resending' ? 'Sending…' : "Didn't get it? Resend"}
        </Button>
        <Button
          variant="quiet"
          size="sm"
          onClick={() => {
            changeEmail();
            router.push('/sign-in');
          }}
        >
          Use a different email
        </Button>
      </div>
    </section>
  );
}
