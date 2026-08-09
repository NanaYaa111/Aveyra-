'use client';

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

export function OnboardingChoiceAdapter() {
  const router = useRouter();

  return (
    <AuthShell onBack={() => router.push('/onboarding/name')}>
      <StepDots total={3} current={2} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 0.75rem', lineHeight: 1.2 }}>Are you starting, or joining?</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-muted)', margin: '0 0 2rem', lineHeight: 1.6 }}>
        One of you creates the shared space; the other joins with an invite.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Btn onClick={() => { sessionStorage.setItem('onboarding_mode', 'create'); router.push('/onboarding/details'); }} className="w-full justify-center">Start our space</Btn>
        <Btn variant="secondary" onClick={() => { sessionStorage.setItem('onboarding_mode', 'join'); router.push('/onboarding/join'); }} className="w-full justify-center">Join my partner</Btn>
      </div>
    </AuthShell>
  );
}
