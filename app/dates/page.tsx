'use client';

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Card, EmptyState, Input } from '@/components/ui';
import { useOnboarding } from '@/lib/relationship/context';
import { completePlan, createPlan, deletePlan, getPlans, groupPlans, schedulePlan } from '@/lib/dates';
import type { DatePlan } from '@/lib/database/types';

export default function DatesPage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;

  const [plans, setPlans] = useState<DatePlan[] | null>(null);
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setPlans(await getPlans(relId));
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (busy || !relId) return;
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
  }

  const grouped = plans ? groupPlans(plans) : null;

  return (
    <section aria-labelledby="dates-heading" className="flex flex-col gap-5 max-w-prose">
      <div>
        <h1 id="dates-heading" className="text-display mb-2">
          Dates
        </h1>
        <p className="text-text-soft">
          A shared list of things to do together — ideas first, dates when you&apos;re ready.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <Input
          label="What would you like to do together?"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="A walk, a film, that little restaurant…"
          error={error ?? undefined}
        />
        <div className="flex items-end gap-2">
          <Input
            label="When (optional)"
            type="date"
            value={when}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setWhen(e.target.value)}
          />
          <Button type="submit" disabled={busy || title.trim() === ''}>
            {busy ? 'Adding…' : 'Add'}
          </Button>
        </div>
      </form>

      {grouped && plans!.length === 0 && (
        <EmptyState
          symbol="🌿"
          title="No plans yet"
          description="Start with one small idea. It doesn't need a date."
        />
      )}

      {grouped && grouped.planned.length > 0 && (
        <PlanGroup label="Coming up" plans={grouped.planned} onChanged={refresh} />
      )}
      {grouped && grouped.ideas.length > 0 && (
        <PlanGroup label="Ideas" plans={grouped.ideas} onChanged={refresh} />
      )}
      {grouped && grouped.done.length > 0 && (
        <PlanGroup label="Done together" plans={grouped.done} onChanged={refresh} />
      )}
    </section>
  );
}

function PlanGroup({
  label,
  plans,
  onChanged,
}: {
  label: string;
  plans: DatePlan[];
  onChanged: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-label text-text-mute uppercase tracking-wide">{label}</h2>
      <ol className="flex flex-col gap-2" aria-label={label}>
        {plans.map((p) => (
          <li key={p.id}>
            <PlanCard plan={p} onChanged={onChanged} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function PlanCard({ plan, onChanged }: { plan: DatePlan; onChanged: () => Promise<void> }) {
  const [scheduling, setScheduling] = useState(false);
  const [when, setWhen] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
      await onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className={plan.status === 'done' ? 'text-text-mute' : 'text-text'}>{plan.title}</p>
        {plan.planned_for && (
          <time
            dateTime={new Date(plan.planned_for).toISOString()}
            className="text-label text-accent-strong whitespace-nowrap"
          >
            {new Date(plan.planned_for).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
      {plan.notes && <p className="text-label text-text-soft whitespace-pre-wrap">{plan.notes}</p>}

      {plan.status !== 'done' && (
        <div className="flex flex-wrap items-end gap-2">
          {plan.status === 'idea' && !scheduling && (
            <Button size="sm" variant="secondary" onClick={() => setScheduling(true)}>
              Pick a day
            </Button>
          )}
          {scheduling && (
            <>
              <Input
                label="Day"
                hideLabel
                type="date"
                value={when}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setWhen(e.target.value)}
              />
              <Button
                size="sm"
                disabled={busy || !when}
                onClick={() =>
                  run(async () => {
                    await schedulePlan(plan.id, Date.parse(when));
                    setScheduling(false);
                  })
                }
              >
                Set
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() => run(() => completePlan(plan.id))}
          >
            We did this
          </Button>
          <Button
            size="sm"
            variant="quiet"
            disabled={busy}
            onClick={() => run(() => deletePlan(plan.id))}
          >
            Remove
          </Button>
        </div>
      )}
    </Card>
  );
}
