import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui';

export const metadata: Metadata = { title: 'Write' };

/**
 * Write — a private space for free journaling, letters, and unprompted entries.
 * Empty state until the first entry is written (Constitution Part 5 §6).
 */
export default function WritePage() {
  return (
    <section aria-labelledby="write-heading">
      <h1 id="write-heading" className="text-display mb-2">
        Write
      </h1>
      <p className="text-text-soft mb-6">A quiet page that is only ever yours.</p>
      <EmptyState
        symbol="✍️"
        title="Nothing written yet"
        description="This is a private space to write freely — a thought, a letter, a feeling. What you write here saves as you go."
      />
    </section>
  );
}
