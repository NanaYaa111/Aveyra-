'use client';

import { useRef, useEffect, type KeyboardEvent } from 'react';
import { ISend, EmptyState, LoadingState } from './primitives';
import { useMessages } from '@/lib/messages/useMessages';
import { PING_TEXT } from '@/lib/pings';
import { PINGS } from '@/lib/database/types';

export function MessagesScreenAdapter() {
  const m = useMessages();
  const { messages, loading, draft, setDraft, submit, sendPing, busy, error, partnerName } = m;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  if (loading) {
    return <LoadingState />;
  }

  const handleSend = () => {
    if (draft.trim()) {
      void submit();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col pb-16 md:pb-0" style={{ height: '100%' }}>
      {/* Header */}
      <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)' }}>{partnerName}</div>
        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>just the two of you</div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3">
        {messages === null || messages.length === 0 ? (
          <EmptyState icon="💬" title="It's quiet in here." body="Say something small. Small things count." />
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.author === 'partner_one' ? 'items-start' : 'items-end'}`}>
              <div className="max-w-[75%] px-4 py-2.5 rounded-2xl"
                style={{
                  backgroundColor: msg.author === 'partner_one' ? 'var(--color-well)' : 'var(--color-accent)',
                  color: msg.author === 'partner_one' ? 'var(--color-ink)' : 'white',
                  borderRadius: msg.author === 'partner_one' ? '20px 20px 20px 6px' : '20px 20px 6px 20px',
                  fontSize: 15,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                {msg.content}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 3, paddingLeft: msg.author === 'partner_one' ? 4 : 0, paddingRight: msg.author === 'partner_one' ? 0 : 4 }}>
                {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Pings */}
      <div className="shrink-0 px-4 py-2 flex gap-2 overflow-x-auto border-t" style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-surface)', scrollbarWidth: 'none' }}>
        {PINGS.map(ping => (
          <button key={ping}
            onClick={() => void sendPing(ping)}
            disabled={busy}
            className="shrink-0 px-3 py-1.5 rounded-full whitespace-nowrap transition-opacity"
            style={{ backgroundColor: 'var(--color-tint)', color: 'var(--color-accent)', border: '1px solid var(--color-edge)', cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, opacity: busy ? 0.5 : 1 }}>
            <span aria-hidden>{PING_TEXT[ping].emoji}</span> {PING_TEXT[ping].text}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t px-4 py-3 flex gap-3 items-end" style={{ borderColor: 'var(--color-edge)', backgroundColor: 'var(--color-surface)' }}>
        <textarea
          rows={1}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Say something…"}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm leading-relaxed"
          style={{
            backgroundColor: 'var(--color-well)',
            border: '1px solid var(--color-edge)',
            color: 'var(--color-ink)',
            fontSize: 15,
            resize: 'none',
            outline: 'none',
            minHeight: 44,
            maxHeight: 120,
            overflowY: 'auto',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
        />
        <button
          onClick={handleSend}
          disabled={busy || !draft.trim()}
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-opacity shrink-0"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            border: 'none',
            opacity: draft.trim() && !busy ? 1 : 0.4,
            cursor: draft.trim() && !busy ? 'pointer' : 'not-allowed',
          }}
          aria-label="Send">
          <ISend size={16} />
        </button>
      </div>
      {error && <div style={{ fontSize: 13, color: 'var(--color-alert)', textAlign: 'center', padding: '8px' }}>{error}</div>}
    </div>
  );
}
