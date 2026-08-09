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

export function OnboardingDetailsAdapter() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    setCreating(true);
    sessionStorage.setItem('onboarding_partner_name', partnerName);
    sessionStorage.setItem('onboarding_start_date', startDate);
    setTimeout(() => {
      setCreating(false);
      router.push('/onboarding/invite');
    }, 900);
  };

  return (
    <AuthShell onBack={() => router.push('/onboarding/choice')}>
      <StepDots total={3} current={3} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 0.75rem', lineHeight: 1.2 }}>A few gentle details</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-muted)', margin: '0 0 2rem', lineHeight: 1.6 }}>All optional — you can add these later in Settings.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AuthInput
          id="partner-name"
          label="Your partner&apos;s name"
          type="text"
          placeholder="e.g. Sam"
          value={partnerName}
          onChange={e => setPartnerName(e.target.value)}
        />
        <AuthInput
          id="start-date"
          label="When did your story begin?"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          hint="Used to mark anniversaries — never a countdown or a score."
        />
        <Btn onClick={handleCreate} disabled={creating} className="w-full justify-center">
          {creating ? 'Creating your space…' : 'Create our space'}
        </Btn>
      </div>
    </AuthShell>
  );
}
