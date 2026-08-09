'use client'

import { useState } from 'react'

// ─── Icon Component ───────────────────────────────────────────────────────────

type IcoProps = { size?: number; style?: React.CSSProperties; className?: string }

function Ico({ path, size = 20, fill, style, className }: IcoProps & { path: React.ReactNode; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ?? 'none'}
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className}>
      {path}
    </svg>
  )
}

// ─── Icon: Check ──────────────────────────────────────────────────────────────

const ICheck = (p: IcoProps) => <Ico {...p} path={<polyline points="20 6 9 17 4 12"/>} />

// ─── Primitives ───────────────────────────────────────────────────────────────

function Btn({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
}: {
  variant?: 'primary' | 'secondary' | 'quiet'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'rgba(196,88,120,0.75)',
      color: '#f5dfe8',
      border: '1px solid rgba(196,88,120,0.5)',
      boxShadow: '0 0 18px rgba(196,88,120,0.22)',
    },
    secondary: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: 'rgba(245,210,225,0.75)',
      border: '1px solid rgba(245,180,200,0.15)',
    },
    quiet: {
      backgroundColor: 'transparent',
      color: 'var(--color-muted)',
      border: '1px solid var(--color-edge)',
    },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`av-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm cursor-pointer ${className}`}
      style={{
        fontFamily: 'var(--font-sans)',
        minHeight: 44,
        opacity: disabled ? 0.45 : 1,
        ...styles[variant],
      }}
    >
      {children}
    </button>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)' }}>
      {children}
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEELINGS = [
  { id: 'calm',      label: 'Calm',      emoji: '🌿' },
  { id: 'happy',     label: 'Happy',     emoji: '🌞' },
  { id: 'grateful',  label: 'Grateful',  emoji: '🕊️' },
  { id: 'tired',     label: 'Tired',     emoji: '🌙' },
  { id: 'stretched', label: 'Stretched', emoji: '🌧️' },
  { id: 'low',       label: 'Low',       emoji: '🌫️' },
]

// ─── Screen: Check-in ─────────────────────────────────────────────────────────

export function CheckInScreenAdapter() {
  const [mine, setMine] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Simulate Jordan's check-in being visible (always false for demo)
  const jordanCheckedIn = false

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500 }}>Friday, 8 August</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15, marginTop: 4 }}>
          Check-in
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 6 }}>How are you arriving today?</div>
      </div>

      {/* My check-in */}
      <Card className="mb-6">
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 16 }}>
          You
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {FEELINGS.map(f => {
            const active = mine === f.id
            return (
              <button key={f.id}
                onClick={() => setMine(active ? null : f.id)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all"
                style={{
                  backgroundColor: active ? 'var(--color-tint)' : 'var(--color-well)',
                  border: active ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                  cursor: 'pointer',
                  minHeight: 44,
                }}
              >
                <span style={{ fontSize: 22 }}>{f.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--color-accent)' : 'var(--color-muted)' }}>
                  {f.label}
                </span>
              </button>
            )
          })}
        </div>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Anything you'd like to add? (optional)"
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
        {mine && (
          <div className="mt-4 flex justify-end">
            {!submitted ? (
              <Btn onClick={() => setSubmitted(true)}>
                {submitted ? <><ICheck size={15} /> Shared</> : 'Share with Jordan'}
              </Btn>
            ) : (
              <div style={{ fontSize: 14, color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ICheck size={15} /> Shared
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Jordan's check-in */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 16 }}>
          Jordan
        </div>
        {jordanCheckedIn ? (
          <div className="flex items-center gap-4">
            {FEELINGS.filter(f => f.id === 'loved').map(f => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: 'var(--color-well)' }}>
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>
              Jordan&apos;s check-in hasn&apos;t come through yet.
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
