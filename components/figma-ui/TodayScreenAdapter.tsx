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

// ─── Icon Definitions ─────────────────────────────────────────────────────────

const IEdit2 = (p: IcoProps) => <Ico {...p} path={<><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>} />
const IBookmark = (p: IcoProps) => <Ico {...p} path={<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>} />
const ICheck = (p: IcoProps) => <Ico {...p} path={<polyline points="20 6 9 17 4 12"/>} />

const ICheckin = (p: IcoProps) => <Ico {...p} path={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} />
const IMessages = (p: IcoProps) => <Ico {...p} path={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />
const IDates = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />
const INotes = (p: IcoProps) => <Ico {...p} path={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>} />
const IScripture = (p: IcoProps) => <Ico {...p} path={<><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth={1.5}/><path d="M12 6v6l4 2" strokeWidth={1.75}/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><path d="M8 7.5C8.5 6 10 5 12 5s3.5 1 4 2.5" strokeWidth={1.5}/><path d="M8 16.5C8.5 18 10 19 12 19s3.5-1 4-2.5" strokeWidth={1.5}/><line x1="12" y1="5" x2="12" y2="19" strokeWidth={1.25}/><line x1="5" y1="12" x2="19" y2="12" strokeWidth={1.25}/></>} />
const IVault = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/></>} />

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

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 10 }}>
      {children}
    </div>
  )
}

// ─── Screen: Today ────────────────────────────────────────────────────────────

type TodayState = 'answering' | 'waiting' | 'revealed'

const TODAY_QUESTION = "What's one thing from today you'd want to remember?"
const JORDAN_ANSWER = "The light through the kitchen window at 7 am. It hit the coffee mug just right and for a second everything felt very still and very good."
const EMBEDDED_NAV = [
  { id: 'checkin', label: 'Check-in', Icon: ICheckin },
  { id: 'messages', label: 'Messages', Icon: IMessages },
  { id: 'dates', label: 'Dates', Icon: IDates },
  { id: 'notes', label: 'Notes', Icon: INotes },
  { id: 'scripture', label: 'Scripture', Icon: IScripture },
  { id: 'vault', label: 'Vault', Icon: IVault },
]

interface TodayScreenProps {
  onNav?: (s: string) => void
}

export default function TodayScreen({ onNav }: TodayScreenProps) {
  const [todayState, setTodayState] = useState<TodayState>('answering')
  const [answer, setAnswer] = useState('')
  const [saved, setSaved] = useState(false)

  const canSubmit = answer.trim().length > 10
  const handleNav = onNav || (() => {})

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      {/* Arrival line */}
      <div className="mb-5 px-4 py-3 rounded-xl text-sm"
        style={{ backgroundColor: 'var(--color-well)', color: 'var(--color-muted)', borderLeft: '2px solid var(--color-bronze)' }}>
        Jordan answered today's question.
      </div>
      {/* Date */}
      <div className="mb-8">
        <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500 }}>Friday, 8 August</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15, marginTop: 4 }}>
          Today
        </div>
      </div>

      {/* Question card */}
      <Card className="mb-6">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>
          Question for today
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.35 }}>
          {TODAY_QUESTION}
        </div>
      </Card>

      {/* Answering state */}
      {todayState === 'answering' && (
        <div className="flex flex-col gap-4">
          <textarea
            rows={6}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Write whatever comes. There's no wrong answer."
            className="w-full rounded-2xl px-5 py-4 text-base leading-relaxed"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-edge)',
              color: 'var(--color-ink)',
              fontSize: 16,
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
          />
          <div className="flex justify-between items-center">
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Both answers will appear once the other is written.
            </span>
            <Btn onClick={() => setTodayState('waiting')} disabled={!canSubmit}>
              Share your answer
            </Btn>
          </div>
        </div>
      )}

      {/* Waiting state */}
      {todayState === 'waiting' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-bronze)', marginBottom: 8 }}>Your answer</div>
                <div style={{ fontSize: 16, color: 'var(--color-ink)', lineHeight: 1.6 }}>
                  {answer || "The long walk home. I noticed the evening light on the buildings for the first time in weeks."}
                </div>
              </div>
              <button className="shrink-0 p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
                onClick={() => setTodayState('answering')}
                aria-label="Edit answer">
                <IEdit2 size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 py-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
            <span style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>
              Open — answers reveal together
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
          </div>
        </div>
      )}

      {/* Revealed state */}
      {todayState === 'revealed' && (
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* My answer */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-tint)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 8 }}>You</div>
              <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>
                {answer || "The long walk home. I noticed the evening light on the buildings for the first time in weeks."}
              </div>
            </div>
            {/* Jordan's answer */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-bronze)', marginBottom: 8 }}>Jordan</div>
              <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>
                {JORDAN_ANSWER}
              </div>
            </div>
          </div>
          {!saved ? (
            <div className="flex justify-center pt-2">
              <Btn variant="secondary" onClick={() => setSaved(true)}>
                <IBookmark size={16} />
                Save as a memory
              </Btn>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 pt-2" style={{ fontSize: 14, color: 'var(--color-accent)', fontWeight: 600 }}>
              <ICheck size={16} />
              Saved to your story
            </div>
          )}
        </div>
      )}

      {/* Quick-access hub — embedded features */}
      <div className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--color-edge)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 12 }}>
          Daily
        </div>
        <div className="grid grid-cols-3 gap-2">
          {EMBEDDED_NAV.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => handleNav(id)}
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-colors"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-edge)' }}>
              <Icon size={20} style={{ color: 'var(--color-muted)' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ink)', fontFamily: 'var(--font-sans)' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily suggestion — always visible at bottom, no done button */}
      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-edge)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 8 }}>
          Something to try
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>
          Write something by hand and leave it somewhere Jordan will find it. It doesn't have to say much.
        </div>
      </div>
    </div>
  )
}
