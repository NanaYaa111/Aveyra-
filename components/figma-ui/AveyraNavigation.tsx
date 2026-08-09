'use client';

import { useState, useCallback } from 'react';
import {
  IToday, ICheckin, IMessages, IDates, INotes, IScripture,
  IStory, IWrite, ISettings, IVault,
} from '@/components/ui/Icons';

type Screen = 'today' | 'checkin' | 'messages' | 'dates' | 'notes' | 'scripture' | 'story' | 'vault' | 'write' | 'settings';

type NavItem = { id: Screen; label: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> };

const CORE_NAV: NavItem[] = [
  { id: 'today', label: 'Today', Icon: IToday },
  { id: 'story', label: 'Story', Icon: IStory },
  { id: 'write', label: 'Write', Icon: IWrite },
  { id: 'settings', label: 'Settings', Icon: ISettings },
];

const EMBEDDED_NAV: NavItem[] = [
  { id: 'checkin', label: 'Check-in', Icon: ICheckin },
  { id: 'messages', label: 'Messages', Icon: IMessages },
  { id: 'dates', label: 'Dates', Icon: IDates },
  { id: 'notes', label: 'Notes', Icon: INotes },
  { id: 'scripture', label: 'Scripture', Icon: IScripture },
  { id: 'vault', label: 'Vault', Icon: IVault },
];

function coreActive(screen: Screen): Screen {
  if (['checkin', 'messages', 'dates', 'notes', 'scripture', 'vault'].includes(screen)) return 'today';
  return screen;
}

function NavBtn({
  item,
  active,
  onNav,
  indent = false,
}: {
  item: NavItem;
  active: boolean;
  onNav: (s: Screen) => void;
  indent?: boolean;
}) {
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
  );
}

export function DesktopNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-full border-r"
      style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-well)' }}
    >
      {/* Wordmark */}
      <div className="px-5 pt-7 pb-6 flex items-center gap-2">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 22,
            color: 'rgba(245,210,225,0.8)',
            letterSpacing: '0.02em',
          }}
        >
          aveyra
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1 overflow-y-auto">
        <NavBtn
          item={CORE_NAV[0]}
          active={screen === 'today' || EMBEDDED_NAV.some((e) => e.id === screen)}
          onNav={onNav}
        />
        {/* Embedded features indented under Today */}
        {EMBEDDED_NAV.map((item) => (
          <NavBtn key={item.id} item={item} active={screen === item.id} onNav={onNav} indent />
        ))}
        <div className="my-1" style={{ height: 1, backgroundColor: 'var(--color-edge)', marginLeft: 12, marginRight: 12 }} />
        <NavBtn item={CORE_NAV[1]} active={screen === 'story'} onNav={onNav} />
        <NavBtn item={CORE_NAV[2]} active={screen === 'write'} onNav={onNav} />
      </nav>

      {/* Partner + settings */}
      <div className="px-3 pb-4 flex flex-col gap-1">
        <div className="my-1" style={{ height: 1, backgroundColor: 'var(--color-edge)', marginLeft: 12, marginRight: 12 }} />
        <NavBtn item={CORE_NAV[3]} active={screen === 'settings'} onNav={onNav} />
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ backgroundColor: 'var(--color-tint)', color: 'var(--color-accent)' }}
          >
            J
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Jordan</div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 border-t flex items-center justify-around"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-edge)' }}
    >
      {CORE_NAV.map(({ id, label, Icon }) => {
        const active = coreActive(screen) === id;
        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="flex flex-col items-center justify-center gap-0.5 h-full flex-1"
            style={{
              color: active ? 'var(--color-accent)' : 'var(--color-muted)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={22} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, fontFamily: 'var(--font-sans)' }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
