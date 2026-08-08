import type { Metadata, Viewport } from 'next';
import { Fraunces, Nunito_Sans } from 'next/font/google';
import './globals.css';
import { ThemeScript } from '@/components/app/ThemeScript';
import { AppShell } from '@/components/app/AppShell';
import { PwaInit } from '@/components/app/PwaInit';
import { ErrorBoundary } from '@/components/app/ErrorBoundary';
import { ToastProvider } from '@/components/ui';
import { AuthProvider } from '@/lib/auth/context';
import { OnboardingProvider } from '@/lib/relationship/context';

// Fraunces for headings: a soft, characterful serif that carries the logo's
// refinement without the roundness a display sans was giving it. `SOFT` rounds
// the terminals slightly and `WONK` allows its alternate italic-ish shapes —
// both dialled low, so it reads warm rather than novelty.
const displayFont = Fraunces({
  subsets: ['latin'],
  // Variable font: the full weight range ships in one file, and the SOFT/WONK
  // axes are only available when the weight isn't pinned to a fixed list.
  axes: ['SOFT', 'WONK'],
  variable: '--font-display-family',
  display: 'swap',
});

const bodyFont = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body-family',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Aveyra',
    template: '%s · Aveyra',
  },
  description:
    'A private, calm home for your relationship — meaningful conversations and the memories you keep together.',
  applicationName: 'Aveyra',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.svg' },
  appleWebApp: {
    capable: true,
    title: 'Aveyra',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf1ee' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1016' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <ThemeScript />
        <PwaInit />
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <OnboardingProvider>
                <AppShell>{children}</AppShell>
              </OnboardingProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
