import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui';

export const metadata: Metadata = { title: 'Story' };

/**
 * Story — the compounding archive: the timeline of entries, memories, and
 * milestones. Empty until the first moment is saved (Constitution Part 5 §5).
 */
export default function StoryPage() {
  return (
    <section aria-labelledby="story-heading">
      <h1 id="story-heading" className="text-display mb-2">
        Story
      </h1>
      <p className="text-text-soft mb-6">Everything the two of you choose to keep, in one place.</p>
      <EmptyState
        symbol="📖"
        title="Your story starts here"
        description="Saved answers and memories will gather here over time. The first entry will be the day your relationship began."
      />
    </section>
  );
}
