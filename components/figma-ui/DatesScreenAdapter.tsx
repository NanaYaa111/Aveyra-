'use client';

import { Btn, Card, ICheck, ITrash, LoadingState, EmptyState } from './primitives';
import { useDates } from '@/lib/dates/useDates';
import type { DatePlan } from '@/lib/database/types';

export function DatesScreenAdapter() {
  const d = useDates();
  const { plans, grouped, loading, title, setTitle, when, setWhen, addPlan, completePlan, deletePlan, busy, error } = d;

  if (loading) {
    return <LoadingState />;
  }

  if (!grouped) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Dates
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>Things to do together.</div>
      </div>

      {/* Add form */}
      <Card className="mb-6">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="A walk, a film, that little restaurant…"
            className="w-full rounded-xl px-4 py-2.5 text-sm"
            style={{
              backgroundColor: 'var(--color-well)',
              border: '1px solid var(--color-edge)',
              color: 'var(--color-ink)',
              fontSize: 14,
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
          />
          <div className="flex items-end gap-2">
            <input
              type="date"
              value={when}
              onChange={e => setWhen(e.target.value)}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm"
              style={{
                backgroundColor: 'var(--color-well)',
                border: '1px solid var(--color-edge)',
                color: 'var(--color-ink)',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
            />
            <Btn onClick={() => void addPlan()} disabled={busy || !title.trim()}>
              {busy ? 'Adding…' : 'Add'}
            </Btn>
          </div>
          {error && <div style={{ fontSize: 13, color: 'var(--color-alert)' }}>{error}</div>}
        </div>
      </Card>

      {plans && plans.length === 0 && (
        <EmptyState
          icon="🌿"
          title="No plans yet"
          body="Start with one small idea. It doesn't need a date."
        />
      )}

      {/* Coming up */}
      {grouped.planned.length > 0 && (
        <div className="mb-6">
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>Coming up</div>
          <Card>
            <div className="flex flex-col">
              {grouped.planned.map((p, i) => (
                <PlanRow key={p.id} plan={p} onDone={() => void completePlan(p.id)} onDelete={() => void deletePlan(p.id)} isLast={i === grouped.planned.length - 1} busy={busy} />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Ideas */}
      {grouped.ideas.length > 0 && (
        <div className="mb-6">
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>Ideas</div>
          <Card>
            <div className="flex flex-col">
              {grouped.ideas.map((p, i) => (
                <PlanRow key={p.id} plan={p} onDone={() => void completePlan(p.id)} onDelete={() => void deletePlan(p.id)} isLast={i === grouped.ideas.length - 1} busy={busy} />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Done */}
      {grouped.done.length > 0 && (
        <div className="mb-6">
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: 12 }}>Done together</div>
          <Card>
            <div className="flex flex-col">
              {grouped.done.map((p, i) => (
                <PlanRow key={p.id} plan={p} onDone={() => void completePlan(p.id)} onDelete={() => void deletePlan(p.id)} isLast={i === grouped.done.length - 1} busy={busy} />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function PlanRow({ plan, onDone, onDelete, isLast, busy }: { plan: DatePlan; onDone: () => void; onDelete: () => void; isLast: boolean; busy: boolean }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--color-edge)', borderBottomWidth: isLast ? 0 : 1 }}>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 15, fontWeight: 500, color: plan.status === 'done' ? 'var(--color-muted)' : 'var(--color-ink)', textDecoration: plan.status === 'done' ? 'line-through' : 'none' }}>
          {plan.title}
        </div>
        {plan.planned_for && (
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
            {new Date(plan.planned_for).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {plan.status !== 'done' && (
          <button onClick={onDone} disabled={busy}
            className="p-2 rounded-lg transition-colors"
            title="We did this"
            style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1 }}>
            <ICheck size={16} />
          </button>
        )}
        <button onClick={onDelete} disabled={busy}
          className="p-2 rounded-lg transition-colors"
          title="Remove"
          style={{ color: 'var(--color-muted)', background: 'none', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1 }}>
          <ITrash size={15} />
        </button>
      </div>
    </div>
  );
}
