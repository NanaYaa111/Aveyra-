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

type NoteChannel = 'weighing' | 'lovely' | 'try'
type Note = { id: number; from: 'me' | 'jordan'; text: string; date: string; read?: boolean; channel: NoteChannel }

const CHANNELS: { id: NoteChannel; emoji: string; label: string; hint: string }[] = [
  { id: 'weighing', emoji: '🌧️', label: "Something's weighing on me", hint: "Say it plainly. It doesn't have to be tidy." },
  { id: 'lovely',   emoji: '🌞', label: 'Something lovely',           hint: 'Share what caught you.' },
  { id: 'try',      emoji: '🌿', label: 'Something to try',           hint: 'An idea for the two of you.' },
]

const SEED_NOTES: Note[] = [
  { id: 1, from: 'jordan', text: "I've been carrying something about work and I think I need to say it tonight. Not urgent, just sitting with me.", date: 'Aug 7', read: false, channel: 'weighing' },
  { id: 2, from: 'me',     text: 'The light through the kitchen window at 7 am. It did something to me this morning.', date: 'Aug 7', read: true, channel: 'lovely' },
  { id: 3, from: 'jordan', text: 'What if we had breakfast outside this weekend, properly, not rushed?', date: 'Aug 5', read: true, channel: 'try' },
]

// ─── Screen: Notes ────────────────────────────────────────────────────────────

export default function NotesScreen() {
  const [active, setActive] = useState<NoteChannel>('weighing')
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES)

  const channel = CHANNELS.find(c => c.id === active)!
  const visible = notes.filter(n => n.channel === active)

  function send() {
    if (!draft.trim()) return
    setNotes(prev => [{
      id: Date.now(), from: 'me', text: draft.trim(),
      date: 'Today', read: false, channel: active,
    }, ...prev])
    setDraft('')
  }

  function markRead(id: number) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-6">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Notes
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>Three channels, so nothing arrives as a surprise.</div>
      </div>

      {/* Channel tabs */}
      <div className="flex flex-col gap-2 mb-6">
        {CHANNELS.map(ch => (
          <button key={ch.id} onClick={() => setActive(ch.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-all"
            style={{
              backgroundColor: active === ch.id ? 'var(--color-tint)' : 'var(--color-surface)',
              border: active === ch.id ? '1.5px solid var(--color-accent)' : '1.5px solid var(--color-edge)',
              cursor: 'pointer',
            }}>
            <span style={{ fontSize: 22 }}>{ch.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: active === ch.id ? 'var(--color-accent)' : 'var(--color-ink)' }}>
                {ch.label}
              </div>
              {active === ch.id && (
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{ch.hint}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Notes for this channel */}
      <div className="flex flex-col gap-3 mb-6">
        {visible.length === 0 ? (
          <EmptyState icon={channel.emoji} title="Nothing here yet."
            body={`When you or Jordan send a note to this channel, it appears here.`} />
        ) : visible.map(note => (
          <div key={note.id} className="rounded-2xl p-5"
            style={{
              backgroundColor: note.from === 'jordan' && !note.read ? 'var(--color-tint)' : 'var(--color-surface)',
              border: `1px solid ${note.from === 'jordan' && !note.read ? 'var(--color-accent)' : 'var(--color-edge)'}`,
            }}>
            <div className="flex items-start justify-between gap-3">
              <div style={{ fontSize: 11, fontWeight: 600, color: note.from === 'jordan' ? 'var(--color-bronze)' : 'var(--color-accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {note.from === 'jordan' ? 'Jordan' : 'You'} · {note.date}
              </div>
              {/* Sender is never shown a read receipt */}
              {note.from === 'jordan' && !note.read && (
                <button onClick={() => markRead(note.id)}
                  className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: 'var(--color-tint)', color: 'var(--color-accent)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Mark read
                </button>
              )}
            </div>
            <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>{note.text}</div>
          </div>
        ))}
      </div>

      {/* Compose */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>
          {channel.emoji} Send to this channel
        </div>
        <textarea rows={3} value={draft} onChange={e => setDraft(e.target.value)}
          placeholder={channel.hint}
          className="w-full rounded-xl px-4 py-3 mb-3"
          style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)', color: 'var(--color-ink)', fontSize: 15, outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
        />
        <div className="flex justify-end">
          <Btn onClick={send} disabled={!draft.trim()}>Send to Jordan</Btn>
        </div>
      </Card>
    </div>
  )
}
