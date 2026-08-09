'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Btn } from '@/components/ui/Primitives';

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

export function OnboardingInviteAdapter() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const inviteCode = 'A3K9M2';

  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(inviteCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopy());
    } catch {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const el = document.createElement('textarea');
    el.value = inviteCode;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
    document.body.removeChild(el);
  };

  const handleContinue = () => {
    router.push('/today');
  };

  return (
    <AuthShell>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 1.5rem', lineHeight: 1.2 }}>Invite your partner</h1>

      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)', borderRadius: 16, padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }} aria-hidden="true">
          <svg width="64" height="52" viewBox="0 0 64 52" fill="none">
            <circle cx="20" cy="32" r="14" fill="var(--color-tint)" stroke="var(--color-edge)" strokeWidth="1.5"/>
            <circle cx="44" cy="32" r="14" fill="var(--color-tint)" stroke="var(--color-edge)" strokeWidth="1.5"/>
            <path d="M28 26 Q32 18 36 26" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="32" cy="17" r="3" fill="var(--color-accent)" opacity="0.8"/>
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-muted)', margin: '0 0 0.75rem' }}>Share this code with your partner</p>
        <p data-testid="invite-code" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--color-ink)', margin: '0 0 1.25rem' }}>{inviteCode}</p>
        <Btn variant="secondary" onClick={handleCopy} className="w-full justify-center">
          {copied ? 'Copied ✓' : 'Copy invite link'}
        </Btn>
      </div>

      <p role="status" aria-live="polite" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'var(--color-muted)', lineHeight: 1.6, textAlign: 'center', margin: '0 0 1.5rem' }}>
        Once they join on their device, you&apos;ll be connected. You can start now — your partner will catch up when they join.
      </p>

      <Btn onClick={handleContinue} className="w-full justify-center">Continue to Aveyra</Btn>
    </AuthShell>
  );
}
