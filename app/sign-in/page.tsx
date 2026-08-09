'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Logo } from '@/components/ui';
import { useAuth } from '@/lib/auth/context';


export default function SignInPage() {
  const router = useRouter();
  const { requestOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const result = await requestOtp(email);
    setSubmitting(false);
    if (result.ok) {
      router.push('/verify');
    } else {
      setError(result.error.message);
    }
  }

  return (
    <section aria-labelledby="signin-heading" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo />
        <h1 id="signin-heading" className="text-display">
          Welcome to Aveyra Flow
        </h1>
        <p className="text-text-soft">
          A private, calm home for the two of you. Enter your email to get a sign-in code.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="you@example.com"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          required
          error={error ?? undefined}
        />
        <Button type="submit" fullWidth disabled={submitting || email.trim() === ''}>
          {submitting ? 'Sending…' : 'Send my code'}
        </Button>
      </form>

      <p className="text-label text-text-mute text-center">
        By continuing you confirm you&apos;re 18 or older. Your data is private to your relationship
        encrypted at rest and never sold.
      </p>
    </section>
  );
}
