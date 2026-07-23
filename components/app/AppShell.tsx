'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Navigation,
  Logo,
  TodayIcon,
  StoryIcon,
  WriteIcon,
  SettingsIcon,
  type NavItem,
} from '@/components/ui';
import { useAuth } from '@/lib/auth/context';

const NAV_ITEMS: NavItem[] = [
  { href: '/today', label: 'Today', icon: <TodayIcon /> },
  { href: '/story', label: 'Story', icon: <StoryIcon /> },
  { href: '/write', label: 'Write', icon: <WriteIcon /> },
  { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

/** Pre-authentication routes: rendered full-screen, no navigation. */
const AUTH_ROUTES = ['/sign-in', '/verify'];

function SkipLink() {
  return (
    <a href="#main" className="skip-link bg-surface border border-border rounded-md px-3 py-2">
      Skip to content
    </a>
  );
}

/** A calm, centred column for the pre-auth screens (sign-in / verify). */
function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid place-items-center px-4 py-10">
      <SkipLink />
      <main id="main" tabIndex={-1} className="w-full max-w-sm outline-none">
        {children}
      </main>
    </div>
  );
}

/** The authenticated application shell: four-destination nav + reading column. */
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

/** A minimal, calm placeholder while the session resolves — no nav flash. */
function Resolving() {
  return (
    <div className="min-h-dvh grid place-items-center px-4" aria-busy="true">
      <p className="text-text-mute text-label" role="status">
        One moment…
      </p>
    </div>
  );
}

/**
 * The top-level shell. It decides — from the auth state and the route — whether
 * to show the pre-auth layout, the authenticated app, or a brief resolving state,
 * and enforces the guard: signed-out visitors are sent to /sign-in, and a
 * signed-in visitor never sits on an auth screen.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAuth();
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' && !isAuthRoute) router.replace('/sign-in');
    if (status === 'authenticated' && isAuthRoute) router.replace('/today');
  }, [status, isAuthRoute, router]);

  if (isAuthRoute) {
    // Don't flash an auth screen to an already-signed-in user mid-redirect.
    if (status === 'authenticated') return <Resolving />;
    return <AuthLayout>{children}</AuthLayout>;
  }

  if (status !== 'authenticated') return <Resolving />;
  return <AppLayout>{children}</AppLayout>;
}
