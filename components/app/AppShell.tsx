import type { ReactNode } from 'react';
import {
  Navigation,
  Logo,
  TodayIcon,
  StoryIcon,
  WriteIcon,
  SettingsIcon,
  type NavItem,
} from '@/components/ui';

const NAV_ITEMS: NavItem[] = [
  { href: '/today', label: 'Today', icon: <TodayIcon /> },
  { href: '/story', label: 'Story', icon: <StoryIcon /> },
  { href: '/write', label: 'Write', icon: <WriteIcon /> },
  { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

/**
 * The application shell: skip link, fixed four-destination navigation, and a
 * centred reading column. Mobile-first — the nav is a bottom bar on small
 * screens and a left rail on larger ones.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="sm:flex sm:items-stretch min-h-dvh">
      <a href="#main" className="skip-link bg-surface border border-border rounded-md px-3 py-2">
        Skip to content
      </a>

      <Navigation items={NAV_ITEMS} brand={<Logo />} />

      {/* Bottom padding on mobile clears the fixed bottom nav. */}
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 w-full mx-auto max-w-app px-4 pt-6 pb-28 sm:pb-10 outline-none"
      >
        {children}
      </main>
    </div>
  );
}
