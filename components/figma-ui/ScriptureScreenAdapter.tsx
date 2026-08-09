'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Btn, Card, LoadingState } from './primitives';
import { useScripture } from '@/lib/scripture/useScripture';
import { useOnboarding } from '@/lib/relationship/context';
import { textOf, TRANSLATION_NAMES, type Translation } from '@/lib/scripture';

export function ScriptureScreenAdapter() {
  const { relationship, onboarded } = useOnboarding();
  const s = useScripture();
  const { translation, ritual, loading, verses, chooseTranslation, chooseVerse, respond, busy, error, partnerName } = s;
  const [picking, setPicking] = useState(false);
  const [chosen, setChosen] = useState(s.ritual?.suggestion);
  const [note, setNote] = useState('');
  const [response, setResponse] = useState('');

  if (!relationship) {
    if (onboarded === null) {
      return <LoadingState />;
    }
    return (
      <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
        <div className="mb-8">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
            Scripture
          </div>
        </div>
        <Card className="mb-6">
          <div className="flex flex-col gap-3">
            <div>
              <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--color-ink)' }}>{"Your space isn't set up yet"}</p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-muted)' }}>
                {`Scripture needs the two of you. Once your space exists and your partner has joined, this page comes to life.`}
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

  if (loading || !translation) {
    return <LoadingState />;
  }

  if (!ritual) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Scripture
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>{"Whoever gets here first chooses today's verse. The other reads it and says what it stirred."}</div>
      </div>

      {error && <div style={{ fontSize: 13, color: 'var(--color-alert)', marginBottom: 16 }}>{error}</div>}

      {/* Choose stage */}
      {ritual.stage === 'open' && chosen && (
        <Card className="mb-6">
          <div className="flex flex-col gap-3">
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-well)' }}>
              <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 8 }}>{"Today&apos;s suggestion"}</p>
              <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, marginBottom: 8 }}>{chosen.text}</p>
              <p style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600 }}>{chosen.reference}</p>
            </div>

            {picking ? (
              <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
                {verses.map((v) => (
                  <button
                    key={v.ref}
                    onClick={() => {
                      setChosen({ reference: v.ref, text: textOf(v, translation) });
                      setPicking(false);
                    }}
                    className="w-full text-left rounded-lg border p-2 mb-2 transition-colors"
                    style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)' }}>{v.ref}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{textOf(v, translation)}</div>
                  </button>
                ))}
              </div>
            ) : (
              <Btn variant="quiet" onClick={() => setPicking(true)}>
                Choose a different verse
              </Btn>
            )}

            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Why this one, today"
              rows={3}
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
            <Btn onClick={() => void chooseVerse(chosen, note)} disabled={busy}>
              {busy ? 'Sharing…' : 'Share this verse'}
            </Btn>
          </div>
        </Card>
      )}

      {/* Chosen verse display */}
      {ritual.entry && (
        <Card className="mb-6">
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 8 }}>
            {ritual.entry.chooser === 'partner_one' ? 'You chose' : `${partnerName} chose`}
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 8 }}>{ritual.entry.text}</p>
          <p style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600, marginBottom: 12 }}>{ritual.entry.reference}</p>
          {ritual.entry.chooser_note && (
            <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.6, borderLeft: '2px solid var(--color-edge)', paddingLeft: 12 }}>
              {ritual.entry.chooser_note}
            </p>
          )}
        </Card>
      )}

      {/* Waiting */}
      {ritual.stage === 'waiting' && (
        <Card className="mb-6">
          <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>Waiting to hear what {partnerName} makes of it.</p>
        </Card>
      )}

      {/* Respond stage */}
      {ritual.stage === 'to-respond' && (
        <Card className="mb-6">
          <div className="flex flex-col gap-3">
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="However it lands. There's no right answer."
              autoFocus
              rows={4}
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
            <Btn onClick={() => void respond(response)} disabled={busy || !response.trim()}>
              {busy ? 'Sharing…' : 'Share what you think'}
            </Btn>
          </div>
        </Card>
      )}

      {/* Complete - show response */}
      {ritual.stage === 'complete' && ritual.entry && (
        <Card className="mb-6" style={{ backgroundColor: 'var(--color-well)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 8 }}>
            {ritual.entry.chooser === 'partner_one' ? partnerName : 'You'}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{ritual.entry.response}</p>
        </Card>
      )}

      {/* Translation selector */}
      <Card>
        <div className="mb-3">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 8 }}>Your translation</p>
          <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>Just for you — {partnerName} reads whichever they prefer.</p>
        </div>
        <div className="flex gap-2">
          {(['web', 'kjv'] as Translation[]).map((t) => (
            <button
              key={t}
              onClick={() => chooseTranslation(t)}
              className="flex-1 rounded-lg border px-4 py-2.5 transition-colors"
              style={{
                borderColor: translation === t ? 'var(--color-accent)' : 'var(--color-edge)',
                backgroundColor: translation === t ? 'var(--color-tint)' : 'var(--color-surface)',
                color: translation === t ? 'var(--color-accent)' : 'var(--color-ink)',
                fontWeight: translation === t ? 600 : 500,
              }}
            >
              {TRANSLATION_NAMES[t]}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
