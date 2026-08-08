'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Navigation,
  Logo,
  TodayIcon,
  StoryIcon,
  WriteIcon,
  DatesIcon,
  MessagesIcon,
  CheckInIcon,
  ScriptureIcon,
  NotesIcon,
  VaultIcon,
  SettingsIcon,
  type NavItem,
} from '@/components/ui';
import { useAuth } from '@/lib/auth/context';
import { useOnboarding } from '@/lib/relationship/context';

// The six embedded areas (Q22; Volume 3 §H) + Settings. Q28: the warm labels
// Story/Write stay (docs record the canonical feature names behind them).
const NAV_ITEMS: NavItem[] = [
  { href: '/today', label: 'Today', icon: <TodayIcon /> },
  { href: '/checkin', label: 'Check-in', icon: <CheckInIcon /> },
  { href: '/messages', label: 'Messages', icon: <MessagesIcon /> },
  { href: '/dates', label: 'Dates', icon: <DatesIcon /> },
  { href: '/notes', label: 'Notes', icon: <NotesIcon /> },
  { href: '/scripture', label: 'Scripture', icon: <ScriptureIcon /> },
  { href: '/story', label: 'Story', icon: <StoryIcon /> },
  { href: '/vault', label: 'Vault', icon: <VaultIcon /> },
  { href: '/write', label: 'Write', icon: <WriteIcon /> },
  { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

const AUTH_ROUTES = ['/sign-in', '/verify'];
const ONBOARDING_ROUTE = '/onboarding';

function SkipLink() {
  return (
    <a href="#main" className="skip-link bg-surface border border-border rounded-md px-3 py-2">
      Skip to content
    </a>
  );
}

function BareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid place-items-center px-4 py-10">
      <SkipLink />
      <main id="main" tabIndex={-1} className="w-full max-w-sm outline-none">
        {children}
      </main>
    </div>
  );
}

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sm:flex sm:items-stretch min-h-dvh">
      <SkipLink />
      <Navigation items={NAV_ITEMS} brand={<Logo />} />
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

function Resolving() {
  return (
    <div className="min-h-dvh grid place-items-center px-4" aria-busy="true">
      <p className="text-text-mute text-label" role="status">
        One moment…
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAuth();
  const { onboarded } = useOnboarding();

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isOnboardingRoute = pathname === ONBOARDING_ROUTE || pathname.startsWith(ONBOARDING_ROUTE + '/');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      if (!isAuthRoute) router.replace('/sign-in');
      return;
    }

    if (isAuthRoute) {
      router.replace('/today');
      return;
    }
    if (onboarded === null) return; 
    if (!onboarded && !isOnboardingRoute) router.replace('/onboarding');
    if (onboarded && isOnboardingRoute) router.replace('/today');
  }, [status, onboarded, isAuthRoute, isOnboardingRoute, router]);

  // Pre-auth screens.
  if (isAuthRoute) {
    if (status === 'authenticated') return <Resolving />;
    return <BareLayout>{children}</BareLayout>;
  }

  // Everything else requires a signed-in, set-up account.
  if (status !== 'authenticated' || onboarded === null) return <Resolving />;

  if (!onboarded) {
    return isOnboardingRoute ? <BareLayout>{children}</BareLayout> : <Resolving />;
  }
  // Onboarded: keep them out of the onboarding route.
  if (isOnboardingRoute) return <Resolving />;
  return <AppLayout>{children}</AppLayout>;
}

