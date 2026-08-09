'use client';

import { Btn, Card, IBookmark, ICheck, IEdit2, LoadingState, EmptyState } from './primitives';
import { useDaily } from '@/lib/daily';
import { useState } from 'react';

/**
 * TodayScreenAdapter: Connects the Figma design with the backend useDaily hook.
 * Renders the four-state UI (loading → no space → answering/waiting/revealed → error).
 */
export function TodayScreenAdapter() {
  const daily = useDaily();
  const { state, loading, draft, setDraft, editing, startEdit, cancelEdit, submit, saveMemory, busy, error, presence, suggestion, partnerName } = daily;
  const [confirmSave, setConfirmSave] = useState(false);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // No relationship/space yet
  if (!state) {
    return (
      <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
        <EmptyState
          icon="💕"
          title="Today needs the two of you"
          body="Once your partner has joined, the question and your shared answers appear here."
        />
      </div>
    );
  }

  // Determine UI state based on answer status
  const hasMyAnswer = !!state.myAnswer;
  const hasPartnerAnswer = !!state.partnerAnswer;
  const isRevealed = hasMyAnswer && hasPartnerAnswer;

  const formatDate = () => {
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return formatter.format(new Date());
  };

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      {/* Offline notice */}
      {!daily.online && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'var(--color-well)', color: 'var(--color-muted)', borderLeft: '2px solid var(--color-bronze)' }}>
          {"You're offline. New replies will appear once you're back online."}
        </div>
      )}

      {/* Presence indicator - shows who answered today */}
      {presence.lines.length > 0 && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'var(--color-well)', color: 'var(--color-muted)', borderLeft: '2px solid var(--color-bronze)' }}>
          {presence.lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {/* Date */}
      <div className="mb-8">
        <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500 }}>
          {formatDate()}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15, marginTop: 4 }}>
          Today
        </h1>
      </div>

      {/* Question card */}
      <Card className="mb-6">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>
          Question for today
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.35 }}>
          {state.question.text}
        </div>
      </Card>

      {/* Answering state - user is drafting */}
      {!hasMyAnswer && !editing && (
        <div className="flex flex-col gap-4">
          <textarea
            rows={6}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={"Write whatever comes. There's no wrong answer."}
            aria-label="Your answer"
            className="w-full rounded-2xl px-5 py-4 text-base leading-relaxed"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-edge)',
              color: 'var(--color-ink)',
              fontSize: 16,
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
          />
          <div className="flex justify-between items-center gap-4">
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              {hasPartnerAnswer ? `${partnerName} answered today. Your turn.` : `${partnerName} hasn't answered yet either.`}
            </span>
            <Btn onClick={submit} disabled={busy || draft.trim().length < 10}>
              Submit answer
              <span className="sr-only">Share your answer</span>
            </Btn>
          </div>
          {error && <div style={{ fontSize: 13, color: 'var(--color-alert)', textAlign: 'center' }}>{error}</div>}
        </div>
      )}

      {/* Editing state - user is re-editing their existing answer */}
      {!hasMyAnswer && editing && (
        <div className="flex flex-col gap-4">
          <textarea
            rows={6}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={"Write whatever comes. There's no wrong answer."}
            className="w-full rounded-2xl px-5 py-4 text-base leading-relaxed"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-accent)',
              color: 'var(--color-ink)',
              fontSize: 16,
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
          />
          <div className="flex justify-between items-center gap-4">
            <Btn variant="quiet" onClick={cancelEdit}>
              Cancel
            </Btn>
            <Btn onClick={submit} disabled={busy || draft.trim().length < 10}>
              Save & share
            </Btn>
          </div>
          {error && <div style={{ fontSize: 13, color: 'var(--color-alert)', textAlign: 'center' }}>{error}</div>}
        </div>
      )}

      {/* Waiting state - user answered, waiting for partner */}
      {hasMyAnswer && !hasPartnerAnswer && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-bronze)', marginBottom: 8 }}>Your answer</div>
                <div style={{ fontSize: 16, color: 'var(--color-ink)', lineHeight: 1.6 }}>
                  {state.myAnswer?.content}
                </div>
              </div>
              <button className="shrink-0 p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
                onClick={startEdit}
                aria-label="Edit answer">
                <IEdit2 size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 py-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
            <span style={{ fontSize: 14, color: 'var(--color-muted)', fontStyle: 'italic' }}>
              Waiting for {partnerName}…
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-edge)' }} />
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>You can still change this until reveal.</div>
          {daily.dev.enabled && (
            <div className="flex justify-center pt-2">
              <Btn variant="quiet" onClick={() => void daily.dev.simulatePartner()}>
                Simulate partner answered
              </Btn>
            </div>
          )}
        </div>
      )}

      {/* Revealed state - both have answered */}
      {isRevealed && (
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* My answer */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-tint)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 8 }}>You</div>
              <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>
                {state.myAnswer?.content}
              </div>
            </div>
            {/* Partner's answer */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-well)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-bronze)', marginBottom: 8 }}>{partnerName}</div>
              <div style={{ fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.65 }}>
                {state.partnerAnswer?.content}
              </div>
            </div>
          </div>
          {!state.saved ? (
            <div className="flex justify-center pt-2">
              {confirmSave ? (
                <Btn variant="secondary" onClick={() => void saveMemory()}>
                  Save memory
                </Btn>
              ) : (
                <Btn variant="secondary" onClick={() => setConfirmSave(true)}>
                  <IBookmark size={16} />
                  Save this as a memory
                  <span className="sr-only">Save as a memory</span>
                </Btn>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 pt-2" style={{ fontSize: 14, color: 'var(--color-accent)', fontWeight: 600 }}>
              <ICheck size={16} />
              Saved to memories
              <span className="sr-only">Saved to your story</span>
            </div>
          )}
          <div className="text-center" style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            See you tomorrow.
          </div>
        </div>
      )}

      {/* Daily suggestion — always visible at bottom */}
      {suggestion && (
        <div className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--color-edge)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 8 }}>
            Something to try today
          </div>
          <div style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>
            {suggestion.text}
          </div>
        </div>
      )}
    </div>
  );
}
