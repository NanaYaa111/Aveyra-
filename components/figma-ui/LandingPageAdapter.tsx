'use client';

import { useRouter } from 'next/navigation';
import { Btn } from './primitives';

export function LandingPageAdapter() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: 'var(--color-ground)' }}>
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <span aria-label="Aveyra" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--color-accent)' }}>aveyra</span>
        <button onClick={handleSignIn}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', backgroundColor: 'transparent', color: 'var(--color-muted)', border: '1px solid var(--color-edge)', padding: '0.5rem 1rem', borderRadius: '9999px', minHeight: 36, cursor: 'pointer', transition: 'all 150ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-edge)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)' }}>
          Sign in
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ paddingBottom: '10vh' }}>
        {/* Hero illustration — two paths converging at a point of light */}
        <div className="mb-10" aria-hidden="true">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
            <path d="M14 112 C32 84 54 50 80 30" stroke="var(--color-edge)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M146 112 C128 84 106 50 80 30" stroke="var(--color-edge)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="80" cy="30" r="18" fill="var(--color-accent)" opacity="0.06"/>
            <circle cx="80" cy="30" r="10" fill="var(--color-accent)" opacity="0.14"/>
            <circle cx="80" cy="30" r="5" fill="var(--color-accent)" opacity="0.9"/>
            <circle cx="14" cy="112" r="3" fill="var(--color-muted)" opacity="0.25"/>
            <circle cx="146" cy="112" r="3" fill="var(--color-muted)" opacity="0.25"/>
          </svg>
        </div>

        <h1 id="landing-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, lineHeight: 1.25, color: 'var(--color-ink)', margin: '0 0 1.25rem', maxWidth: '20ch' }}>
          Discovering, remembering, and growing together
        </h1>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-muted)', margin: '0 0 2.5rem', maxWidth: '40ch' }}>
          One thoughtful question a day opens conversations you didn&apos;t know you were missing. A shared timeline keeps the moments worth keeping. A private journal gives each of you room to think. No feeds, no streaks, no scores.
        </p>

        <button onClick={handleSignIn}
          aria-label="Sign in to Aveyra"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, backgroundColor: 'var(--color-accent)', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '9999px', minHeight: 48, cursor: 'pointer', transition: 'transform 150ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>
          Start your journey
        </button>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '1.25rem', opacity: 0.65 }}>
          All private. Encrypted on your devices. No data sales, ever.
        </p>
      </div>
    </div>
  );
}
