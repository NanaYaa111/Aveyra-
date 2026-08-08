'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useOnboarding } from '@/lib/relationship/context';
import { sendMessage } from '@/lib/messages';
import {
  TRANSLATION_NAMES,
  getTranslation,
  setTranslation,
  textOf,
  verseForDate,
  type Translation,
} from '@/lib/scripture';

export default function ScripturePage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  // Read on the client only: the stored choice isn't available during render on
  // the server, and defaulting differently would flash the wrong translation.
  const [translation, setTranslationState] = useState<Translation | null>(null);
  const [shared, setShared] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTranslationState(getTranslation());
  }, []);

  if (!relId || translation === null) {
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

  const verse = verseForDate(relId);

  function choose(t: Translation) {
    setTranslation(t);
    setTranslationState(t);
  }

  async function share() {
    if (busy || !relId || translation === null) return;
    setBusy(true);
    try {
      await sendMessage(relId, `${verse.ref} — ${textOf(verse, translation)}`);
      setShared(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="scripture-heading" className="flex flex-col gap-5 max-w-prose">
      <div>
        <h1 id="scripture-heading" className="text-display mb-2">
          Scripture
        </h1>
        <p className="text-text-soft">
          The same verse for both of you today. Tomorrow brings another.
        </p>
      </div>

      <Card className="flex flex-col gap-3">
        <p className="text-heading leading-relaxed">{textOf(verse, translation)}</p>
        <p className="text-label text-accent-strong">{verse.ref}</p>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {shared ? (
          <p className="text-label text-accent-strong" role="status">
            Sent to {partnerName} ✓
          </p>
        ) : (
          <Button variant="secondary" onClick={share} disabled={busy}>
            {busy ? 'Sending…' : `Send to ${partnerName}`}
          </Button>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-label font-medium text-text-soft mb-1">
          Your translation
        </legend>
        <p className="text-label text-text-mute mb-1">
          Just for you — {partnerName} reads whichever they prefer.
        </p>
        <div className="flex flex-wrap gap-2">
          {(['web', 'kjv'] as Translation[]).map((t) => {
            const selected = translation === t;
            return (
              <label
                key={t}
                className={cn(
                  'rounded-pill border px-4 py-2 min-h-[44px] flex items-center cursor-pointer',
                  'text-label font-medium transition-colors duration-fast ease-emphasis',
                  'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
                  'focus-within:outline-[var(--color-focus)]',
                  selected
                    ? 'border-accent bg-accent-soft text-accent-strong'
                    : 'border-border bg-surface text-text-soft hover:bg-bg-soft',
                )}
              >
                <input
                  type="radio"
                  name="translation"
                  value={t}
                  checked={selected}
                  onChange={() => choose(t)}
                  className="sr-only"
                />
                {TRANSLATION_NAMES[t]}
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
