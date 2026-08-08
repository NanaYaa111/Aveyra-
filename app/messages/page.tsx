'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Button, Card, EmptyState, Input } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useOnboarding } from '@/lib/relationship/context';
import { getMessages, sendMessage, subscribeMessages } from '@/lib/messages';
import { PING_TEXT, pingText, sendPing } from '@/lib/pings';
import { PINGS, type Message, type PingKind } from '@/lib/database/types';

export default function MessagesPage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [messages, setMessages] = useState<Message[] | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    setMessages(await getMessages(relId));
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Live thread: refresh when the partner sends (no-op on the local stub).
  useEffect(() => {
    if (!relId) return;
    return subscribeMessages(relId, () => void refresh());
  }, [relId, refresh]);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages?.length]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (busy || !relId) return;
    setBusy(true);
    setError(null);
    try {
      await sendMessage(relId, draft);
      setDraft('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="messages-heading" className="flex flex-col gap-5 max-w-prose min-h-[60dvh]">
      <div>
        <h1 id="messages-heading" className="text-display mb-2">
          Messages
        </h1>
        <p className="text-text-soft">Just the two of you. No read receipts, no pressure.</p>
      </div>

      <PingBar relId={relId} partnerName={partnerName} onSent={refresh} />

      {messages !== null && messages.length === 0 && (
        <EmptyState
          symbol="🕊️"
          title="It's quiet in here"
          description="Say something small. Small things count."
        />
      )}

      {messages !== null && messages.length > 0 && (
        <ol className="flex flex-col gap-2" aria-label="Conversation">
          {messages.map((m) =>
            m.kind === 'ping' ? (
              <li key={m.id} className="flex justify-center py-1">
                <span className="text-label text-text-soft bg-bg-soft rounded-pill px-3 py-1.5">
                  <span aria-hidden>{pingText(m.content).emoji}</span>{' '}
                  {m.author === 'partner_one' ? 'You' : partnerName}:{' '}
                  {pingText(m.content).text}
                </span>
              </li>
            ) : (
            <li
              key={m.id}
              className={cn('flex', m.author === 'partner_one' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2',
                  m.author === 'partner_one'
                    ? 'bg-accent text-text-on-accent rounded-br-sm'
                    : 'bg-bg-soft text-text rounded-bl-sm',
                )}
              >
                <p className="sr-only">
                  {m.author === 'partner_one' ? 'You' : partnerName} said:
                </p>
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <time
                  dateTime={new Date(m.created_at).toISOString()}
                  className={cn(
                    'block text-right text-[0.6875rem] mt-1',
                    m.author === 'partner_one' ? 'text-text-on-accent/70' : 'text-text-mute',
                  )}
                >
                  {new Date(m.created_at).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </time>
              </div>
            </li>
            ),
          )}
        </ol>
      )}
      <div ref={endRef} />

      <form onSubmit={handleSend} className="flex items-end gap-2 sticky bottom-24 sm:bottom-4">
        <div className="flex-1">
          <Input
            label={`Message ${partnerName}`}
            hideLabel
            value={draft}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
            placeholder="Write a message…"
            autoComplete="off"
            error={error ?? undefined}
          />
        </div>
        <Button type="submit" disabled={busy || draft.trim() === ''}>
          Send
        </Button>
      </form>
    </section>
  );
}

/**
 * One tap for the times you miss someone and can't find the words. The list is
 * short and closed on purpose — picking from six is easy where a blank box is
 * not, which is the whole reason the feature exists.
 */
function PingBar({
  relId,
  partnerName,
  onSent,
}: {
  relId: string | null;
  partnerName: string;
  onSent: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  if (!relId) return null;

  async function send(ping: PingKind) {
    if (busy || !relId) return;
    setBusy(true);
    setNote(null);
    try {
      await sendPing(relId, ping);
      setOpen(false);
      await onSent();
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not send that.');
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Send a ping
        </Button>
        {note && (
          <p className="text-label text-text-soft mt-2" role="status">
            {note}
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="text-heading leading-snug">No words needed</p>
        <p className="text-label text-text-soft">
          One tap to let {partnerName} know you&apos;re thinking of them. Nothing here asks for a
          reply.
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {PINGS.map((p) => (
          <li key={p}>
            <button
              type="button"
              disabled={busy}
              onClick={() => void send(p)}
              className={cn(
                'flex items-center gap-2 rounded-pill border border-border bg-surface',
                'px-3 py-2 min-h-[44px] text-label font-medium text-text-soft',
                'hover:bg-bg-soft hover:text-text transition-colors duration-fast ease-emphasis',
                'disabled:opacity-50 disabled:pointer-events-none',
              )}
            >
              <span aria-hidden>{PING_TEXT[p].emoji}</span>
              {PING_TEXT[p].text}
            </button>
          </li>
        ))}
      </ul>
      {note && (
        <p className="text-label text-text-soft" role="status">
          {note}
        </p>
      )}
      <div>
        <Button variant="quiet" size="sm" onClick={() => setOpen(false)}>
          Not now
        </Button>
      </div>
    </Card>
  );
}
