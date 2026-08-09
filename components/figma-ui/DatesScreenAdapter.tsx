'use client'

import { useState, type FormEvent } from 'react'

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

const ICheck = (p: IcoProps) => <Ico {...p} path={<polyline points="20 6 9 17 4 12"/>} />
const ITrash = (p: IcoProps) => <Ico {...p} path={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>} />
const IPlus = (p: IcoProps) => <Ico {...p} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />

// ─── Primitives ───────────────────────────────────────────────────────────────

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

// ─── Data Types & Constants ───────────────────────────────────────────────────

type DateItem = { id: number; title: string; date?: string; done: boolean; idea: boolean }

const SEED_DATES: DateItem[] = [
  { id: 1, title: 'Anniversary dinner', date: 'Fri, Aug 15', done: false, idea: false },
  { id: 2, title: 'Weekend hike — Ridgeline trail', date: 'Sat, Aug 23', done: false, idea: false },
  { id: 3, title: 'Visit the botanical garden', done: false, idea: true, date: undefined },
  { id: 4, title: 'Weekend cabin trip', done: false, idea: true, date: undefined },
  { id: 5, title: 'Try the new ramen place on Oak St', done: false, idea: true, date: undefined },
  { id: 6, title: 'Movie marathon night', date: 'Jul 28', done: true, idea: false },
  { id: 7, title: 'Brunch at the farmers market', date: 'Jul 12', done: true, idea: false },
]

// ─── Screen: Dates ────────────────────────────────────────────────────────────

export default function DatesScreen() {
  const [dates, setDates] = useState<DateItem[]>(SEED_DATES)
  const [newIdea, setNewIdea] = useState('')

  const coming  = dates.filter(d => !d.done && !d.idea)
  const ideas   = dates.filter(d => !d.done && d.idea)
  const done    = dates.filter(d => d.done)

  function markDone(id: number) {
    setDates(prev => prev.map(d => d.id === id ? { ...d, done: true, idea: false } : d))
  }
  function remove(id: number) {
    setDates(prev => prev.filter(d => d.id !== id))
  }
  function addIdea(e: FormEvent) {
    e.preventDefault()
    if (!newIdea.trim()) return
    setDates(prev => [...prev, { id: Date.now(), title: newIdea.trim(), done: false, idea: true }])
    setNewIdea('')
  }

  const DateRow = ({ item }: { item: DateItem }) => (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0"
      style={{ borderColor: 'var(--color-edge)' }}>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 15, fontWeight: 500, color: item.done ? 'var(--color-muted)' : 'var(--color-ink)', textDecoration: item.done ? 'line-through' : 'none' }}>
          {item.title}
        </div>
        {item.date && (
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{item.date}</div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!item.done && (
          <button onClick={() => markDone(item.id)}
            className="p-2 rounded-lg transition-colors"
            title="Mark as done"
            style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ICheck size={16} />
          </button>
        )}
        <button onClick={() => remove(item.id)}
          className="p-2 rounded-lg transition-colors"
          title="Remove"
          style={{ color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ITrash size={15} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Dates
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>Things to do together.</div>
      </div>

      {coming.length > 0 && (
        <div className="mb-6">
          <SectionHeader>Coming up</SectionHeader>
          <Card>
            {coming.map(d => <DateRow key={d.id} item={d} />)}
          </Card>
        </div>
      )}

      <div className="mb-6">
        <SectionHeader>Ideas</SectionHeader>
        <Card>
          {ideas.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic', padding: '8px 0' }}>No ideas yet — add one below.</div>
          ) : (
            ideas.map(d => <DateRow key={d.id} item={d} />)
          )}
          <form onSubmit={addIdea} className="flex gap-2 pt-3 mt-2 border-t" style={{ borderColor: 'var(--color-edge)' }}>
            <input
              type="text"
              value={newIdea}
              onChange={e => setNewIdea(e.target.value)}
              placeholder="Add an idea…"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)', color: 'var(--color-ink)', outline: 'none', fontSize: 14 }}
            />
            <button type="submit"
              className="px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--color-tint)', color: 'var(--color-accent)', border: 'none', cursor: 'pointer' }}>
              <IPlus size={16} />
            </button>
          </form>
        </Card>
      </div>

      {done.length > 0 && (
        <div>
          <SectionHeader>Done together</SectionHeader>
          <Card>
            {done.map(d => <DateRow key={d.id} item={d} />)}
          </Card>
        </div>
      )}
    </div>
  )
}
