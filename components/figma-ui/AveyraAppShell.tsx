'use client';

import { useState } from 'react';
import { DesktopNav, MobileNav } from './AveyraNavigation';

type Screen = 'today' | 'checkin' | 'messages' | 'dates' | 'notes' | 'scripture' | 'story' | 'vault' | 'write' | 'settings';

interface AveyraAppShellProps {
  children?: React.ReactNode;
  screens: {
    today: React.ComponentType<any>;
    checkin: React.ComponentType<any>;
    messages: React.ComponentType<any>;
    dates: React.ComponentType<any>;
    notes: React.ComponentType<any>;
    scripture: React.ComponentType<any>;
    story: React.ComponentType<any>;
    vault: React.ComponentType<any>;
    write: React.ComponentType<any>;
    settings: React.ComponentType<any>;
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
