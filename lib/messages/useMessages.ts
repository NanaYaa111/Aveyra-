'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOnboarding } from '../relationship/context';
import { getMessages, sendMessage, subscribeMessages } from './index';
import { sendPing } from '../pings';
import type { Message, PingKind } from '../database/types';

export function useMessages() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const msgs = await getMessages(relId);
    setMessages(msgs);
    setLoading(false);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!relId) return;
    return subscribeMessages(relId, () => void refresh());
  }, [relId, refresh]);

  const submit = useCallback(async () => {
    if (!relId || !draft.trim() || busy) return;
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
  }, [relId, draft, busy, refresh]);

  const sendPingAction = useCallback(async (ping: PingKind) => {
    if (!relId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await sendPing(relId, ping);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send.');
    } finally {
      setBusy(false);
    }
  }, [relId, busy, refresh]);

  return {
    messages,
    loading,
    draft,
    setDraft,
    submit,
    sendPing: sendPingAction,
    busy,
    error,
    partnerName,
  };
}
