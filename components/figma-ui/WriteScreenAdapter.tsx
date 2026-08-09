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

// ─── Icons ────────────────────────────────────────────────────────────────────

const IPlus = (p: IcoProps) => <Ico {...p} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />
const ILock = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />
const IChevronRight = (p: IcoProps) => <Ico {...p} path={<polyline points="9 18 15 12 9 6"/>} />

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

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 gap-4">
      <div style={{ color: 'var(--color-edge)', fontSize: 40 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)' }}>{title}</div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 6, maxWidth: 280, lineHeight: 1.6 }}>{body}</div>
      </div>
    </div>
  )
}

// ─── Data Types & Constants ───────────────────────────────────────────────────

type Entry = { id: number; date: string; preview: string; body: string }

const SEED_ENTRIES: Entry[] = [
  { id: 2, date: 'Today, Aug 8', preview: 'Thinking about the trip we talked about…', body: "Thinking about the trip we talked about. I don't know if it'll actually happen this year but I keep coming back to it. Something about wanting to go somewhere neither of us has been." },
  { id: 1, date: 'Aug 5', preview: "Sometimes I wonder if we're doing this right…", body: "Sometimes I wonder if we're doing this right — being together, I mean. And then I think: what would 'right' even look like? This feels like it." },
]

// ─── Screen: Write ────────────────────────────────────────────────────────────

export function WriteScreenAdapter() {
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES)
  const [active, setActive] = useState<Entry | null>(null)
  const [body, setBody] = useState('')
  const [writing, setWriting] = useState(false)

  function startNew() {
    setActive(null)
    setBody('')
    setWriting(true)
  }

  function openEntry(entry: Entry) {
    setActive(entry)
    setBody(entry.body)
    setWriting(true)
  }

  function save() {
    if (!body.trim()) { setWriting(false); return }
    const today = 'Today, Aug 8'
    if (active) {
      setEntries(prev => prev.map(e => e.id === active.id ? { ...e, body: body.trim(), preview: body.trim().slice(0, 50) + '…' } : e))
    } else {
      setEntries(prev => [{ id: Date.now(), date: today, preview: body.trim().slice(0, 50) + '…', body: body.trim() }, ...prev])
    }
    setWriting(false)
    setActive(null)
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
            Write
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <ILock size={12} style={{ color: 'var(--color-muted)' }} />
            <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>Private. Only you can see this.</span>
          </div>
        </div>
        {!writing && (
          <Btn variant="secondary" onClick={startNew}>
            <IPlus size={15} />
            New entry
          </Btn>
        )}
      </div>

      {writing ? (
        <div className="flex flex-col gap-4">
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            {active ? active.date : 'Today, Aug 8'}
          </div>
          <textarea
            autoFocus
            rows={14}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write whatever&apos;s on your mind. This is yours."
            className="w-full rounded-2xl px-5 py-4 leading-relaxed"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-edge)',
              color: 'var(--color-ink)',
              fontSize: 16,
              lineHeight: 1.75,
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
          />
          <div className="flex gap-2 justify-end">
            <Btn variant="quiet" onClick={() => setWriting(false)}>Cancel</Btn>
            <Btn onClick={save}>Save entry</Btn>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <EmptyState icon="✍️" title="Nothing here yet."
          body="This is your private space. What you write here is only ever yours." />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(entry => (
            <button key={entry.id} onClick={() => openEntry(entry)}
              className="w-full text-left rounded-2xl p-5 transition-all"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-edge)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-edge)' }}
            >
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 6 }}>{entry.date}</div>
              <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.5 }}>{entry.preview}</div>
              <div className="flex items-center gap-1 mt-3" style={{ color: 'var(--color-muted)' }}>
                <IChevronRight size={13} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
