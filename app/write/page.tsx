'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Card, EmptyState, Input, Textarea } from '@/components/ui';
import { createEntry, getEntries } from '@/lib/journal';
import type { JournalEntry } from '@/lib/database/types';


export default function WritePage() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setEntries(await getEntries());
  }
  useEffect(() => {
    void refresh();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await createEntry({ title, content });
      setTitle('');
      setContent('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="write-heading" className="flex flex-col gap-5 max-w-prose">
      <div>
        <h1 id="write-heading" className="text-display mb-2">
          Write
        </h1>
        <p className="text-text-soft">A private space for your own thoughts — just for you.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <Input
          label="Title (optional)"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="A word or two, if you like"
        />
        <Textarea
          label="Your entry"
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          error={error ?? undefined}
        />
        <div>
          <Button type="submit" disabled={busy || content.trim() === ''}>
            {busy ? 'Saving…' : 'Save entry'}
          </Button>
        </div>
      </form>

      {entries !== null && entries.length === 0 && (
        <EmptyState
          symbol="🕯️"
          title="Nothing here yet"
          description="Your reflections will stay right here, private to you."
        />
      )}

      {entries !== null && entries.length > 0 && (
        <ol className="flex flex-col gap-4" aria-label="Your entries">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Card className="flex flex-col gap-2">
                <time
                  dateTime={new Date(entry.created_at).toISOString()}
                  className="text-label text-text-mute"
                >
                  {new Date(entry.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {entry.title && <h2 className="text-heading leading-snug">{entry.title}</h2>}
                <p className="text-text-soft whitespace-pre-wrap">{entry.content}</p>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
