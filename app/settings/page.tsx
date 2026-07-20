import type { Metadata } from 'next';
import { Card } from '@/components/ui';
import { ThemeToggle } from '@/components/app/ThemeToggle';

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
          <p className="text-text-soft">
            Aveyra stores everything on this device. Profile, lock, storage, export &amp; import, and
            Recently Deleted arrive as the app grows — nothing here ever leaves without you.
          </p>
        </Card>
      </div>
    </section>
  );
}
