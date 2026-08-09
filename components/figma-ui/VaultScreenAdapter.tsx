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

const ILock = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />
const IChevronRight = (p: IcoProps) => <Ico {...p} path={<polyline points="9 18 15 12 9 6"/>} />
const IPlus = (p: IcoProps) => <Ico {...p} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />
const IEye = (p: IcoProps) => <Ico {...p} path={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />

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

// ─── Data Types & Constants ───────────────────────────────────────────────────

type VaultItem = { id: number; from: 'me' | 'jordan'; date: string; thumb: string; viewOnce: boolean; viewed?: boolean; alt: string }

const SEED_VAULT: VaultItem[] = [
  { id: 1, from: 'me',     date: 'Aug 7', thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop&auto=format', viewOnce: false, alt: 'Sunlight through trees on a morning walk' },
  { id: 2, from: 'jordan', date: 'Aug 6', thumb: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&auto=format', viewOnce: true,  alt: 'A view-once photo from Jordan' },
  { id: 3, from: 'me',     date: 'Aug 3', thumb: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=400&fit=crop&auto=format', viewOnce: false, alt: 'A quiet evening at home' },
  { id: 4, from: 'jordan', date: 'Jul 30', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop&auto=format', viewOnce: false, alt: 'Mountain trail hike' },
]

// ─── Screen: Vault ────────────────────────────────────────────────────────────

export function VaultScreenAdapter() {
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set())
  const [goneIds, setGoneIds] = useState<Set<number>>(new Set())
  const [showLimits, setShowLimits] = useState(false)

  function viewOnce(id: number) {
    setViewedIds(prev => new Set([...prev, id]))
    setTimeout(() => {
      setGoneIds(prev => new Set([...prev, id]))
    }, 4000)
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
            Vault
          </div>
          <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>End-to-end encrypted. Only the two of you.</div>
        </div>
        <Btn variant="secondary">
          <IPlus size={15} />
          Add
        </Btn>
      </div>

      {/* Plain limits notice */}
      <div className="mb-6">
        <button onClick={() => setShowLimits(!showLimits)}
          className="flex items-center gap-2 text-sm"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>
          <ILock size={13} />
          What this vault can and can&apos;t do
          <IChevronRight size={13} style={{ transform: showLimits ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {showLimits && (
          <div className="mt-3 p-4 rounded-xl text-sm leading-relaxed"
            style={{ backgroundColor: 'var(--color-well)', color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.7 }}>
            The server can&apos;t read these files. It can&apos;t stop a screenshot. If both devices are lost, the files are unrecoverable. Deletion is permanent. Video up to 60 seconds.
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SEED_VAULT.map(item => {
          const isGone = goneIds.has(item.id)
          const isViewed = viewedIds.has(item.id)
          const needsTap = item.viewOnce && item.from === 'jordan' && !isViewed

          return (
            <div key={item.id} className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: '1', backgroundColor: 'var(--color-well)' }}>
              {isGone ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center"
                  style={{ backgroundColor: 'var(--color-well)' }}>
                  <div style={{ fontSize: 22 }}>🕊️</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>Gone now — this was the one look.</div>
                </div>
              ) : needsTap ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: 'var(--color-tint)' }}
                  onClick={() => viewOnce(item.id)}>
                  <IEye size={24} style={{ color: 'var(--color-accent)' }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)', textAlign: 'center', padding: '0 8px', lineHeight: 1.4 }}>
                    Tap to view once
                  </div>
                </div>
              ) : (
                <img src={item.thumb} alt={item.alt} className="w-full h-full object-cover"
                  style={{ opacity: isViewed ? 0.5 : 1, transition: 'opacity 0.5s' }} />
              )}
              {/* From label */}
              {!isGone && (
                <div className="absolute bottom-0 inset-x-0 px-3 py-2 flex justify-between items-end"
                  style={{ background: 'linear-gradient(to top, rgba(26,16,22,0.6), transparent)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                    {item.from === 'me' ? 'You' : 'Jordan'}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{item.date}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
