import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeScript } from '@/components/app/ThemeScript';
import { AppShell } from '@/components/app/AppShell';
import { PwaInit } from '@/components/app/PwaInit';
import { ToastProvider } from '@/components/ui';

export const metadata: Metadata = {
  title: {
    default: 'Aveyra',
    template: '%s · Aveyra',
  },
  description:
    'A private, offline-first home for your relationship. Your memories stay on your device.',
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
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
