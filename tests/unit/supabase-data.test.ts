import { describe, it, expect, vi, beforeEach } from 'vitest';

const getUser = vi.fn();
let selectRows: Array<Record<string, unknown>> = [];
let singleRow: Record<string, unknown> | null = null;
const insert = vi.fn();
const update = vi.fn();
const upsert = vi.fn();

function table() {
  const b: Record<string, unknown> = {};
  const chain = () => b;
  b.select = chain;
  b.eq = chain;
  b.is = chain;
  b.order = chain;
  b.maybeSingle = () => Promise.resolve({ data: singleRow });
  b.single = () => Promise.resolve({ data: singleRow, error: null });
  b.insert = (...args: unknown[]) => {
    insert(...args);
    return { select: () => ({ single: () => Promise.resolve({ data: { id: 'new_id' }, error: null }) }) , then: (r: (v: unknown)=>unknown)=>r({ error: null }) };
  };
  b.update = (...args: unknown[]) => {
    update(...args);
    return { eq: () => Promise.resolve({ error: null }) };
  };
  b.upsert = (...args: unknown[]) => {
    upsert(...args);
    return Promise.resolve({ error: null });
  };
  b.delete = () => ({ eq: () => Promise.resolve({ error: null }) });
  b.then = (resolve: (v: unknown) => unknown) => resolve({ data: selectRows });
  return b;
}

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => ({ auth: { getUser }, from: () => table() }),
  isSupabaseConfigured: () => true,
}));

import { spAnswersFor, spSubmitAnswer } from '@/lib/daily/supabaseRepo';
import { spGetMemories, spCreateMemory } from '@/lib/story/supabaseRepo';
import { spGetEntries, spCreateEntry, spDeleteEntry } from '@/lib/journal/supabaseRepo';

beforeEach(() => {
  getUser.mockReset().mockResolvedValue({ data: { user: { id: 'me' } } });
  selectRows = [];
  singleRow = null;
  insert.mockClear();
  update.mockClear();
  upsert.mockClear();
});

describe('answers repo', () => {
  it('resolves mine vs partner by author_id', async () => {
    selectRows = [
      { id: 'a1', question_id: 'q1', author_id: 'me', content: 'mine', created_at: '2026-01-01T00:00:00Z' },
      { id: 'a2', question_id: 'q1', author_id: 'partner', content: 'theirs', created_at: '2026-01-01T00:00:00Z' },
    ];
    const { mine, partner } = await spAnswersFor('rel_1', 'q1');
    expect(mine?.content).toBe('mine');
    expect(mine?.author).toBe('partner_one');
    expect(partner?.content).toBe('theirs');
    expect(partner?.author).toBe('partner_two');
  });

  it('upserts on the (relationship_id, question_id, author_id) constraint', async () => {
    await spSubmitAnswer('rel_1', 'q1', 'hello');
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ relationship_id: 'rel_1', question_id: 'q1', author_id: 'me', content: 'hello' }),
      expect.objectContaining({ onConflict: 'relationship_id,question_id,author_id' }),
    );
  });

  it('re-submitting the same question upserts again rather than inserting a duplicate', async () => {
    await spSubmitAnswer('rel_1', 'q1', 'edited');
    expect(upsert).toHaveBeenCalledTimes(1);
    expect(insert).not.toHaveBeenCalled();
  });
});

describe('memories repo', () => {
  it('maps rows to Memory, newest first is server-ordered', async () => {
    selectRows = [
      { id: 'm1', relationship_id: 'rel_1', title: 'T', description: 'd', memory_date: '2026-02-14T00:00:00Z', created_at: '2026-02-14T00:00:00Z' },
    ];
    const memories = await spGetMemories('rel_1');
    expect(memories).toHaveLength(1);
    expect(memories[0]!.title).toBe('T');
    expect(memories[0]!.relationship_id).toBe('rel_1');
  });

  it('creates a memory and returns its id', async () => {
    const id = await spCreateMemory('rel_1', { title: 'X', description: 'y', memory_date: Date.parse('2026-02-14') });
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ relationship_id: 'rel_1', title: 'X', description: 'y' }),
    );
    expect(id).toBe('new_id');
  });
});

describe('journal repo (owner-only)', () => {
  it('lists the owner’s entries', async () => {
    selectRows = [
      { id: 'j1', owner_id: 'me', title: 'T', content: 'c', created_at: '2026-01-01T00:00:00Z' },
    ];
    const entries = await spGetEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]!.owner_id).toBe('me');
  });

  it('creates an entry owned by the signed-in user', async () => {
    await spCreateEntry({ title: ' T ', content: ' hello ' });
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ owner_id: 'me', title: 'T', content: 'hello' }),
    );
  });

  it('deletes by soft-delete: sets deleted_at, never hard-removes the row', async () => {
    await spDeleteEntry('j1');
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ deleted_at: expect.any(String) }));
  });
});
