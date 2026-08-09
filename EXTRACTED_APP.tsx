import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react'

type Screen = 'today' | 'checkin' | 'messages' | 'dates' | 'notes' | 'scripture' | 'story' | 'vault' | 'write' | 'settings'
type Theme = 'light' | 'dark' | 'system'

// ─── Icons ────────────────────────────────────────────────────────────────────

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

const IToday = (p: IcoProps) => <Ico {...p} path={<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>} />
const ICheckin = (p: IcoProps) => <Ico {...p} path={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} />
const IMessages = (p: IcoProps) => <Ico {...p} path={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />
const IDates = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />
const IStory = (p: IcoProps) => <Ico {...p} path={<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>} />
const IWrite = (p: IcoProps) => <Ico {...p} path={<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>} />
const ISettings = (p: IcoProps) => <Ico {...p} path={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />
const ISend = (p: IcoProps) => <Ico {...p} path={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>} />
const IPlus = (p: IcoProps) => <Ico {...p} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />
const ICheck = (p: IcoProps) => <Ico {...p} path={<polyline points="20 6 9 17 4 12"/>} />
const ILock = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />
const IMoon = (p: IcoProps) => <Ico {...p} path={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />
const ISun = (p: IcoProps) => <Ico {...p} path={<><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>} />
const IMonitor = (p: IcoProps) => <Ico {...p} path={<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>} />
const IDownload = (p: IcoProps) => <Ico {...p} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />
const IUpload = (p: IcoProps) => <Ico {...p} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />
const ILogOut = (p: IcoProps) => <Ico {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />
const IEdit2 = (p: IcoProps) => <Ico {...p} path={<><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>} />
const IBookmark = (p: IcoProps) => <Ico {...p} path={<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>} />
const ITrash = (p: IcoProps) => <Ico {...p} path={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>} />
const IChevronRight = (p: IcoProps) => <Ico {...p} path={<polyline points="9 18 15 12 9 6"/>} />
const IImage = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>} />
const INotes = (p: IcoProps) => <Ico {...p} path={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>} />
const IScripture = (p: IcoProps) => <Ico {...p} path={<><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth={1.5}/><path d="M12 6v6l4 2" strokeWidth={1.75}/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><path d="M8 7.5C8.5 6 10 5 12 5s3.5 1 4 2.5" strokeWidth={1.5}/><path d="M8 16.5C8.5 18 10 19 12 19s3.5-1 4-2.5" strokeWidth={1.5}/><line x1="12" y1="5" x2="12" y2="19" strokeWidth={1.25}/><line x1="5" y1="12" x2="19" y2="12" strokeWidth={1.25}/></>} />
const IVault = (p: IcoProps) => <Ico {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/></>} />
const IZap = (p: IcoProps) => <Ico {...p} path={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>} />
const IEye = (p: IcoProps) => <Ico {...p} path={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />
const IArrowLeft = (p: IcoProps) => <Ico {...p} path={<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>} />

// ─── Nav Data ─────────────────────────────────────────────────────────────────

type NavItem = { id: Screen; label: string; Icon: React.ComponentType<IcoProps> }

// Four constitutional destinations for the mobile bottom bar
const CORE_NAV: NavItem[] = [
  { id: 'today',    label: 'Today',    Icon: IToday },
  { id: 'story',    label: 'Story',    Icon: IStory },
  { id: 'write',    label: 'Write',    Icon: IWrite },
  { id: 'settings', label: 'Settings', Icon: ISettings },
]

// Embedded features — navigable from Today hub and desktop rail
const EMBEDDED_NAV: NavItem[] = [
  { id: 'checkin',   label: 'Check-in',  Icon: ICheckin },
  { id: 'messages',  label: 'Messages',  Icon: IMessages },
  { id: 'dates',     label: 'Dates',     Icon: IDates },
  { id: 'notes',     label: 'Notes',     Icon: INotes },
  { id: 'scripture', label: 'Scripture', Icon: IScripture },
  { id: 'vault',     label: 'Vault',     Icon: IVault },
]

// Which core nav item is "active" for a given screen
function coreActive(screen: Screen): Screen {
  if (['checkin','messages','dates','notes','scripture','vault'].includes(screen)) return 'today'
  return screen
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function NavBtn({ item, active, onNav, indent = false }: { item: NavItem; active: boolean; onNav: (s: Screen) => void; indent?: boolean }) {
  return (
    <button
      onClick={() => onNav(item.id)}
      className="flex items-center gap-3 text-left w-full transition-colors"
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: active ? 600 : 400,
        fontSize: indent ? 14 : 15,
        color: active ? 'var(--color-accent)' : 'var(--color-muted)',
        backgroundColor: active ? 'var(--color-tint)' : 'transparent',
        padding: indent ? '6px 12px 6px 36px' : '8px 12px',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
      }}
      aria-current={active ? 'page' : undefined}
    >
      <item.Icon size={indent ? 16 : 18} />
      {item.label}
    </button>
  )
}

function DesktopNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-full border-r"
      style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-well)' }}>
      {/* Wordmark */}
      <div className="px-5 pt-7 pb-6 flex items-center gap-2">
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: 'rgba(245,210,225,0.8)', letterSpacing: '0.02em' }}>
          aveyra
        </span>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1 overflow-y-auto">
        <NavBtn item={CORE_NAV[0]!} active={screen === 'today' || EMBEDDED_NAV.some(e => e.id === screen)} onNav={onNav} />
        {/* Embedded features indented under Today */}
        {EMBEDDED_NAV.map(item => (
          <NavBtn key={item.id} item={item} active={screen === item.id} onNav={onNav} indent />
        ))}
        <div className="my-1" style={{ height: 1, backgroundColor: 'var(--color-edge)', marginLeft: 12, marginRight: 12 }} />
        <NavBtn item={CORE_NAV[1]!} active={screen === 'story'} onNav={onNav} />
        <NavBtn item={CORE_NAV[2]!} active={screen === 'write'} onNav={onNav} />
      </nav>
      {/* Partner + settings */}
      <div className="px-3 pb-4 flex flex-col gap-1">
        <div className="my-1" style={{ height: 1, backgroundColor: 'var(--color-edge)', marginLeft: 12, marginRight: 12 }} />
        <NavBtn item={CORE_NAV[3]!} active={screen === 'settings'} onNav={onNav} />
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ backgroundColor: 'var(--color-tint)', color: 'var(--color-accent)' }}>J</div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Jordan</div>
        </div>
      </div>
    </aside>
  )
}

function MobileNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 border-t flex items-center justify-around"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-edge)' }}>
      {CORE_NAV.map(({ id, label, Icon }) => {
        const active = coreActive(screen) === id
        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="flex flex-col items-center justify-center gap-0.5 h-full flex-1"
            style={{ color: active ? 'var(--color-accent)' : 'var(--color-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={22} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, fontFamily: 'var(--font-sans)' }}>{label}</span>
          </button>
        )
      })}
    </nav>
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

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full av-pulse"
            style={{
              backgroundColor: 'var(--color-edge)',
              animationDelay: `${i * 0.2}s`,
            }} />
        ))}
      </div>
      <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>One moment…</div>
    </div>
  )
}

const SCREEN_NAMES: Record<Screen, string> = {
  today: 'Today', checkin: 'Check-in', messages: 'Messages', dates: 'Dates',
  notes: 'Notes', scripture: 'Scripture', story: 'Story', vault: 'Vault',
  write: 'Write', settings: 'Settings',
}

const NEEDS_SPACE_COPY: Partial<Record<Screen, string>> = {
  today:     'Today needs the two of you. Once your partner has joined, the question and your shared answers appear here.',
  checkin:   "Check-in needs the two of you. Once your partner has joined, you can each share how you're arriving.",
  messages:  "Messages needs the two of you. Once your partner has joined, this is where you'll talk.",
  dates:     'Dates needs the two of you. Once your partner has joined, you can start building your list.',
  notes:     'Notes needs the two of you. Once your space exists and your partner has joined, this page comes to life.',
  scripture: 'Scripture needs the two of you. Once your partner has joined, the daily ritual begins.',
  story:     'Story needs the two of you. Once your partner has joined, you can start saving memories.',
  vault:     'Vault needs the two of you. Once your partner has joined, you can share photos and video privately.',
}

function NeedsSpace({ screen }: { screen: Screen }) {
  const copy = NEEDS_SPACE_COPY[screen] ?? `${SCREEN_NAMES[screen]} needs the two of you. Once your space is set up and your partner has joined, this page comes to life.`
  return (
    <div className="flex flex-col items-center text-center py-16 px-8 gap-5 max-w-sm mx-auto">
      <div style={{ fontSize: 36 }}>🔑</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.3 }}>
          Your space isn't set up yet
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 10, lineHeight: 1.7 }}>
          {copy}
        </div>
      </div>
      <Btn>Finish setting up</Btn>
    </div>
  )
}

function ErrorMessage({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-8 gap-5 max-w-sm mx-auto">
      <div style={{ fontSize: 36 }}>🌧️</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.3 }}>
          This page didn't load
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 10, lineHeight: 1.7 }}>
          {message ?? 'Check your connection and try again. If this keeps happening, your data is safe — nothing was lost.'}
        </div>
      </div>
      <Btn variant="secondary">Try again</Btn>
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

function TodayScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [todayState, setTodayState] = useState<TodayState>('answering')
  const [answer, setAnswer] = useState('')
  const [saved, setSaved] = useState(false)

  const canSubmit = answer.trim().length > 10

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
            <button key={id} onClick={() => onNav(id)}
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

// ─── Screen: Check-in ─────────────────────────────────────────────────────────

const FEELINGS = [
  { id: 'calm',      label: 'Calm',      emoji: '🌿' },
  { id: 'happy',     label: 'Happy',     emoji: '🌞' },
  { id: 'grateful',  label: 'Grateful',  emoji: '🕊️' },
  { id: 'tired',     label: 'Tired',     emoji: '🌙' },
  { id: 'stretched', label: 'Stretched', emoji: '🌧️' },
  { id: 'low',       label: 'Low',       emoji: '🌫️' },
]

function CheckInScreen() {
  const [mine, setMine] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [jordanFeeling, setJordanFeeling] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Simulate Jordan's check-in being visible
  const jordanCheckedIn = jordanFeeling !== null

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
            {FEELINGS.filter(f => f.id === jordanFeeling).map(f => (
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
              Jordan's check-in hasn't come through yet.
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Screen: Messages ─────────────────────────────────────────────────────────

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
  { id: 4, from: 'me',     text: "How's your day looking?", time: '9:15 am' },
  { id: 5, from: 'jordan', text: 'Meetings until 2, then free. Walk later?', time: '9:16 am' },
  { id: 6, from: 'me',     text: 'Yes. The park route.', time: '9:17 am' },
  { id: 7, from: 'jordan', text: 'The long one?', time: '9:18 am' },
  { id: 8, from: 'me',     text: 'The long one.', time: '9:19 am' },
]

function MessagesScreen() {
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
          <EmptyState icon="💬" title="It's quiet in here."
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

// ─── Screen: Dates ────────────────────────────────────────────────────────────

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

function DatesScreen() {
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

// ─── Screen: Story ────────────────────────────────────────────────────────────

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

function StoryScreen() {
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

// ─── Screen: Write ────────────────────────────────────────────────────────────

type Entry = { id: number; date: string; preview: string; body: string }

const SEED_ENTRIES: Entry[] = [
  { id: 2, date: 'Today, Aug 8', preview: 'Thinking about the trip we talked about…', body: "Thinking about the trip we talked about. I don't know if it'll actually happen this year but I keep coming back to it. Something about wanting to go somewhere neither of us has been." },
  { id: 1, date: 'Aug 5', preview: "Sometimes I wonder if we're doing this right…", body: "Sometimes I wonder if we're doing this right — being together, I mean. And then I think: what would 'right' even look like? This feels like it." },
]

function WriteScreen() {
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
            placeholder="Write whatever's on your mind. This is yours."
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

// ─── Screen: Settings ─────────────────────────────────────────────────────────

function SettingsScreen({ theme, onTheme }: { theme: Theme; onTheme: (t: Theme) => void }) {
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
                  onClick={() => onTheme(t.id)}
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

// ─── Screen: Notes ───────────────────────────────────────────────────────────

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

function NotesScreen() {
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

// ─── Screen: Scripture ────────────────────────────────────────────────────────

type ScriptureState = 'open' | 'waiting' | 'respond' | 'complete'

const SUGGESTED_VERSE = {
  ref: 'Ruth 1:16',
  text: "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
}

function ScriptureScreen() {
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
              "{SUGGESTED_VERSE.text}"
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
              "{SUGGESTED_VERSE.text}"
            </div>
            {myNote && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-edge)', fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>
                {myNote}
              </div>
            )}
          </Card>
          <div className="flex items-center gap-3 py-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
            <span style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>Open — Jordan's response will appear here</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
          </div>
        </div>
      )}

      {state === 'respond' && (
        <div className="flex flex-col gap-4">
          <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>Jordan chose today's verse.</div>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 10 }}>
              {SUGGESTED_VERSE.ref}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.7, fontStyle: 'italic' }}>
              "{SUGGESTED_VERSE.text}"
            </div>
          </Card>
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>What did it stir?</div>
            <textarea rows={4} value={response} onChange={e => setResponse(e.target.value)}
              placeholder="Write whatever it brought up. There's no right answer."
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
              "{SUGGESTED_VERSE.text}"
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
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-bronze)', marginBottom: 8 }}>Jordan's response</div>
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

// ─── Screen: Vault ────────────────────────────────────────────────────────────

type VaultItem = { id: number; from: 'me' | 'jordan'; date: string; thumb: string; viewOnce: boolean; viewed?: boolean; alt: string }

const SEED_VAULT: VaultItem[] = [
  { id: 1, from: 'me',     date: 'Aug 7', thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop&auto=format', viewOnce: false, alt: 'Sunlight through trees on a morning walk' },
  { id: 2, from: 'jordan', date: 'Aug 6', thumb: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&auto=format', viewOnce: true,  alt: 'A view-once photo from Jordan' },
  { id: 3, from: 'me',     date: 'Aug 3', thumb: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=400&fit=crop&auto=format', viewOnce: false, alt: 'A quiet evening at home' },
  { id: 4, from: 'jordan', date: 'Jul 30', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop&auto=format', viewOnce: false, alt: 'Mountain trail hike' },
]

function VaultScreen() {
  const [items, setItems] = useState<VaultItem[]>(SEED_VAULT)
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
          What this vault can and can't do
          <IChevronRight size={13} style={{ transform: showLimits ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {showLimits && (
          <div className="mt-3 p-4 rounded-xl text-sm leading-relaxed"
            style={{ backgroundColor: 'var(--color-well)', color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.7 }}>
            The server can't read these files. It can't stop a screenshot. If both devices are lost, the files are unrecoverable. Deletion is permanent. Video up to 60 seconds.
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(item => {
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

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'linear-gradient(160deg, #1c0e1a 0%, #2a1222 55%, #3a1a2e 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient background glows */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,63,91,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '8%', left: '20%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(176,106,63,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '22px 26px', position: 'relative', zIndex: 1 }}>
        <button onClick={onSignIn} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(245,215,225,0.6)', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minHeight: 34, padding: '0 14px', cursor: 'pointer', letterSpacing: '0.02em' }}>
          Sign in
        </button>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8" style={{ paddingBottom: '10vh', position: 'relative', zIndex: 1 }}>

        {/* Two-circle motif — two people */}
        <div aria-hidden="true" style={{ position: 'relative', width: 108, height: 62, marginBottom: '3rem', flexShrink: 0 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 62, height: 62, borderRadius: '50%', background: 'rgba(168,63,91,0.38)', boxShadow: '0 0 32px rgba(168,63,91,0.25)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, width: 62, height: 62, borderRadius: '50%', background: 'rgba(176,106,63,0.28)', boxShadow: '0 0 32px rgba(176,106,63,0.18)' }} />
          {/* Centre overlap dot */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'rgba(245,210,220,0.85)', boxShadow: '0 0 8px rgba(245,210,220,0.6)' }} />
        </div>

        {/* Wordmark */}
        <h1 aria-label="Aveyra"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(3.75rem, 13vw, 6.25rem)', lineHeight: 1, color: '#f5dfe8', letterSpacing: '-0.01em', margin: '0 0 1.75rem' }}>
          aveyra
        </h1>

        {/* Thin rule */}
        <div style={{ width: 32, height: 1, backgroundColor: 'rgba(245,180,200,0.25)', margin: '0 auto 1.75rem' }} />

        {/* Poetic tagline */}
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.0625rem, 2.8vw, 1.25rem)', color: 'rgba(245,220,232,0.72)', lineHeight: 1.7, maxWidth: '24ch', margin: '0 0 0.875rem' }}>
          A private home for the two of you.
        </p>

        {/* Supporting line */}
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'rgba(200,165,182,0.55)', lineHeight: 1.65, maxWidth: '30ch', margin: '0 0 3rem', fontWeight: 400 }}>
          One question a day. A shared story. A space that is entirely yours.
        </p>

        {/* CTA */}
        <button onClick={onSignIn} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, padding: '0 2.5rem', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 0 24px rgba(168,63,91,0.3)' }}>
          Begin together
        </button>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'rgba(200,155,175,0.35)', marginTop: '1.25rem', letterSpacing: '0.04em' }}>
          No feeds · No streaks · No data sales
        </p>
      </div>

    </div>
  )
}

// ─── Auth Shell ────────────────────────────────────────────────────────────────

function AuthShell({ children, onBack, backLabel }: { children: React.ReactNode; onBack?: () => void; backLabel?: string }) {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'linear-gradient(160deg, #1c0e1a 0%, #2a1222 55%, #3a1a2e 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,63,91,0.14) 0%, transparent 70%)' }} />
      </div>
      <header className="flex items-center px-6 py-6" style={{ position: 'relative', zIndex: 1 }}>
        {onBack && (
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'rgba(200,165,182,0.6)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: 0 }}>
            <IArrowLeft size={15} /> {backLabel ?? 'Back'}
          </button>
        )}
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '1.05rem', letterSpacing: '0.04em', color: 'rgba(245,210,225,0.7)' }}>aveyra</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {children}
        </div>
      </main>
    </div>
  )
}

// ─── Step Dots ─────────────────────────────────────────────────────────────────

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div role="img" aria-label={`Step ${current} of ${total}`} style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: '2.25rem' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i + 1 <= current ? 'rgba(168,63,91,0.85)' : 'transparent', border: '1.5px solid rgba(168,63,91,0.45)', boxShadow: i + 1 <= current ? '0 0 6px rgba(168,63,91,0.5)' : 'none', transition: 'all 200ms' }} />
      ))}
    </div>
  )
}

// ─── Auth Input ────────────────────────────────────────────────────────────────

function AuthInput({ id, label, hint, error, ...props }: { id: string; label: string; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(200,165,182,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      <input id={id}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', padding: '12px 16px', border: `1.5px solid ${error ? 'rgba(210,80,100,0.5)' : 'rgba(245,180,200,0.15)'}`, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', color: '#f5dfe8', outline: 'none', backdropFilter: 'blur(8px)' }}
        {...props} />
      {hint && !error && <p id={`${id}-hint`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'rgba(200,155,175,0.45)', margin: 0, lineHeight: 1.5 }}>{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'rgba(220,100,120,0.9)', margin: 0 }}>{error}</p>}
    </div>
  )
}

// ─── OTP Input ─────────────────────────────────────────────────────────────────

function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const pad = (value + '      ').slice(0, 6)

  const handle = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = pad.split(''); arr[i] = ch || ' '
    onChange(arr.join('').trimEnd())
    if (ch && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pad[i]?.trim() && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input key={i}
          ref={el => { refs.current[i] = el }}
          type="text" inputMode="numeric" maxLength={1}
          value={pad[i]?.trim() ?? ''}
          onChange={e => handle(i, e)}
          onKeyDown={e => handleKey(i, e)}
          aria-label={`Digit ${i + 1} of 6`}
          style={{ width: 44, height: 54, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, border: '1.5px solid rgba(245,180,200,0.18)', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', color: '#f5dfe8', outline: 'none', backdropFilter: 'blur(8px)', letterSpacing: '0.04em' }} />
      ))}
    </div>
  )
}

// ─── Sign In ───────────────────────────────────────────────────────────────────

function SignInScreen({ onNext, onBack }: { onNext: (email: string) => void; onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { setError('Enter a valid email address.'); return }
    setError('')
    setSending(true)
    setTimeout(() => { setSending(false); onNext(email) }, 900)
  }

  return (
    <AuthShell onBack={onBack} backLabel="Back to start">
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.875rem, 6vw, 2.25rem)', color: '#f5dfe8', margin: '0 0 0.625rem', lineHeight: 1.2 }}>Sign in to your space</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'rgba(200,165,182,0.6)', margin: '0 0 2rem', lineHeight: 1.65 }}>A sign-in code will be sent to the email you provide.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AuthInput id="email" label="Email" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail((e.target as HTMLInputElement).value)} error={error} autoFocus />
        <button type="submit" disabled={!email || sending} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, cursor: !email || sending ? 'default' : 'pointer', opacity: !email || sending ? 0.45 : 1, letterSpacing: '0.02em', boxShadow: '0 0 20px rgba(168,63,91,0.25)', width: '100%' }}>
          {sending ? 'Sending…' : 'Send code'}
        </button>
      </form>
    </AuthShell>
  )
}

// ─── Verify ────────────────────────────────────────────────────────────────────

function VerifyScreen({ email, onNext, onBack }: { email: string; onNext: () => void; onBack: () => void }) {
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const complete = code.replace(/\s/g, '').length === 6

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!complete) return
    setVerifying(true); setError('')
    setTimeout(() => { setVerifying(false); onNext() }, 900)
  }

  const handleResend = () => { setResendIn(30); setError('') }

  return (
    <AuthShell onBack={onBack} backLabel="Use a different email">
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.875rem, 6vw, 2.25rem)', color: '#f5dfe8', margin: '0 0 0.625rem', lineHeight: 1.2 }}>Check your inbox</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'rgba(200,165,182,0.6)', margin: '0 0 2rem', lineHeight: 1.65 }}>
        A 6-digit code was sent to <strong style={{ color: 'rgba(245,220,232,0.85)', fontWeight: 500 }}>{email}</strong>
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <OTPInput value={code} onChange={setCode} />
        {error && <p role="alert" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'rgba(220,100,120,0.9)', textAlign: 'center', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={!complete || verifying} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, cursor: !complete || verifying ? 'default' : 'pointer', opacity: !complete || verifying ? 0.45 : 1, letterSpacing: '0.02em', boxShadow: '0 0 20px rgba(168,63,91,0.25)', width: '100%' }}>
          {verifying ? 'Verifying…' : 'Verify code'}
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'rgba(200,155,175,0.4)', margin: '0 0 0.5rem' }}>Didn't get the code?</p>
          <button type="button" onClick={handleResend} disabled={resendIn > 0}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: resendIn > 0 ? 'rgba(200,155,175,0.35)' : 'rgba(245,190,210,0.75)', background: 'none', border: 'none', cursor: resendIn > 0 ? 'default' : 'pointer', textDecoration: resendIn > 0 ? 'none' : 'underline' }}>
            {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </AuthShell>
  )
}

// ─── Onboarding Step 1: Name ───────────────────────────────────────────────────

function OnboardingName({ onNext }: { onNext: () => void }) {
  const [name, setName] = useState('')
  return (
    <AuthShell>
      <StepDots total={3} current={1} />
      {/* Two-circle motif */}
      <div aria-hidden="true" style={{ position: 'relative', width: 108, height: 62, margin: '0 auto 2rem', flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 62, height: 62, borderRadius: '50%', background: 'rgba(168,63,91,0.38)', boxShadow: '0 0 28px rgba(168,63,91,0.22)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, width: 62, height: 62, borderRadius: '50%', background: 'rgba(176,106,63,0.28)', boxShadow: '0 0 24px rgba(176,106,63,0.16)' }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'rgba(245,210,220,0.85)', boxShadow: '0 0 8px rgba(245,210,220,0.6)' }} />
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.875rem, 6vw, 2.25rem)', color: '#f5dfe8', margin: '0 0 0.625rem', lineHeight: 1.2 }}>
        Welcome to your space
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'rgba(200,165,182,0.6)', margin: '0 0 2rem', lineHeight: 1.65 }}>
        First — what should you be called here?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AuthInput id="your-name" label="Your name" type="text" placeholder="e.g. Alex" value={name} onChange={e => setName((e.target as HTMLInputElement).value)} autoFocus />
        <button disabled={!name.trim()} onClick={onNext} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, cursor: !name.trim() ? 'default' : 'pointer', opacity: !name.trim() ? 0.4 : 1, letterSpacing: '0.02em', boxShadow: '0 0 20px rgba(168,63,91,0.25)', width: '100%' }}>
          Continue
        </button>
      </div>
    </AuthShell>
  )
}

// ─── Onboarding Step 2: Create or Join ────────────────────────────────────────

function OnboardingChoice({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  return (
    <AuthShell>
      <StepDots total={3} current={2} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.875rem, 6vw, 2.25rem)', color: '#f5dfe8', margin: '0 0 0.625rem', lineHeight: 1.2 }}>Starting, or joining?</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'rgba(200,165,182,0.6)', margin: '0 0 2.25rem', lineHeight: 1.65 }}>
        One of you creates the shared space; the other joins with an invite code.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <button onClick={onCreate} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 0 20px rgba(168,63,91,0.25)', width: '100%' }}>
          Start our space
        </button>
        <button onClick={onJoin} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: 'rgba(245,210,225,0.75)', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,180,200,0.15)', minHeight: 52, cursor: 'pointer', letterSpacing: '0.02em', width: '100%' }}>
          Join my partner
        </button>
      </div>
    </AuthShell>
  )
}

// ─── Onboarding Step 3a: Create Space ─────────────────────────────────────────

function OnboardingDetails({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [partnerName, setPartnerName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = () => {
    setCreating(true)
    setTimeout(() => { setCreating(false); onNext() }, 1000)
  }

  return (
    <AuthShell onBack={onBack}>
      <StepDots total={3} current={3} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.875rem, 6vw, 2.25rem)', color: '#f5dfe8', margin: '0 0 0.625rem', lineHeight: 1.2 }}>A few gentle details</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'rgba(200,165,182,0.6)', margin: '0 0 2rem', lineHeight: 1.65 }}>All optional — you can add these later in Settings.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AuthInput id="partner-name" label="Your partner's name" type="text" placeholder="e.g. Sam" value={partnerName} onChange={e => setPartnerName((e.target as HTMLInputElement).value)} />
        <AuthInput id="start-date" label="When did your story begin?" type="date" value={startDate} onChange={e => setStartDate((e.target as HTMLInputElement).value)} hint="Used to mark anniversaries — never a countdown or a score." />
        <button onClick={handleCreate} disabled={creating} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, cursor: creating ? 'default' : 'pointer', opacity: creating ? 0.55 : 1, letterSpacing: '0.02em', boxShadow: '0 0 20px rgba(168,63,91,0.25)', width: '100%' }}>
          {creating ? 'Creating your space…' : 'Create our space'}
        </button>
      </div>
    </AuthShell>
  )
}

// ─── Onboarding Step 3b: Join Space ───────────────────────────────────────────

function OnboardingJoin({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = () => {
    if (!code.trim()) return
    setJoining(true); setError('')
    setTimeout(() => { setJoining(false); onNext() }, 900)
  }

  return (
    <AuthShell onBack={onBack}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.875rem, 6vw, 2.25rem)', color: '#f5dfe8', margin: '0 0 0.625rem', lineHeight: 1.2 }}>
        Join your partner
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'rgba(200,165,182,0.6)', margin: '0 0 2rem', lineHeight: 1.65 }}>
        Enter the invite code they shared with you.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AuthInput id="invite-code" label="Invite code" type="text" placeholder="e.g. A3K9M2" value={code} onChange={e => { setCode((e.target as HTMLInputElement).value); setError('') }} error={error || undefined} autoFocus />
        <button onClick={handleJoin} disabled={!code.trim() || joining} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, cursor: !code.trim() || joining ? 'default' : 'pointer', opacity: !code.trim() || joining ? 0.4 : 1, letterSpacing: '0.02em', boxShadow: '0 0 20px rgba(168,63,91,0.25)', width: '100%' }}>
          {joining ? 'Connecting…' : 'Connect'}
        </button>
      </div>
    </AuthShell>
  )
}

// ─── Onboarding Step 4: Invite ─────────────────────────────────────────────────

function OnboardingInvite({ onEnter }: { onEnter: () => void }) {
  const [copied, setCopied] = useState(false)
  const inviteCode = 'A3K9M2'

  const copy = () => {
    try {
      navigator.clipboard?.writeText(inviteCode).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => fallbackCopy())
    } catch { fallbackCopy() }
  }

  const fallbackCopy = () => {
    const el = document.createElement('textarea')
    el.value = inviteCode
    el.style.position = 'fixed'; el.style.opacity = '0'
    document.body.appendChild(el); el.select()
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
    document.body.removeChild(el)
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'linear-gradient(160deg, #1c0e1a 0%, #2a1222 55%, #3a1a2e 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glows */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,63,91,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(176,106,63,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '24px 24px 0', position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(245,210,225,0.7)', letterSpacing: '0.04em' }}>aveyra</span>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6" style={{ paddingBottom: '8vh', position: 'relative', zIndex: 1 }}>

        {/* Two-circle motif */}
        <div aria-hidden="true" style={{ position: 'relative', width: 108, height: 62, marginBottom: '2.25rem', flexShrink: 0 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 62, height: 62, borderRadius: '50%', background: 'rgba(168,63,91,0.38)', boxShadow: '0 0 32px rgba(168,63,91,0.25)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, width: 62, height: 62, borderRadius: '50%', background: 'rgba(176,106,63,0.28)', boxShadow: '0 0 28px rgba(176,106,63,0.18)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'rgba(245,210,220,0.85)', boxShadow: '0 0 8px rgba(245,210,220,0.6)' }} />
        </div>

        {/* Heading */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.875rem, 6vw, 2.375rem)', color: '#f5dfe8', lineHeight: 1.2, textAlign: 'center', margin: '0 0 0.625rem' }}>
          Invite your partner
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'rgba(200,165,182,0.55)', textAlign: 'center', margin: '0 0 2.25rem', lineHeight: 1.5 }}>
          Share this code and your space comes to life.
        </p>

        {/* Code card */}
        <div style={{ width: '100%', maxWidth: 360, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,180,200,0.12)', borderRadius: 20, padding: '2rem 1.75rem', textAlign: 'center', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(200,165,182,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1rem' }}>Your invite code</p>
          <p data-testid="invite-code"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(2.25rem, 9vw, 3rem)', letterSpacing: '0.22em', color: '#f5dfe8', margin: '0 0 1.75rem', lineHeight: 1, textShadow: '0 0 24px rgba(245,190,210,0.35)' }}>
            {inviteCode}
          </p>
          <button onClick={copy} className="av-btn rounded-full"
            style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, color: copied ? 'rgba(180,230,190,0.9)' : '#f5dfe8', backgroundColor: copied ? 'rgba(80,160,100,0.18)' : 'rgba(168,63,91,0.55)', border: `1px solid ${copied ? 'rgba(80,160,100,0.3)' : 'rgba(168,63,91,0.4)'}`, minHeight: 48, cursor: 'pointer', letterSpacing: '0.02em', transition: 'background-color 300ms, color 300ms, border-color 300ms' }}>
            {copied ? 'Copied ✓' : 'Copy invite code'}
          </button>
        </div>

        {/* Reassurance */}
        <p role="status" aria-live="polite"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'rgba(200,155,175,0.45)', lineHeight: 1.65, textAlign: 'center', maxWidth: '30ch', margin: '0 0 2.5rem' }}>
          You can start now — your partner will catch up when they join.
        </p>

        {/* Continue */}
        <button onClick={onEnter} className="av-btn rounded-full"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: '#f5dfe8', backgroundColor: 'rgba(168,63,91,0.75)', border: '1px solid rgba(168,63,91,0.5)', minHeight: 52, padding: '0 2.5rem', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 0 24px rgba(168,63,91,0.3)' }}>
          Continue to Aveyra
        </button>
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

type View = 'landing' | 'signin' | 'verify' | 'onboarding-name' | 'onboarding-choice' | 'onboarding-create' | 'onboarding-join' | 'onboarding-invite' | 'app'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [authEmail, setAuthEmail] = useState('')
  const [screen, setScreen] = useState<Screen>('today')
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      root.classList.toggle('dark', mq.matches)
    }
  }, [theme])

  if (view === 'landing')           return <LandingPage onSignIn={() => setView('signin')} />
  if (view === 'signin')            return <SignInScreen onNext={email => { setAuthEmail(email); setView('verify') }} onBack={() => setView('landing')} />
  if (view === 'verify')            return <VerifyScreen email={authEmail} onNext={() => setView('onboarding-name')} onBack={() => setView('signin')} />
  if (view === 'onboarding-name')   return <OnboardingName onNext={() => setView('onboarding-choice')} />
  if (view === 'onboarding-choice') return <OnboardingChoice onCreate={() => setView('onboarding-create')} onJoin={() => setView('onboarding-join')} />
  if (view === 'onboarding-create') return <OnboardingDetails onNext={() => setView('onboarding-invite')} onBack={() => setView('onboarding-choice')} />
  if (view === 'onboarding-join')   return <OnboardingJoin onNext={() => setView('onboarding-invite')} onBack={() => setView('onboarding-choice')} />
  if (view === 'onboarding-invite') return <OnboardingInvite onEnter={() => setView('app')} />

  const isFullHeight = screen === 'messages'
  return (
    <div className="flex md:flex-row h-dvh overflow-hidden" style={{ background: 'linear-gradient(160deg, #1c0e1a 0%, #2a1222 55%, #3a1a2e 100%)' }}>
      <DesktopNav screen={screen} onNav={setScreen} />
      <main className={isFullHeight ? 'flex-1 flex flex-col overflow-hidden' : 'flex-1 overflow-y-auto pb-16 md:pb-0'}>
        {screen === 'today'     && <TodayScreen onNav={setScreen} />}
        {screen === 'checkin'   && <CheckInScreen />}
        {screen === 'messages'  && <MessagesScreen />}
        {screen === 'dates'     && <DatesScreen />}
        {screen === 'notes'     && <NotesScreen />}
        {screen === 'scripture' && <ScriptureScreen />}
        {screen === 'story'     && <StoryScreen />}
        {screen === 'vault'     && <VaultScreen />}
        {screen === 'write'     && <WriteScreen />}
        {screen === 'settings'  && <SettingsScreen theme={theme} onTheme={setTheme} />}
      </main>
      <MobileNav screen={screen} onNav={setScreen} />
    </div>
  )
}
