import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui';

export const metadata: Metadata = { title: 'Today' };

/**
 * Today — the daily ritual and home of the app. The daily question, answering,
 * and the reveal will live here (built in a later milestone step). For now the
 * foundation is in place and this destination is honestly empty.
 */
export default function TodayPage() {
  return (
    <section aria-labelledby="today-heading">
      <h1 id="today-heading" className="text-display mb-2">
        Today
      </h1>
      <p className="text-text-soft mb-6">A small, warm moment for the two of you, once a day.</p>
      <EmptyState
        symbol="🌤️"
        title="Your first question is on its way"
        description="Once you set up your relationship, a daily question will appear here — one gentle prompt, answered together."
      />
    </section>
  );
}
