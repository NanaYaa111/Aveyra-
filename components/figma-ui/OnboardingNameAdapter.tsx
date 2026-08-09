'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Btn } from './primitives';

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

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div role="img" aria-label={`Step ${current} of ${total}`} style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: '2rem' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: i + 1 <= current ? 'var(--color-accent)' : 'transparent', border: '1.5px solid var(--color-accent)', transition: 'background-color 150ms' }} />
      ))}
    </div>
  );
}

function AuthInput({ id, label, hint, error, ...props }: { id: string; label: string; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink)' }}>{label}</label>
      <input id={id}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', padding: '10px 14px', border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-edge)'}`, borderRadius: 10, backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)', outline: 'none' }}
        {...props} />
      {hint && !error && <p id={`${id}-hint`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0 }}>{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-error)', margin: 0 }}>{error}</p>}
    </div>
  );
}

export function OnboardingNameAdapter() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem('onboarding_name', name);
      router.push('/onboarding/choice');
    }
  };

  return (
    <AuthShell>
      <StepDots total={3} current={1} />
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }} aria-hidden="true">
        <svg width="120" height="72" viewBox="0 0 120 72" fill="none">
          <circle cx="38" cy="44" r="18" fill="var(--color-tint)" stroke="var(--color-edge)" strokeWidth="1.5"/>
          <circle cx="82" cy="44" r="18" fill="var(--color-tint)" stroke="var(--color-edge)" strokeWidth="1.5"/>
          <path d="M54 38 Q60 26 66 38" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="60" cy="25" r="3.5" fill="var(--color-accent)" opacity="0.75"/>
        </svg>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
        Let&apos;s set up your space
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-muted)', margin: '0 0 2rem', lineHeight: 1.6 }}>
        Aveyra is a private home for the two of you. First — what should you be called here?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AuthInput
          id="your-name"
          label="Your name"
          type="text"
          placeholder="e.g. Alex"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <Btn disabled={!name.trim()} onClick={handleContinue} className="w-full justify-center">Continue</Btn>
      </div>
    </AuthShell>
  );
}
