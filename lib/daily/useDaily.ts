'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOnboarding } from '../relationship/context';
import { isSupabaseConfigured } from '../auth';
import {
  devAdvanceDay,
  devResetToday,
  devSimulatePartner,
  getToday,
  saveAsMemory,
  submitMyAnswer,
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

  const [state, setState] = useState<DailyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const next = await getToday(relId);
    setState(next);
    setLoading(false);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submit = useCallback(async () => {
    if (!state || busy) return;
    setBusy(true);
    setError(null);
    try {
      await submitMyAnswer(state.question.id, draft);
      setEditing(false);
      setDraft('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }, [state, draft, busy, refresh]);

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
    dev,
    partnerName: relationship?.partner_name || 'your partner',
  };
}
