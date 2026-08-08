'use client';

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Card, EmptyState, Input, Textarea } from '@/components/ui';
import { createMemory, getMemories, photoUrl } from '@/lib/story';
import { useOnboarding } from '@/lib/relationship/context';
import type { Memory } from '@/lib/database/types';

export default function StoryPage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [adding, setAdding] = useState(false);

  const refresh = useCallback(async () => {
    setMemories(await getMemories(relId));
  }, [relId]);

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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 id="story-heading" className="text-display mb-2">
            Story
          </h1>
          <p className="text-text-soft">Everything the two of you choose to keep, in one place.</p>
        </div>
        {!adding && relId && (
          <Button variant="secondary" onClick={() => setAdding(true)}>
            Add a memory
          </Button>
        )}
      </div>

      {adding && relId && (
        <AddMemoryForm
          relId={relId}
          onDone={async () => {
            setAdding(false);
            await refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {memories === null && (
        <p className="text-text-mute" role="status">
          One moment…
        </p>
      )}

      {memories !== null && memories.length === 0 && (
        <EmptyState
          symbol="📖"
          title="Your story starts here"
          description="Save a daily question you loved, or add a memory of your own — it will be the first entry here."
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
                {m.image_ref && <MemoryPhoto imageRef={m.image_ref} title={m.title} />}
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

/**
 * Release a local object URL. Guarded because `revokeObjectURL` is missing in
 * some environments (jsdom, a few embedded webviews) — failing to free a blob
 * must never take the page down with it.
 */
function releaseUrl(url: string | null | undefined) {
  if (!url?.startsWith('blob:')) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // Nothing to do — the blob is released when the document goes away.
  }
}

/** Resolves and shows a memory's photo (signed URL or local object URL). */
function MemoryPhoto({ imageRef, title }: { imageRef: string; title: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    photoUrl(imageRef).then((u) => {
      if (!active) {
        releaseUrl(u);
        return;
      }
      objectUrl = u;
      setUrl(u);
    });
    return () => {
      active = false;
      releaseUrl(objectUrl);
    };
  }, [imageRef]);

  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export has no image optimizer; blob/signed URLs need a plain img.
    <img
      src={url}
      alt={`Photo — ${title}`}
      className="rounded-md max-h-96 w-auto max-w-full object-contain bg-bg-soft"
    />
  );
}

function AddMemoryForm({
  relId,
  onDone,
  onCancel,
}: {
  relId: string;
  onDone: () => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [when, setWhen] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await createMemory(relId, {
        title,
        description,
        memory_date: when ? Date.parse(when) : Date.now(),
        photo,
      });
      await onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <Input
          label="What happened?"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="The picnic that got rained on"
          autoFocus
          error={error ?? undefined}
        />
        <Textarea
          label="The details (optional)"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="What you want to remember about it"
        />
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="When (optional)"
            type="date"
            value={when}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setWhen(e.target.value)}
          />
          <Input
            label="Photo (optional)"
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy || title.trim() === ''}>
            {busy ? 'Keeping…' : 'Keep this memory'}
          </Button>
          <Button type="button" variant="quiet" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
