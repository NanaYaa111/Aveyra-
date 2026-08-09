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

const ISun = (p: IcoProps) => <Ico {...p} path={<><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>} />
const IMoon = (p: IcoProps) => <Ico {...p} path={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />
const IMonitor = (p: IcoProps) => <Ico {...p} path={<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>} />
const IDownload = (p: IcoProps) => <Ico {...p} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />
const IUpload = (p: IcoProps) => <Ico {...p} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />
const IChevronRight = (p: IcoProps) => <Ico {...p} path={<polyline points="9 18 15 12 9 6"/>} />
const ILogOut = (p: IcoProps) => <Ico {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />

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

// ─── Data Types ───────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark' | 'system'

interface SettingsScreenProps {
  theme?: Theme
  onTheme?: (t: Theme) => void
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────

export function SettingsScreenAdapter({ theme: initialTheme = 'light', onTheme = () => {} }: SettingsScreenProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  const handleTheme = (t: Theme) => {
    setTheme(t)
    onTheme(t)
  }

  const themes: { id: Theme; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'light', label: 'Light', Icon: ISun },
    { id: 'dark',  label: 'Dark',  Icon: IMoon },
    { id: 'system', label: 'System', Icon: IMonitor },
  ]

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Settings
        </div>
      </div>

      {/* Appearance */}
      <div className="mb-6">
        <SectionHeader>Appearance</SectionHeader>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 12 }}>Theme</div>
          <div className="flex gap-2">
            {themes.map(t => {
              const active = theme === t.id
              return (
                <button key={t.id}
                  onClick={() => handleTheme(t.id)}
                  className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: active ? 'var(--color-tint)' : 'var(--color-well)',
                    border: active ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                    color: active ? 'var(--color-accent)' : 'var(--color-muted)',
                    cursor: 'pointer',
                  }}>
                  <t.Icon size={18} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{t.label}</span>
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Relationship */}
      <div className="mb-6">
        <SectionHeader>Your space</SectionHeader>
        <Card>
          <div className="flex items-center gap-4 py-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ backgroundColor: 'var(--color-tint)', color: 'var(--color-accent)' }}>M</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-ink)' }}>Mia</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>mia@example.com</div>
            </div>
          </div>
          <div className="border-t my-4" style={{ borderColor: 'var(--color-edge)' }} />
          <div className="flex items-center gap-4 py-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ backgroundColor: 'var(--color-well)', color: 'var(--color-bronze)' }}>J</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-ink)' }}>Jordan</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>jordan@example.com</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data */}
      <div className="mb-6">
        <SectionHeader>Your data</SectionHeader>
        <Card>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 py-3 rounded-xl px-2 -mx-2 w-full text-left transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-well)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
              <IDownload size={16} style={{ color: 'var(--color-muted)' }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Export your data</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Download everything as JSON</div>
              </div>
              <IChevronRight size={16} style={{ color: 'var(--color-muted)', marginLeft: 'auto' }} />
            </button>
            <div className="border-t" style={{ borderColor: 'var(--color-edge)' }} />
            <button className="flex items-center gap-3 py-3 rounded-xl px-2 -mx-2 w-full text-left transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-well)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
              <IUpload size={16} style={{ color: 'var(--color-muted)' }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Import data</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Restore from a backup</div>
              </div>
              <IChevronRight size={16} style={{ color: 'var(--color-muted)', marginLeft: 'auto' }} />
            </button>
          </div>
        </Card>
      </div>

      {/* Sign out */}
      <button className="flex items-center gap-2 py-3 px-5 rounded-xl transition-colors"
        style={{
          background: 'none',
          border: '1px solid var(--color-edge)',
          cursor: 'pointer',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          fontWeight: 500,
          minHeight: 44,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-edge)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)' }}>
        <ILogOut size={16} />
        Sign out
      </button>
    </div>
  )
}
