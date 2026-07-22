import type { Metadata } from 'next';
import { Card } from '@/components/ui';
import { ThemeToggle } from '@/components/app/ThemeToggle';
import { DataControls } from '@/components/app/DataControls';

export const metadata: Metadata = { title: 'Settings' };

/**
 * Settings — profile, lock, accessibility, storage, export/import, and Recently
 * Deleted (Constitution Part 5 §7). Sections beyond Appearance are wired up in
 * later milestone steps; Appearance (light/dark) is live now.
 */
export default function SettingsPage() {
  return (
    <section aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="text-display mb-2">
        Settings
      </h1>
      <p className="text-text-soft mb-6">Your relationship, your data — always on your device.</p>

      <div className="flex flex-col gap-4">
        <Card>
          <h2 className="text-heading mb-1">Appearance</h2>
          <p className="text-text-soft mb-4">Choose how Aveyra looks. Dark mode is fully supported.</p>
          <ThemeToggle />
        </Card>

        <Card>
          <h2 className="text-heading mb-1">Your data stays yours</h2>
          <p className="text-text-soft mb-4">
            Export a copy of everything you&apos;ve saved as a file you own, or restore from one.
            Because a browser can clear its storage, keeping an occasional backup is the surest way
            to protect your memories. (Profile, lock, and Recently Deleted arrive as the app grows.)
          </p>
          <DataControls />
        </Card>
      </div>
    </section>
  );
}
