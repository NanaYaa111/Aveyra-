import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * A tiny fluent stub of the Supabase query builder. Each `from(table)` returns a
 * chainable object whose terminal `maybeSingle`/awaited result is scripted per
 * test via `responses`.
 */
const rpc = vi.fn();
const getUser = vi.fn();
let selectResult: Record<string, unknown> | null = null;
let membersResult: Array<{ user_id: string }> = [];
const insert = vi.fn().mockResolvedValue({ error: null });
const upsert = vi.fn().mockResolvedValue({ error: null });

function from(table: string) {
  const builder: Record<string, unknown> = {};
  const chain = () => builder;
  builder.select = chain;
  builder.eq = chain;
  builder.limit = chain;
  builder.insert = insert;
  builder.upsert = upsert;
  builder.maybeSingle = () =>
    Promise.resolve({
      data:
        table === 'relationship_members'
          ? (selectResult ?? null)
          : selectResult,
    });
  // Awaiting the builder (for the members list select) resolves the array.
  builder.then = (resolve: (v: unknown) => unknown) =>
    resolve({ data: table === 'relationship_members' ? membersResult : selectResult });
  return builder;
}

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => ({ auth: { getUser }, rpc, from }),
  isSupabaseConfigured: () => true,
}));

import {
  spCreateSpace,
  spCreateInvite,
  spJoin,
  spGetRelationship,
} from '@/lib/relationship/supabaseRepo';

beforeEach(() => {
  rpc.mockReset().mockResolvedValue({ data: 'rel_1', error: null });
  getUser.mockReset().mockResolvedValue({ data: { user: { id: 'me', email: 'me@x.io' } } });
  insert.mockClear();
  upsert.mockClear();
  selectResult = null;
  membersResult = [];
});

describe('supabase relationship repo', () => {
  it('createSpace upserts the profile and calls the RPC', async () => {
    await spCreateSpace({ yourName: 'Alex', startDate: Date.parse('2025-01-02') });
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'me', display_name: 'Alex' }),
    );
    expect(rpc).toHaveBeenCalledWith('create_space', { start: '2025-01-02' });
  });

  it('createInvite requires a space, then inserts an invitation', async () => {
    selectResult = null; // no membership
    await expect(spCreateInvite()).rejects.toThrow(/create your space/i);

    selectResult = { relationship_id: 'rel_1' };
    const invite = await spCreateInvite();
    expect(invite.code).toMatch(/^[A-Z0-9]{8}$/);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ relationship_id: 'rel_1', inviter_id: 'me' }),
    );
  });

  it('join extracts nothing extra and calls accept_invitation', async () => {
    await spJoin({ yourName: 'Sam', code: 'ABCD2345' });
    expect(rpc).toHaveBeenCalledWith('accept_invitation', { invite_code: 'ABCD2345' });
  });

  it('getRelationship returns null with no membership', async () => {
    selectResult = null;
    expect(await spGetRelationship()).toBeNull();
  });

  it('getRelationship reports linked once a partner is a member', async () => {
    selectResult = { relationship_id: 'rel_1', id: 'rel_1', created_at: '2025-01-01T00:00:00Z', display_name: 'Sam' };
    membersResult = [{ user_id: 'me' }, { user_id: 'partner' }];
    const rel = await spGetRelationship();
    expect(rel?.status).toBe('linked');
    expect(rel?.partner_id).toBe('partner');
  });
});
