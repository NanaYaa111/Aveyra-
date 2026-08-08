'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnboarding } from '../relationship/context';
import { isSupabaseConfigured } from '../auth';
import { useConnection } from '../net/connection';
import { getPresence, type Presence } from '../presence';
import {
  devAdvanceDay,
  devResetToday,
  devSimulatePartner,
  getToday,
  saveAsMemory,
  submitMyAnswer,
  subscribeToday,
  type DailyState,
} from './service';

/**
 * Drives the Today screen: loads today's question + exchange, holds the draft,
 * and exposes the actions (submit/edit, save-as-memory) plus the dev-only
 * controls (simulate partner, advance day, reset) that exist while there is no
 * backend. Reads the relationship from onboarding context.
 */
export function useDaily() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const { online } = useConnection();

  const [state, setState] = useState<DailyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presence, setPresence] = useState<Presence>({ lines: [] });

  const partnerName = relationship?.partner_name || 'your partner';

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const next = await getToday(relId);
    setState(next);
    setLoading(false);
    // Read once on arrival; there is no unread state to keep in step.
    setPresence(await getPresence(relId, next, partnerName));
  }, [relId, partnerName]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Live reveal: when the partner answers on their device, refresh so today's
  // exchange updates without a manual reload. No-op on the local stub.
  useEffect(() => {
    if (!relId) return;
    const unsubscribe = subscribeToday(relId, () => void refresh());
    return unsubscribe;
  }, [relId, refresh]);

  // Coming back online may mean a realtime event was missed while disconnected,
  // so reconcile — but only on a real offline→online transition, not the initial
  // mount (the mount fetch above already covers that).
  const wasOnline = useRef(true);
  useEffect(() => {
    if (online && !wasOnline.current) void refresh();
    wasOnline.current = online;
  }, [online, refresh]);

  const submit = useCallback(async () => {
    if (!state || !relId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await submitMyAnswer(relId, state.question.id, draft);
      setEditing(false);
      setDraft('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }, [state, relId, draft, busy, refresh]);

  const startEdit = useCallback(() => {
    if (state?.myAnswer) {
      setDraft(state.myAnswer.content);
      setEditing(true);
    }
  }, [state]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setDraft('');
  }, []);

  const saveMemory = useCallback(
    async (opts: { title?: string } = {}) => {
      if (!relId || !state || busy) return;
      setBusy(true);
      try {
        await saveAsMemory(relId, state, { partnerName: relationship?.partner_name, ...opts });
        await refresh();
      } finally {
        setBusy(false);
      }
    },
    [relId, state, relationship, busy, refresh],
  );

  const dev = {
    enabled: !isSupabaseConfigured(),
    simulatePartner: async () => {
      if (!state) return;
      await devSimulatePartner(state.question.id);
      await refresh();
    },
    advanceDay: async () => {
      devAdvanceDay();
      setDraft('');
      setEditing(false);
      await refresh();
    },
    reset: async () => {
      if (!state) return;
      await devResetToday(state.question.id);
      setDraft('');
      setEditing(false);
      await refresh();
    },
  };

  return {
    state,
    loading,
    draft,
    setDraft,
    editing,
    startEdit,
    cancelEdit,
    submit,
    saveMemory,
    busy,
    error,
    online,
    presence,
    dev,
    partnerName,
  };
}
