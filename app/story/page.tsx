'use client';

import { useEffect, useState } from 'react';
import { Card, EmptyState } from '@/components/ui';
import { getMemories } from '@/lib/story';
import { useOnboarding } from '@/lib/relationship/context';
import type { Memory } from '@/lib/database/types';


export default function StoryPage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const [memories, setMemories] = useState<Memory[] | null>(null);

  useEffect(() => {
    let active = true;
    getMemories(relId).then((m) => {
      if (active) setMemories(m);
    });
    return () => {
      active = false;
    };
  }, [relId]);

  return (
    <section aria-labelledby="story-heading" className="flex flex-col gap-5">
      <div>
        <h1 id="story-heading" className="text-display mb-2">
          Story
        </h1>
        <p className="text-text-soft">Everything the two of you choose to keep, in one place.</p>
      </div>

      {memories === null && (
        <p className="text-text-mute" role="status">
          One moment…
        </p>
      )}

      {memories !== null && memories.length === 0 && (
        <EmptyState
          symbol="📖"
          title="Your story starts here"
          description="Save a daily question you loved, and it will be the first entry here."
        />
      )}

      {memories !== null && memories.length > 0 && (
        <ol className="flex flex-col gap-4">
          {memories.map((m) => (
            <li key={m.id}>
              <Card className="flex flex-col gap-2">
                <time
                  dateTime={new Date(m.memory_date).toISOString()}
                  className="text-label text-accent-strong"
                >
                  {new Date(m.memory_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="text-heading leading-snug">{m.title}</h2>
                {m.description && (
                  <p className="text-text-soft whitespace-pre-wrap">{m.description}</p>
                )}
              </Card>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
