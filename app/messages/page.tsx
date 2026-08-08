'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Button, EmptyState, Input } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useOnboarding } from '@/lib/relationship/context';
import { getMessages, sendMessage, subscribeMessages } from '@/lib/messages';
import type { Message } from '@/lib/database/types';

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

      {messages !== null && messages.length === 0 && (
        <EmptyState
          symbol="🕊️"
          title="It's quiet in here"
          description="Say something small. Small things count."
        />
      )}

      {messages !== null && messages.length > 0 && (
        <ol className="flex flex-col gap-2" aria-label="Conversation">
          {messages.map((m) => (
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
          ))}
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
