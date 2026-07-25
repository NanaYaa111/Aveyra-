'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Card, Input, Textarea } from '@/components/ui';
import { CATEGORY_LABELS, type CategorySlug } from '@/lib/questions/types';
import { useDaily } from '@/lib/daily';

export default function TodayPage() {
  const d = useDaily();
  const [saveOpen, setSaveOpen] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <section aria-labelledby="today-heading" className="flex flex-col gap-5 max-w-prose">
      <div className="flex items-center justify-between">
        <h1 id="today-heading" className="text-display">
          Today
        </h1>
        {d.state && (
          <span className="text-label text-text-mute" aria-hidden>
            {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {d.loading && (
        <p className="text-text-mute" role="status">
          One moment…
        </p>
      )}

      {!d.loading && d.state && (
        <>
          <Card className="flex flex-col gap-2">
            <span className="text-label text-accent-strong">
              {CATEGORY_LABELS[d.state.question.category as CategorySlug]}
            </span>
            <p className="text-heading leading-snug">{d.state.question.text}</p>
          </Card>

          {/* Answering (unanswered) or editing an already-submitted answer */}
          {(d.state.status === 'answering' || d.editing) && (
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                void d.submit();
              }}
              className="flex flex-col gap-3"
            >
              <Textarea
                label="Your answer"
                hideLabel
                value={d.draft}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => d.setDraft(e.target.value)}
                placeholder="Take your time — there's no right answer."
                autoFocus
                error={d.error ?? undefined}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={d.busy || d.draft.trim() === ''}>
                  {d.busy ? 'Saving…' : 'Submit answer'}
                </Button>
                {d.editing && (
                  <Button type="button" variant="quiet" onClick={d.cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Submitted, waiting for partner — still editable */}
          {d.state.status === 'waiting' && !d.editing && (
            <div className="flex flex-col gap-3">
              <Card className="bg-bg-soft">
                <p className="text-label text-text-mute mb-1">Your answer</p>
                <p className="whitespace-pre-wrap">{d.state.myAnswer?.content}</p>
              </Card>
              <p className="text-text-soft" role="status" aria-live="polite">
                Waiting for {d.partnerName}.
              </p>
              <p className="text-label text-text-mute">You can still change this until reveal.</p>
              <Button variant="secondary" onClick={d.startEdit}>
                Edit answer
              </Button>
            </div>
          )}

          {/* Revealed — both answers, then optional save-as-memory */}
          {d.state.status === 'revealed' && (
            <div className="flex flex-col gap-3">
              <Card className="flex flex-col gap-1">
                <p className="text-label text-text-mute">You</p>
                <p className="whitespace-pre-wrap">{d.state.myAnswer?.content}</p>
              </Card>
              <Card className="flex flex-col gap-1">
                <p className="text-label text-text-mute">{d.partnerName}</p>
                <p className="whitespace-pre-wrap">{d.state.partnerAnswer?.content}</p>
              </Card>

              <p className="text-text-soft" role="status">
                That&apos;s today&apos;s question. See you tomorrow.
              </p>

              {d.state.saved ? (
                <p className="text-label text-accent-strong">Saved to Memories ✓</p>
              ) : saveOpen ? (
                <Card className="flex flex-col gap-3">
                  <Input
                    label="Title (optional)"
                    value={title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder={d.state.question.text}
                  />
                  <div className="flex gap-2">
                    <Button
                      disabled={d.busy}
                      onClick={async () => {
                        await d.saveMemory(title.trim() ? { title } : {});
                        setSaveOpen(false);
                        setTitle('');
                      }}
                    >
                      {d.busy ? 'Saving…' : 'Save memory'}
                    </Button>
                    <Button variant="quiet" onClick={() => setSaveOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setSaveOpen(true)}>Save this as a memory</Button>
                </div>
              )}
            </div>
          )}

          {d.dev.enabled && <DevBar d={d} />}
        </>
      )}
    </section>
  );
}

/** Development-only controls (no backend yet). Excluded once Supabase is wired. */
function DevBar({ d }: { d: ReturnType<typeof useDaily> }) {
  return (
    <div className="mt-4 rounded-md border border-dashed border-border p-3 flex flex-col gap-2">
      <p className="text-label text-text-mute">Development only — not shown in production.</p>
      <div className="flex flex-wrap gap-2">
        {d.state?.status === 'waiting' && (
          <Button size="sm" variant="secondary" onClick={() => void d.dev.simulatePartner()}>
            Simulate partner answered
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={() => void d.dev.advanceDay()}>
          Advance day
        </Button>
        <Button size="sm" variant="quiet" onClick={() => void d.dev.reset()}>
          Reset today
        </Button>
      </div>
    </div>
  );
}
