'use client';

import { Btn, Card, ILogOut } from './primitives';
import { useAuth } from '@/lib/auth/context';

export function SettingsScreenAdapter() {
  const { session, signOut } = useAuth();

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Settings
        </div>
      </div>

      <Card className="mb-6">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>
            Account
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 8 }}>Email</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-ink)' }}>{session?.user?.email || 'Not set'}</div>
        </div>
      </Card>

      <Card className="mb-6">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>
            Privacy & Security
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-muted)' }}>
            Your messages, memories, and journal entries are encrypted locally on your device. The server stores encrypted data it cannot read.
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>
            Session
          </div>
          <Btn variant="quiet" onClick={() => void signOut()}>
            <ILogOut size={16} />
            Sign out
          </Btn>
        </div>
      </Card>
    </div>
  );
}
