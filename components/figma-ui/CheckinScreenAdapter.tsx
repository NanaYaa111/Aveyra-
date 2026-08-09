'use client';

import { Btn, Card, ICheck, EmptyState, LoadingState } from './primitives';
import { useCheckins } from '@/lib/checkins';

const FEELINGS = [
  { id: 'calm',      label: 'Calm',      emoji: '🌿' },
  { id: 'happy',     label: 'Happy',     emoji: '🌞' },
  { id: 'grateful',  label: 'Grateful',  emoji: '🕊️' },
  { id: 'tired',     label: 'Tired',     emoji: '🌙' },
  { id: 'stretched', label: 'Stretched', emoji: '🌧️' },
  { id: 'low',       label: 'Low',       emoji: '🌫️' },
];

export function CheckinScreenAdapter() {
  const c = useCheckins();
  const { state, loading, draft, setDraft, busy, error, partnerName } = c;

  if (loading) {
    return <LoadingState />;
  }

  if (!state) {
    return (
      <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
        <EmptyState
          icon="💓"
          title={"Check-in needs the two of you"}
          body={"Once your partner has joined, you can each share how you're arriving."}
        />
      </div>
    );
  }

  const myFeeling = state.myFeeling;
  const partnerFeeling = state.partnerFeeling;

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15, marginTop: 4 }}>
          Check-in
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 6 }}>
          {"How are you arriving today?"}
        </div>
      </div>

      {/* My check-in */}
      <Card className="mb-6">
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 16 }}>
          You
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {FEELINGS.map(f => {
            const active = myFeeling === f.id;
            return (
              <button
                key={f.id}
                onClick={() => void c.setFeeling(active ? null : f.id)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all"
                style={{
                  backgroundColor: active ? 'var(--color-tint)' : 'var(--color-well)',
                  border: active ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                  cursor: 'pointer',
                  minHeight: 44,
                }}
                aria-pressed={active}
              >
                <span style={{ fontSize: 22 }}>{f.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--color-accent)' : 'var(--color-muted)' }}>
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={"Anything you'd like to add? (optional)"}
          className="w-full rounded-xl px-4 py-2.5 text-sm"
          style={{
            backgroundColor: 'var(--color-well)',
            border: '1px solid var(--color-edge)',
            color: 'var(--color-ink)',
            fontSize: 14,
            outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
        />
        {myFeeling && (
          <div className="mt-4 flex justify-end">
            {!state.submitted ? (
              <Btn onClick={() => void c.submit()} disabled={busy}>
                {busy ? 'Sharing…' : 'Share with ' + partnerName}
              </Btn>
            ) : (
              <div style={{ fontSize: 14, color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ICheck size={15} /> Shared
              </div>
            )}
          </div>
        )}
        {error && <div style={{ fontSize: 13, color: 'var(--color-alert)', marginTop: 8 }}>{error}</div>}
      </Card>

      {/* Partner's check-in */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 16 }}>
          {partnerName}
        </div>
        {partnerFeeling ? (
          <div className="flex items-center gap-4">
            {FEELINGS.filter(f => f.id === partnerFeeling).map(f => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: 'var(--color-well)' }}>
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>
            {partnerName} {"hasn't checked in yet today."}
          </div>
        )}
      </Card>
    </div>
  );
}
