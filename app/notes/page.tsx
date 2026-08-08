'use client';

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Card, EmptyState, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useOnboarding } from '@/lib/relationship/context';
import {
  NOTE_KIND_LABELS,
  acknowledgeNote,
  createNote,
  getNotes,
  subscribeNotes,
} from '@/lib/notes';
import { NOTE_KINDS, type Note, type NoteKind } from '@/lib/database/types';

export default function NotesPage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [notes, setNotes] = useState<Note[] | null>(null);
  const [writing, setWriting] = useState<NoteKind | null>(null);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setNotes(await getNotes(relId));
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // A note should arrive on its own; no-op without a backend.
  useEffect(() => {
    if (!relId) return;
    return subscribeNotes(relId, () => void refresh());
  }, [relId, refresh]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!relId || !writing || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createNote(relId, writing, content);
      setContent('');
      setWriting(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="notes-heading" className="flex flex-col gap-5 max-w-prose">
      <div>
        <h1 id="notes-heading" className="text-display mb-2">
          Notes
        </h1>
        <p className="text-text-soft">
          Say the thing, and say what kind of thing it is — so it never arrives as a surprise.
        </p>
      </div>

      {writing === null ? (
        <ul className="flex flex-col gap-2">
          {NOTE_KINDS.map((kind) => {
            const k = NOTE_KIND_LABELS[kind];
            return (
              <li key={kind}>
                <button
                  type="button"
                  onClick={() => setWriting(kind)}
                  disabled={!relId}
                  className={cn(
                    'w-full text-left rounded-lg border border-border bg-surface',
                    'px-4 py-3 min-h-[44px] flex items-start gap-3',
                    'hover:bg-bg-soft transition-colors duration-fast ease-emphasis',
                    'disabled:opacity-50 disabled:pointer-events-none',
                  )}
                >
                  <span aria-hidden className="text-xl leading-none mt-0.5">
                    {k.emoji}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">{k.title}</span>
                    <span className="text-label text-text-soft">{k.prompt}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <form onSubmit={save} className="flex flex-col gap-3">
          <Card className="flex flex-col gap-1">
            <p className="font-medium">
              <span aria-hidden>{NOTE_KIND_LABELS[writing].emoji}</span>{' '}
              {NOTE_KIND_LABELS[writing].title}
            </p>
            <p className="text-label text-text-soft">{NOTE_KIND_LABELS[writing].prompt}</p>
          </Card>
          <Textarea
            label="Your note"
            hideLabel
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder={NOTE_KIND_LABELS[writing].placeholder}
            autoFocus
            error={error ?? undefined}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={busy || content.trim() === ''}>
              {busy ? 'Sending…' : `Send to ${partnerName}`}
            </Button>
            <Button
              type="button"
              variant="quiet"
              onClick={() => {
                setWriting(null);
                setContent('');
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {notes !== null && notes.length === 0 && (
        <EmptyState
          symbol="🤍"
          title="Nothing here yet"
          description="Whatever needs saying can start here."
        />
      )}

      {notes !== null && notes.length > 0 && (
        <ol className="flex flex-col gap-3" aria-label="Notes">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteCard note={note} partnerName={partnerName} onChanged={refresh} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function NoteCard({
  note,
  partnerName,
  onChanged,
}: {
  note: Note;
  partnerName: string;
  onChanged: () => Promise<void>;
}) {
  const k = NOTE_KIND_LABELS[note.kind];
  const theirs = note.author !== 'partner_one';

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label text-accent-strong">
          <span aria-hidden>{k.emoji}</span> {k.title}
        </p>
        <time
          dateTime={new Date(note.created_at).toISOString()}
          className="text-label text-text-mute whitespace-nowrap"
        >
          {new Date(note.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      <p className="text-label text-text-mute">{theirs ? partnerName : 'You'}</p>
      <p className="whitespace-pre-wrap">{note.content}</p>

      {/* Only the reader sees this, and only on the other person's notes — the
          author is never shown whether it was read. */}
      {theirs &&
        (note.acknowledged_at === null ? (
          <div>
            <Button
              size="sm"
              variant="quiet"
              onClick={async () => {
                await acknowledgeNote(note.id);
                await onChanged();
              }}
            >
              I&apos;ve read this
            </Button>
          </div>
        ) : (
          <p className="text-label text-text-mute">Read</p>
        ))}
    </Card>
  );
}
