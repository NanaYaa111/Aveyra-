import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { createPlan, getPlans, schedulePlan, completePlan, deletePlan, groupPlans } from '@/lib/dates';
import type { DatePlan } from '@/lib/database/types';

let service: DatabaseService;
let db: AveyraDB;
const REL = 'rel_1';

beforeEach(() => {
  db = new AveyraDB('aveyra-dates-' + crypto.randomUUID());
  __setDB(db);
  service = new DatabaseService(db);
});

describe('date planner', () => {
  it('adds an idea with no date', async () => {
    await createPlan(REL, { title: '  A walk by the river  ' }, service);
    const plans = await getPlans(REL, service);
    expect(plans).toHaveLength(1);
    expect(plans[0]!.title).toBe('A walk by the river');
    expect(plans[0]!.status).toBe('idea');
    expect(plans[0]!.planned_for).toBeNull();
  });

  it('adds a plan when given a date', async () => {
    const when = Date.parse('2026-09-01');
    await createPlan(REL, { title: 'Dinner', planned_for: when }, service);
    const [plan] = await getPlans(REL, service);
    expect(plan!.status).toBe('planned');
    expect(plan!.planned_for).toBe(when);
  });

  it('refuses an empty title', async () => {
    await expect(createPlan(REL, { title: '   ' }, service)).rejects.toThrow(/name/i);
  });

  it('scheduling an idea turns it into a plan', async () => {
    await createPlan(REL, { title: 'Museum' }, service);
    const [idea] = await getPlans(REL, service);
    const when = Date.parse('2026-10-05');
    await schedulePlan(idea!.id, when, service);

    const [updated] = await getPlans(REL, service);
    expect(updated!.status).toBe('planned');
    expect(updated!.planned_for).toBe(when);
  });

  it('completing a plan marks it done, keeping it in the list', async () => {
    await createPlan(REL, { title: 'Picnic' }, service);
    const [plan] = await getPlans(REL, service);
    await completePlan(plan!.id, service);

    const [done] = await getPlans(REL, service);
    expect(done!.status).toBe('done');
  });

  it('deleting is a soft delete — it leaves the live list but is recoverable', async () => {
    await createPlan(REL, { title: 'Cinema' }, service);
    const [plan] = await getPlans(REL, service);
    await deletePlan(plan!.id, service);

    expect(await getPlans(REL, service)).toHaveLength(0);
    const deleted = await service.recentlyDeleted();
    expect(deleted.find((d) => d.id === plan!.id)?.label).toBe('Cinema');
  });

  it('encrypts the title at rest — the raw row is not plaintext', async () => {
    await createPlan(REL, { title: 'Secret spot' }, service);
    const [plan] = await getPlans(REL, service);

    // The service read path decrypts…
    expect(plan!.title).toBe('Secret spot');
    // …while the row sitting in IndexedDB does not hold the plaintext.
    const raw = await db.datePlans.get(plan!.id);
    expect(raw!.title).not.toBe('Secret spot');
  });
});

describe('groupPlans', () => {
  const plan = (p: Partial<DatePlan>): DatePlan =>
    ({
      id: crypto.randomUUID(),
      relationship_id: REL,
      title: 't',
      notes: '',
      status: 'idea',
      planned_for: null,
      created_at: 0,
      updated_at: 0,
      deleted_at: null,
      schema_version: 1,
      version: 1,
      ...p,
    }) as DatePlan;

  it('splits by status and orders upcoming soonest-first', () => {
    const later = plan({ status: 'planned', planned_for: Date.parse('2026-12-01') });
    const sooner = plan({ status: 'planned', planned_for: Date.parse('2026-09-01') });
    const grouped = groupPlans([later, sooner, plan({}), plan({ status: 'done' })]);

    expect(grouped.planned.map((p) => p.planned_for)).toEqual([
      sooner.planned_for,
      later.planned_for,
    ]);
    expect(grouped.ideas).toHaveLength(1);
    expect(grouped.done).toHaveLength(1);
  });
});
