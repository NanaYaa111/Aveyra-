'use client';

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Button, Card, Input } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useOnboarding } from '@/lib/relationship/context';
import { MOOD_LABELS, getTodayCheckIns, submitCheckIn, subscribeCheckIns } from '@/lib/checkins';
import { MOODS, type CheckIn, type Mood } from '@/lib/database/types';

export default function CheckInPage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [mine, setMine] = useState<CheckIn | null>(null);
  const [partner, setPartner] = useState<CheckIn | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const t = await getTodayCheckIns(relId);
    setMine(t.mine);
    setPartner(t.partner);
    setLoaded(true);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!relId) return;
    return subscribeCheckIns(relId, () => void refresh());
  }, [relId, refresh]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy || !relId || !mood) return;
    setBusy(true);
    setError(null);
    try {
      await submitCheckIn(relId, mood, note);
      setEditing(false);
      setNote('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  const showForm = loaded && (!mine || editing);

  return (
    <section aria-labelledby="checkin-heading" className="flex flex-col gap-5 max-w-prose">
      <div>
        <h1 id="checkin-heading" className="text-display mb-2">
          Check-in
        </h1>
        <p className="text-text-soft">
          How are you arriving today? One word is plenty — it&apos;s a weather report, not a test.
        </p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-label font-medium text-text-soft mb-2">
              Today I&apos;m feeling…
            </legend>
            {/* Native radios (visually hidden) so arrow-key navigation, grouping
                and screen-reader semantics come from the platform, not from us. */}
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map((m) => {
                const selected = mood === m;
                return (
                  <label
                    key={m}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-md border px-3 py-3 min-h-[44px]',
                      'cursor-pointer transition-colors duration-fast ease-emphasis',
                      'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
                      'focus-within:outline-[var(--color-focus)]',
                      selected
                        ? 'border-accent bg-accent-soft text-accent-strong'
                        : 'border-border bg-surface text-text-soft hover:bg-bg-soft',
                    )}
                  >
                    <input
                      type="radio"
                      name="mood"
                      value={m}
                      checked={selected}
                      onChange={() => setMood(m)}
                      className="sr-only"
                    />
                    <span aria-hidden className="text-xl leading-none">
                      {MOOD_LABELS[m].emoji}
                    </span>
                    <span className="text-label font-medium">{MOOD_LABELS[m].label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <Input
            label="A line about it (optional)"
            value={note}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
            placeholder="Anything you'd like them to know"
            error={error ?? undefined}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={busy || !mood}>
              {busy ? 'Sharing…' : 'Share with ' + partnerName}
            </Button>
            {editing && (
              <Button type="button" variant="quiet" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}

      {loaded && mine && !editing && (
        <CheckInCard
          heading="You"
          checkIn={mine}
          action={
            <Button
              size="sm"
              variant="quiet"
              onClick={() => {
                setMood(mine.mood);
                setNote(mine.note);
                setEditing(true);
              }}
            >
              Change
            </Button>
          }
        />
      )}

      {loaded &&
        (partner ? (
          <CheckInCard heading={partnerName} checkIn={partner} />
        ) : (
          <p className="text-text-mute text-label" role="status">
            {partnerName} hasn&apos;t checked in yet today.
          </p>
        ))}
    </section>
  );
}

function CheckInCard({
  heading,
  checkIn,
  action,
}: {
  heading: string;
  checkIn: CheckIn;
  action?: ReactNode;
}) {
  const m = MOOD_LABELS[checkIn.mood];
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-label text-text-mute">{heading}</p>
        {action}
      </div>
      <p className="text-heading">
        <span aria-hidden>{m.emoji}</span> {m.label}
      </p>
      {checkIn.note && <p className="text-text-soft whitespace-pre-wrap">{checkIn.note}</p>}
    </Card>
  );
}
