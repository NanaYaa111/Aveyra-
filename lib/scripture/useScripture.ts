'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOnboarding } from '../relationship/context';
import { getTranslation, setTranslation as setTranslationLocal, type Translation } from './index';
import { getRitual, subscribeRitual, chooseScripture, respondToScripture, type RitualState } from './ritual';
import { VERSES } from './verses';

export function useScripture() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [translation, setTranslationState] = useState<Translation | null>(null);
  const [ritual, setRitual] = useState<RitualState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (t: Translation) => {
      if (!relId) return;
      const r = await getRitual(relId, t);
      setRitual(r);
      setLoading(false);
    },
    [relId],
  );

  useEffect(() => {
    const t = getTranslation();
    setTranslationState(t);
    void refresh(t);
  }, [refresh]);

  useEffect(() => {
    if (!relId || translation === null) return;
    return subscribeRitual(relId, () => void refresh(translation));
  }, [relId, translation, refresh]);

  const chooseTranslation = (t: Translation) => {
    setTranslationLocal(t);
    setTranslationState(t);
    void refresh(t);
  };

  const chooseVerse = useCallback(async (verse: { reference: string; text: string }, note: string) => {
    if (!relId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await chooseScripture(relId, verse, note);
      await refresh(translation!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }, [relId, translation, busy, refresh]);

  const respond = useCallback(async (response: string) => {
    if (!relId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await respondToScripture(relId, response);
      await refresh(translation!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }, [relId, translation, busy, refresh]);

  return {
    translation,
    ritual,
    loading,
    verses: VERSES,
    chooseTranslation,
    chooseVerse,
    respond,
    busy,
    error,
    partnerName,
  };
}
