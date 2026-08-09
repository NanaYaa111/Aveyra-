'use client';

import { Btn, Card, LoadingState, EmptyState } from './primitives';
import { useNotes } from '@/lib/notes/useNotes';
import { useOnboarding } from '@/lib/relationship/context';
import { NOTE_KIND_LABELS } from '@/lib/notes';
import { NOTE_KINDS, type Note } from '@/lib/database/types';
import Link from 'next/link';

export function NotesScreenAdapter() {
  const { relationship, onboarded } = useOnboarding();
  const n = useNotes();
  const { notes, loading, writing, setWriting, content, setContent, saveNote, acknowledgeNote, busy, error, partnerName } = n;

  if (loading) {
    return <LoadingState />;
  }

  if (!relationship) {
    if (onboarded === null) {
      return <LoadingState />;
    }
    return (
      <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
        <div className="mb-8">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
            Notes
          </div>
        </div>
        <Card className="mb-6">
          <div className="flex flex-col gap-3">
            <div>
              <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--color-ink)' }}>{"Your space isn't set up yet"}</p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Notes needs the two of you. Once your space exists and your partner has joined, this page comes to life.
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

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Notes
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>Say the thing, and say what kind of thing it is — so it never arrives as a surprise.</div>
      </div>

      {writing !== null ? (
        <Card className="mb-6">
          <div className="flex flex-col gap-3">
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-well)' }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>
                <span aria-hidden>{NOTE_KIND_LABELS[writing].emoji}</span> {NOTE_KIND_LABELS[writing].title}
              </p>
              <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>{NOTE_KIND_LABELS[writing].prompt}</p>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={NOTE_KIND_LABELS[writing].placeholder}
              autoFocus
              rows={6}
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: 'var(--color-well)',
                border: '1px solid var(--color-edge)',
                color: 'var(--color-ink)',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
            />
            <div className="flex gap-2">
              <Btn onClick={() => void saveNote()} disabled={busy || !content.trim()}>
                {busy ? 'Sending…' : `Send to ${partnerName}`}
              </Btn>
              <Btn variant="quiet" onClick={() => { setWriting(null); setContent(''); }}>
                Cancel
              </Btn>
            </div>
            {error && <div style={{ fontSize: 13, color: 'var(--color-alert)' }}>{error}</div>}
          </div>
        </Card>
      ) : (
        <div className="mb-6 flex flex-col gap-2">
          {NOTE_KINDS.map(kind => {
            const k = NOTE_KIND_LABELS[kind];
            return (
              <button
                key={kind}
                onClick={() => setWriting(kind)}
                className="text-left rounded-lg border p-3 transition-colors"
                style={{
                  borderColor: 'var(--color-edge)',
                  backgroundColor: 'var(--color-surface)',
                  minHeight: 44,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                  <span aria-hidden style={{ marginRight: 8 }}>{k.emoji}</span>
                  {k.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{k.prompt}</div>
              </button>
            );
          })}
        </div>
      )}

      {notes && notes.length === 0 && (
        <EmptyState
          icon="🤍"
          title="Nothing here yet"
          body="Whatever needs saying can start here."
        />
      )}

      {notes && notes.length > 0 && (
        <div className="flex flex-col gap-3">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} partnerName={partnerName} onAcknowledge={() => void acknowledgeNote(note.id)} busy={busy} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, partnerName, onAcknowledge, busy }: { note: Note; partnerName: string; onAcknowledge: () => void; busy: boolean }) {
  const k = NOTE_KIND_LABELS[note.kind];
  const theirs = note.author !== 'partner_one';

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)' }}>
          <span aria-hidden>{k.emoji}</span> {k.title}
        </p>
        <time style={{ fontSize: 12, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
          {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </time>
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 8 }}>{theirs ? partnerName : 'You'}</p>
      <p style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 12 }}>{note.content}</p>

      {theirs && note.acknowledged_at === null && (
        <Btn variant="quiet" onClick={onAcknowledge} disabled={busy}>
          {busy ? '…' : "I've read this"}
        </Btn>
      )}
      {theirs && note.acknowledged_at !== null && (
        <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>Read</p>
      )}
    </Card>
  );
}
