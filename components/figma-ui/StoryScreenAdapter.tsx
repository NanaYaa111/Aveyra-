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

type Memory = { id: number; date: string; title: string; body: string; photo?: string }

const SEED_MEMORIES: Memory[] = [
  {
    id: 3,
    date: 'Jun 22, 2025',
    title: 'That rainy afternoon',
    body: 'We stayed in and read all day. You fell asleep on my shoulder halfway through your chapter and I didn\'t move for an hour.',
  },
  {
    id: 2,
    date: 'May 10, 2025',
    title: 'First hike together',
    body: 'We took the Ridgeline trail. You were faster than me going up and slower than me going down. It balanced out.',
    photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop&auto=format',
  },
  {
    id: 1,
    date: 'Apr 3, 2025',
    title: 'The kitchen dancing night',
    body: 'No occasion. The radio was on and then suddenly we were dancing. I think about this a lot.',
  },
]

// ─── Screen: Story ────────────────────────────────────────────────────────────

export default function StoryScreen() {
  const [memories, setMemories] = useState<Memory[]>(SEED_MEMORIES)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  function saveMemory() {
    if (!newTitle.trim()) return
    setMemories(prev => [{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: newTitle.trim(),
      body: newBody.trim(),
    }, ...prev])
    setNewTitle('')
    setNewBody('')
    setAdding(false)
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
            Story
          </div>
          <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>The moments that became yours.</div>
        </div>
        <Btn variant="secondary" onClick={() => setAdding(!adding)}>
          <IPlus size={15} />
          Add
        </Btn>
      </div>

      {adding && (
        <Card className="mb-6">
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-bronze)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 14 }}>
            New memory
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="A title for this moment"
              className="w-full rounded-xl px-4 py-2.5 text-sm"
              style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)', color: 'var(--color-ink)', outline: 'none', fontSize: 15 }}
              autoFocus
            />
            <textarea
              rows={3}
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              placeholder="What happened? What do you want to remember about it?"
              className="w-full rounded-xl px-4 py-3 text-sm leading-relaxed"
              style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)', color: 'var(--color-ink)', outline: 'none', fontSize: 15 }}
            />
            <div className="flex gap-2 justify-end">
              <Btn variant="quiet" onClick={() => setAdding(false)}>Cancel</Btn>
              <Btn onClick={saveMemory} disabled={!newTitle.trim()}>Save</Btn>
            </div>
          </div>
        </Card>
      )}

      {memories.length === 0 ? (
        <EmptyState icon="📖" title="Your story starts here."
          body="When you save a moment from Today, or add one directly, it lives here." />
      ) : (
        <div className="flex flex-col gap-5">
          {memories.map(mem => (
            <Card key={mem.id} className="overflow-hidden !p-0">
              {mem.photo && (
                <img src={mem.photo} alt={mem.title} className="w-full h-44 object-cover"
                  style={{ backgroundColor: 'var(--color-well)' }} />
              )}
              <div className="p-5">
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 6 }}>{mem.date}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8 }}>
                  {mem.title}
                </div>
                <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>{mem.body}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
