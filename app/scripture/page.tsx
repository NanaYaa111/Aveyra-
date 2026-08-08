'use client';

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Card, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useOnboarding } from '@/lib/relationship/context';
import {
  TRANSLATION_NAMES,
  getTranslation,
  setTranslation,
  textOf,
  VERSES,
  type Translation,
} from '@/lib/scripture';
import {
  chooseScripture,
  getRitual,
  respondToScripture,
  subscribeRitual,
  type RitualState,
} from '@/lib/scripture/ritual';

export default function ScripturePage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [translation, setTranslationState] = useState<Translation | null>(null);
  const [ritual, setRitual] = useState<RitualState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (t: Translation) => {
      setRitual(await getRitual(relId, t));
    },
    [relId],
  );

  useEffect(() => {
    const t = getTranslation();
    setTranslationState(t);
    void refresh(t);
  }, [refresh]);

  // Their verse, or their answer, should appear as it lands — reading what the
  // other person said is the second half of the ritual.
  useEffect(() => {
    if (!relId || translation === null) return;
    return subscribeRitual(relId, () => void refresh(translation));
  }, [relId, translation, refresh]);

  if (translation === null || ritual === null) {
    return (
      <section aria-labelledby="scripture-heading" className="flex flex-col gap-5 max-w-prose">
        <h1 id="scripture-heading" className="text-display">
          Scripture
        </h1>
        <p className="text-text-mute" role="status">
          One moment…
        </p>
      </section>
    );
  }

  function chooseTranslation(t: Translation) {
    setTranslation(t);
    setTranslationState(t);
    void refresh(t);
  }

  return (
    <section aria-labelledby="scripture-heading" className="flex flex-col gap-5 max-w-prose">
      <div>
        <h1 id="scripture-heading" className="text-display mb-2">
          Scripture
        </h1>
        <p className="text-text-soft">
          Whoever gets here first chooses today&apos;s verse. The other reads it and says what it
          stirred.
        </p>
      </div>

      {error && (
        <p className="text-error text-label" role="alert">
          {error}
        </p>
      )}

      {ritual.stage === 'open' && relId && (
        <ChooseForm
          suggestion={ritual.suggestion}
          translation={translation}
          busy={busy}
          onSubmit={async (verse, note) => {
            setBusy(true);
            setError(null);
            try {
              await chooseScripture(relId, verse, note);
              await refresh(translation!);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not save.');
            } finally {
              setBusy(false);
            }
          }}
        />
      )}

      {ritual.entry && (
        <Card className="flex flex-col gap-3">
          <p className="text-label text-text-mute">
            {ritual.entry.chooser === 'partner_one' ? 'You chose' : `${partnerName} chose`}
          </p>
          <p className="text-heading leading-relaxed">{ritual.entry.text}</p>
          <p className="text-label text-accent-strong">{ritual.entry.reference}</p>
          {ritual.entry.chooser_note && (
            <p className="text-text-soft whitespace-pre-wrap border-l-2 border-border pl-3">
              {ritual.entry.chooser_note}
            </p>
          )}
        </Card>
      )}

      {ritual.stage === 'waiting' && (
        <p className="text-text-soft" role="status">
          Waiting to hear what {partnerName} makes of it.
        </p>
      )}

      {ritual.stage === 'to-respond' && relId && (
        <RespondForm
          busy={busy}
          onSubmit={async (response) => {
            setBusy(true);
            setError(null);
            try {
              await respondToScripture(relId, response);
              await refresh(translation!);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not save.');
            } finally {
              setBusy(false);
            }
          }}
        />
      )}

      {ritual.stage === 'complete' && ritual.entry && (
        <Card className="flex flex-col gap-2 bg-bg-soft">
          <p className="text-label text-text-mute">
            {ritual.entry.chooser === 'partner_one' ? partnerName : 'You'}
          </p>
          <p className="whitespace-pre-wrap">{ritual.entry.response}</p>
        </Card>
      )}

      <fieldset className="flex flex-col gap-2 pt-2">
        <legend className="text-label font-medium text-text-soft mb-1">Your translation</legend>
        <p className="text-label text-text-mute mb-1">
          Just for you — {partnerName} reads whichever they prefer.
        </p>
        <div className="flex flex-wrap gap-2">
          {(['web', 'kjv'] as Translation[]).map((t) => (
            <label
              key={t}
              className={cn(
                'rounded-pill border px-4 py-2 min-h-[44px] flex items-center cursor-pointer',
                'text-label font-medium transition-colors duration-fast ease-emphasis',
                'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
                'focus-within:outline-[var(--color-focus)]',
                translation === t
                  ? 'border-accent bg-accent-soft text-accent-strong'
                  : 'border-border bg-surface text-text-soft hover:bg-bg-soft',
              )}
            >
              <input
                type="radio"
                name="translation"
                value={t}
                checked={translation === t}
                onChange={() => chooseTranslation(t)}
                className="sr-only"
              />
              {TRANSLATION_NAMES[t]}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

/** First one here picks the verse — suggested, or any other. */
function ChooseForm({
  suggestion,
  translation,
  busy,
  onSubmit,
}: {
  suggestion: { reference: string; text: string };
  translation: Translation;
  busy: boolean;
  onSubmit: (verse: { reference: string; text: string }, note: string) => Promise<void>;
}) {
  const [picking, setPicking] = useState(false);
  const [chosen, setChosen] = useState(suggestion);
  const [note, setNote] = useState('');

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        void onSubmit(chosen, note);
      }}
      className="flex flex-col gap-3"
    >
      <Card className="flex flex-col gap-2">
        <p className="text-label text-text-mute">Today&apos;s suggestion</p>
        <p className="text-heading leading-relaxed">{chosen.text}</p>
        <p className="text-label text-accent-strong">{chosen.reference}</p>
      </Card>

      {picking ? (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto" role="group" aria-label="Choose a verse">
          {VERSES.map((v) => (
            <button
              key={v.ref}
              type="button"
              onClick={() => {
                setChosen({ reference: v.ref, text: textOf(v, translation) });
                setPicking(false);
              }}
              className="text-left rounded-md border border-border bg-surface px-3 py-2 hover:bg-bg-soft min-h-[44px]"
            >
              <span className="text-label text-accent-strong block">{v.ref}</span>
              <span className="text-label text-text-soft">{textOf(v, translation)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <Button type="button" variant="quiet" size="sm" onClick={() => setPicking(true)}>
            Choose a different verse
          </Button>
        </div>
      )}

      <Textarea
        label="Anything you want to say about it (optional)"
        value={note}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
        placeholder="Why this one, today"
      />
      <div>
        <Button type="submit" disabled={busy}>
          {busy ? 'Sharing…' : 'Share this verse'}
        </Button>
      </div>
    </form>
  );
}

/** Second one here answers it. */
function RespondForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (response: string) => Promise<void>;
}) {
  const [response, setResponse] = useState('');
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        void onSubmit(response);
      }}
      className="flex flex-col gap-3"
    >
      <Textarea
        label="What does it stir in you?"
        value={response}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setResponse(e.target.value)}
        placeholder="However it lands. There's no right answer."
        autoFocus
      />
      <div>
        <Button type="submit" disabled={busy || response.trim() === ''}>
          {busy ? 'Sharing…' : 'Share what you think'}
        </Button>
      </div>
    </form>
  );
}
