'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOnboarding } from '../relationship/context';
import { completePlan, createPlan, deletePlan, getPlans, groupPlans, schedulePlan } from './index';
import type { DatePlan } from '../database/types';

export function useDates() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;

  const [plans, setPlans] = useState<DatePlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const p = await getPlans(relId);
    setPlans(p);
    setLoading(false);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addPlan = useCallback(async () => {
    if (!relId || !title.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createPlan(relId, {
        title,
        planned_for: when ? Date.parse(when) : null,
      });
      setTitle('');
      setWhen('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add that.');
    } finally {
      setBusy(false);
    }
  }, [relId, title, when, busy, refresh]);

  const completePlanAction = useCallback(async (planId: string) => {
    if (!relId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await completePlan(planId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update.');
    } finally {
      setBusy(false);
    }
  }, [relId, busy, refresh]);

  const deletePlanAction = useCallback(async (planId: string) => {
    if (!relId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await deletePlan(planId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete.');
    } finally {
      setBusy(false);
    }
  }, [relId, busy, refresh]);

  const schedulePlanAction = useCallback(async (planId: string, date: number) => {
    if (!relId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await schedulePlan(planId, date);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not schedule.');
    } finally {
      setBusy(false);
    }
  }, [relId, busy, refresh]);

  const grouped = plans ? groupPlans(plans) : null;

  return {
    plans,
    grouped,
    loading,
    title,
    setTitle,
    when,
    setWhen,
    addPlan,
    completePlan: completePlanAction,
    deletePlan: deletePlanAction,
    schedulePlan: schedulePlanAction,
    busy,
    error,
  };
}
