'use client'

import { useState } from 'react'

// ─── Icon Component ───────────────────────────────────────────────────────────

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

// ─── Data Types & Constants ───────────────────────────────────────────────────

type ScriptureState = 'open' | 'waiting' | 'respond' | 'complete'

const SUGGESTED_VERSE = {
  ref: 'Ruth 1:16',
  text: "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
}

// ─── Screen: Scripture ────────────────────────────────────────────────────────

export function ScriptureScreenAdapter() {
  const [state, setState] = useState<ScriptureState>('open')
  const [myNote, setMyNote] = useState('')
  const [response, setResponse] = useState('')
  const [translation, setTranslation] = useState<'KJV' | 'WEB'>('WEB')

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500 }}>Friday, 8 August</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15, marginTop: 4 }}>
          Scripture
        </div>
      </div>

      {/* Translation toggle — personal, not shared */}
      <div className="flex items-center gap-2 mb-6">
        <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>Your translation</span>
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ backgroundColor: 'var(--color-well)' }}>
          {(['WEB', 'KJV'] as const).map(t => (
            <button key={t} onClick={() => setTranslation(t)}
              className="px-3 py-1 rounded-md text-xs font-semibold"
              style={{
                backgroundColor: translation === t ? 'var(--color-surface)' : 'transparent',
                color: translation === t ? 'var(--color-ink)' : 'var(--color-muted)',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>{t}</button>
          ))}
        </div>
      </div>

      {state === 'open' && (
        <div className="flex flex-col gap-4">
          <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>You arrived first today. Choose a verse for both of you.</div>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 10 }}>
              Suggested · {SUGGESTED_VERSE.ref}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.7, fontStyle: 'italic' }}>
              &quot;{SUGGESTED_VERSE.text}&quot;
            </div>
            <button className="mt-3 text-sm" style={{ color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', fontFamily: 'var(--font-sans)' }}>
              Use a different verse instead
            </button>
          </Card>
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>Why this one? (optional)</div>
            <textarea rows={3} value={myNote} onChange={e => setMyNote(e.target.value)}
              placeholder="What drew you to it today?"
              className="w-full rounded-xl px-4 py-3"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)', color: 'var(--color-ink)', fontSize: 15, outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
            />
          </div>
          <div className="flex justify-end">
            <Btn onClick={() => setState('waiting')}>Share this verse</Btn>
          </div>
        </div>
      )}

      {state === 'waiting' && (
        <div className="flex flex-col gap-4">
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 10 }}>
              {SUGGESTED_VERSE.ref}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.7, fontStyle: 'italic' }}>
              &quot;{SUGGESTED_VERSE.text}&quot;
            </div>
            {myNote && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-edge)', fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>
                {myNote}
              </div>
            )}
          </Card>
          <div className="flex items-center gap-3 py-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
            <span style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>Open — Jordan&apos;s response will appear here</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
          </div>
        </div>
      )}

      {state === 'respond' && (
        <div className="flex flex-col gap-4">
          <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>Jordan chose today&apos;s verse.</div>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 10 }}>
              {SUGGESTED_VERSE.ref}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.7, fontStyle: 'italic' }}>
              &quot;{SUGGESTED_VERSE.text}&quot;
            </div>
          </Card>
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>What did it stir?</div>
            <textarea rows={4} value={response} onChange={e => setResponse(e.target.value)}
              placeholder="Write whatever it brought up. There&apos;s no right answer."
              className="w-full rounded-xl px-4 py-3"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)', color: 'var(--color-ink)', fontSize: 15, outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
            />
          </div>
          <div className="flex justify-end">
            <Btn onClick={() => setState('complete')} disabled={!response.trim()}>Share your response</Btn>
          </div>
        </div>
      )}

      {state === 'complete' && (
        <div className="flex flex-col gap-4">
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 10 }}>
              {SUGGESTED_VERSE.ref}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.7, fontStyle: 'italic' }}>
              &quot;{SUGGESTED_VERSE.text}&quot;
            </div>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-tint)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 8 }}>You chose it because</div>
              <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>
                {myNote || "Something about today felt like it needed this verse."}
              </div>
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-bronze)', marginBottom: 8 }}>Jordan&apos;s response</div>
              <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>
                {response || "It made me think of the first time we drove somewhere without a plan. Just going."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
