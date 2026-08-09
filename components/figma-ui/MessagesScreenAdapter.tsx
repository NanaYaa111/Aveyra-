'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

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

// ─── Icon: Send ───────────────────────────────────────────────────────────────

const ISend = (p: IcoProps) => <Ico {...p} path={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>} />

// ─── Data Types & Constants ───────────────────────────────────────────────────

type Message = { id: number; from: 'me' | 'jordan'; text: string; time: string }

const PINGS = [
  'Thinking of you',
  'Just wanted you to know I\'m here',
  'Sending you love',
  'You crossed my mind',
  'I\'m with you',
  'I see you',
]

const SEED_MESSAGES: Message[] = [
  { id: 1, from: 'jordan', text: 'Good morning ☀️', time: '8:47 am' },
  { id: 2, from: 'me',     text: 'Morning. Coffee is already made.', time: '8:52 am' },
  { id: 3, from: 'jordan', text: 'You always do that. I love you.', time: '8:53 am' },
  { id: 4, from: 'me',     text: "How&apos;s your day looking?", time: '9:15 am' },
  { id: 5, from: 'jordan', text: 'Meetings until 2, then free. Walk later?', time: '9:16 am' },
  { id: 6, from: 'me',     text: 'Yes. The park route.', time: '9:17 am' },
  { id: 7, from: 'jordan', text: 'The long one?', time: '9:18 am' },
  { id: 8, from: 'me',     text: 'The long one.', time: '9:19 am' },
]

// ─── Screen: Messages ─────────────────────────────────────────────────────────

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

export function MessagesScreenAdapter() {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = draft.trim()
    if (!text) return
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()
    setMessages(prev => [...prev, { id: Date.now(), from: 'me', text, time }])
    setDraft('')
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col pb-16 md:pb-0" style={{ height: '100%' }}>
      {/* Header */}
      <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)' }}>Jordan</div>
        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>just the two of you</div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3">
        {messages.length === 0 ? (
          <EmptyState icon="💬" title="It&apos;s quiet in here."
            body="Say something small. Small things count." />
        ) : (
          messages.map(msg => (
            <div key={msg.id}
              className={`flex flex-col ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
              <div className="max-w-[75%] px-4 py-2.5 rounded-2xl"
                style={{
                  backgroundColor: msg.from === 'me' ? 'var(--color-accent)' : 'var(--color-well)',
                  color: msg.from === 'me' ? 'white' : 'var(--color-ink)',
                  borderRadius: msg.from === 'me' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                  fontSize: 15,
                  lineHeight: 1.5,
                }}>
                {msg.text}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 3, paddingLeft: msg.from === 'me' ? 0 : 4, paddingRight: msg.from === 'me' ? 4 : 0 }}>
                {msg.time}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Pings — one-tap warm phrasings, none of them a question */}
      <div className="shrink-0 px-4 py-2 flex gap-2 overflow-x-auto border-t"
        style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-surface)', scrollbarWidth: 'none' }}>
        {PINGS.map(ping => (
          <button key={ping}
            onClick={() => {
              const now = new Date()
              const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()
              setMessages(prev => [...prev, { id: Date.now(), from: 'me', text: ping, time }])
            }}
            className="shrink-0 px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{ backgroundColor: 'var(--color-tint)', color: 'var(--color-accent)', border: '1px solid var(--color-edge)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13 }}>
            {ping}
          </button>
        ))}
      </div>
      {/* Composer */}
      <div className="shrink-0 border-t px-4 py-3 flex gap-3 items-end"
        style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-surface)' }}>
        <textarea
          rows={1}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder="Say something…"
          className="flex-1 rounded-xl px-4 py-2.5 text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--color-well)',
            border: '1px solid var(--color-edge)',
            color: 'var(--color-ink)',
            fontSize: 15,
            resize: 'none',
            outline: 'none',
            minHeight: 44,
            maxHeight: 120,
            overflowY: 'auto',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-opacity"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            border: 'none',
            opacity: draft.trim() ? 1 : 0.4,
            cursor: draft.trim() ? 'pointer' : 'not-allowed',
          }}
          aria-label="Send">
          <ISend size={16} />
        </button>
      </div>
    </div>
  )
}
