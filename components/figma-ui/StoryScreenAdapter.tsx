'use client';

import { useOnboarding } from '@/lib/relationship/context';
import { LoadingState, EmptyState, Card, Btn } from './primitives';
import { useState, useEffect, useCallback } from 'react';
import { getMemories, photoUrl } from '@/lib/story';
import type { Memory } from '@/lib/database/types';
import Link from 'next/link';

export function StoryScreenAdapter() {
  const { relationship, onboarded } = useOnboarding();
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

  if (!relationship) {
    if (onboarded === null) {
      return <LoadingState />;
    }
    return (
      <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
        <div className="mb-8">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
            Story
          </h1>
        </div>
        <Card className="mb-6">
          <div className="flex flex-col gap-3">
            <div>
              <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--color-ink)' }}>{"Your space isn't set up yet"}</p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Story needs the two of you. Once your space exists and your partner has joined, this page comes to life.
              </p>
            </div>
            <div>
              <Link href="/onboarding">
                <Btn variant="quiet">Finish setting up</Btn>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Story
        </h1>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>{"Memories you've saved together."}</div>
      </div>

      {memories && memories.length === 0 && (
        <EmptyState
          icon="📖"
          title="Your story starts here"
          body="Save a daily question you loved, or add a memory of your own — it will be the first entry here."
        />
      )}

      {memories && memories.length > 0 && (
        <ol className="flex flex-col gap-4">
          {memories.map((memory) => (
            <li key={memory.id}>
              <MemoryItem memory={memory} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function MemoryItem({ memory }: { memory: Memory }) {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!memory.image_ref) return;
    void photoUrl(memory.image_ref).then(url => setPhotoSrc(url));
  }, [memory.image_ref]);

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)' }}>
      <time
        dateTime={new Date(memory.memory_date).toISOString()}
        style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
        {new Date(memory.memory_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 8 }}>
        {memory.title}
      </h2>
      {photoSrc && (
        <img src={photoSrc} alt={`photo — ${memory.title}`} style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 12 }} />
      )}
      {memory.description && (
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-ink)', whiteSpace: 'pre-wrap' }}>
          {memory.description}
        </p>
      )}
    </div>
  );
}
