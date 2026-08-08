'use client';

import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { useOnboarding } from '@/lib/relationship/context';

/**
 * What a screen shows when it has no relationship to work with.
 *
 * Several screens are meaningless without one — there is no "today's verse for
 * two people" if there is only one. They used to render their heading and then
 * nothing at all, which reads as a broken page rather than an unfinished setup.
 *
 * Two different situations, and they must not look the same:
 *  - **still resolving** — say so and wait;
 *  - **resolved, and there genuinely isn't one** — say that, and offer the way
 *    out, rather than leaving someone staring at an empty screen wondering
 *    what they did wrong.
 *
 * Returns null when a relationship exists, so callers can render it
 * unconditionally above their content.
 */
export function NeedsSpace({ what }: { what: string }) {
  const { onboarded, relationship } = useOnboarding();

  if (relationship) return null;

  if (onboarded === null) {
    return (
      <p className="text-text-mute" role="status">
        One moment…
      </p>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="font-medium">Your space isn&apos;t set up yet</p>
        <p className="text-text-soft text-label">
          {what} needs the two of you. Once your space exists and {''}
          your partner has joined, this page comes to life.
        </p>
      </div>
      <div>
        <Link href="/onboarding">
          <Button variant="secondary" size="sm">
            Finish setting up
          </Button>
        </Link>
      </div>
    </Card>
  );
}
