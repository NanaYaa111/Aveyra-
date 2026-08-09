'use client';

import { useOnboarding } from '@/lib/relationship/context';
import { LoadingState, EmptyState } from './primitives';
import { useState, useEffect, useCallback } from 'react';
import { getMemories } from '@/lib/story';
import type { Memory } from '@/lib/database/types';

export function StoryScreenAdapter() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;

  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const m = await getMemories(relId);
    setMemories(m);
    setLoading(false);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Story
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>{"Memories you've saved together."}</div>
      </div>

      {memories && memories.length === 0 && (
        <EmptyState
          icon="📖"
          title="No memories yet"
          body="Save moments from your Daily questions and they'll appear here."
        />
      )}

      {memories && memories.length > 0 && (
        <div className="flex flex-col gap-4">
          {memories.map((memory) => (
            <div key={memory.id} className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 8 }}>
                {new Date(memory.memory_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8 }}>
                {memory.title}
              </div>
              {memory.description && (
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-ink)', whiteSpace: 'pre-wrap' }}>
                  {memory.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
