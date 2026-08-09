'use client';

import { useState } from 'react';
import { DesktopNav, MobileNav } from './AveyraNavigation';

type Screen = 'today' | 'checkin' | 'messages' | 'dates' | 'notes' | 'scripture' | 'story' | 'vault' | 'write' | 'settings';

interface AveyraAppShellProps {
  children?: React.ReactNode;
  screens: {
    today: React.ComponentType<Record<string, never>>;
    checkin: React.ComponentType<Record<string, never>>;
    messages: React.ComponentType<Record<string, never>>;
    dates: React.ComponentType<Record<string, never>>;
    notes: React.ComponentType<Record<string, never>>;
    scripture: React.ComponentType<Record<string, never>>;
    story: React.ComponentType<Record<string, never>>;
    vault: React.ComponentType<Record<string, never>>;
    write: React.ComponentType<Record<string, never>>;
    settings: React.ComponentType<Record<string, never>>;
  };
}

export function AveyraAppShell({ screens }: AveyraAppShellProps) {
  const [screen, setScreen] = useState<Screen>('today');

  const isFullHeight = screen === 'messages';
  const ScreenComponent = screens[screen];

  return (
    <div
      className="flex md:flex-row h-dvh overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1c0e1a 0%, #2a1222 55%, #3a1a2e 100%)',
      }}
    >
      <DesktopNav screen={screen} onNav={setScreen} />
      <main
        className={
          isFullHeight
            ? 'flex-1 flex flex-col overflow-hidden'
            : 'flex-1 overflow-y-auto pb-16 md:pb-0'
        }
      >
        {ScreenComponent && <ScreenComponent />}
      </main>
      <MobileNav screen={screen} onNav={setScreen} />
    </div>
  );
}
