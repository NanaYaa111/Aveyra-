'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOnboarding } from '../relationship/context';
import { getTodayCheckIns, submitCheckIn, subscribeCheckIns } from './index';
import type { CheckIn, Mood } from '../database/types';

export function useCheckins() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [mine, setMine] = useState<CheckIn | null>(null);
  const [partner, setPartner] = useState<CheckIn | null>(null);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const { mine: m, partner: p } = await getTodayCheckIns(relId);
    setMine(m);
    setPartner(p);
    setLoading(false);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!relId) return;
    return subscribeCheckIns(relId, () => void refresh());
  }, [relId, refresh]);

  const submit = useCallback(async () => {
    if (!relId || !mood || busy) return;
    setBusy(true);
    setError(null);
    try {
      await submitCheckIn(relId, mood, note);
      setMood(null);
      setNote('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save check-in.');
    } finally {
      setBusy(false);
    }
  }, [relId, mood, note, busy, refresh]);

  const setFeeling = useCallback((newMood: Mood | null) => {
    setMood(newMood);
  }, []);

  return {
    mine,
    partner,
    loading,
    mood,
    setMood: setFeeling,
    note,
    setNote,
    submit,
    busy,
    error,
    partnerName,
  };
}
