import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeScript } from '@/components/app/ThemeScript';
import { AppShell } from '@/components/app/AppShell';
import { PwaInit } from '@/components/app/PwaInit';
import { ErrorBoundary } from '@/components/app/ErrorBoundary';
import { ToastProvider } from '@/components/ui';
import { AuthProvider } from '@/lib/auth/context';
import { OnboardingProvider } from '@/lib/relationship/context';

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
    { media: '(prefers-color-scheme: light)', color: '#f7f5ef' },
    { media: '(prefers-color-scheme: dark)', color: '#101815' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
