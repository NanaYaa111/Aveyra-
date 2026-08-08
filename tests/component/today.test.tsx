import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
// Type-only import: erased at runtime, so it is unaffected by the mock below.
// Typing the mock against the real hook means typecheck fails the moment
// useDaily grows a field this mock doesn't have — which had silently produced
// three separate uncovered-feature bugs before it was pinned down like this.
import type { useDaily } from '@/lib/daily';
import type { Answer } from '@/lib/database/types';

/** A full Answer — the mock is typed against the real hook, so shortcuts fail. */
function answer(content: string, author: Answer['author'] = 'partner_one'): Answer {
  return {
    id: crypto.randomUUID(),
    question_id: 'q-open-01',
    author,
    content,
    created_at: 0,
    updated_at: 0,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
}

/** Today's state, non-null so tests can spread it without narrowing first. */
function baseState(): NonNullable<ReturnType<typeof useDaily>['state']> {
  return {
    question: { id: 'q-open-01', category: 'discovery', text: 'What made you smile today?', depth: 1 },
    dateKey: '2026-07-25',
    myAnswer: null as Answer | null,
    partnerAnswer: null as Answer | null,
    status: 'answering',
    saved: false,
  };
}

function baseDaily(): ReturnType<typeof useDaily> {
  return {
    state: baseState(),
    loading: false,
    draft: '',
    setDraft: vi.fn(),
    editing: false,
    startEdit: vi.fn(),
    cancelEdit: vi.fn(),
    submit: vi.fn(),
    saveMemory: vi.fn(),
    busy: false,
    error: null as string | null,
    online: true,
    presence: { lines: [] as string[] },
    suggestion: { id: 's-01', text: 'Tell them one small thing they did this week.' },
    dev: { enabled: false, simulatePartner: vi.fn(), advanceDay: vi.fn(), reset: vi.fn() },
    partnerName: 'Sam',
  };
}
type DailyMock = ReturnType<typeof baseDaily>;
let current: DailyMock;
vi.mock('@/lib/daily', () => ({ useDaily: () => current }));

import TodayPage from '@/app/today/page';

function makeDaily(overrides: Partial<DailyMock> = {}): DailyMock {
  return { ...baseDaily(), ...overrides };
}

afterEach(cleanup);

describe('Today screen', () => {
  it('answering: shows the question and an answer field', () => {
    current = makeDaily();
    render(<TodayPage />);
    expect(screen.getByRole('heading', { name: 'Today', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('What made you smile today?')).toBeInTheDocument();
    expect(screen.getByLabelText('Your answer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit answer/i })).toBeInTheDocument();
  });

  it('waiting: shows my answer, the waiting status, and an edit affordance', () => {
    current = makeDaily({
      state: {
        ...baseState(),
        myAnswer: answer('A dog on the bus'),
        status: 'waiting',
      },
    });
    render(<TodayPage />);
    expect(screen.getByText('A dog on the bus')).toBeInTheDocument();
    expect(screen.getByText(/waiting for sam/i)).toBeInTheDocument();
    expect(screen.getByText(/still change this until reveal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit answer/i })).toBeInTheDocument();
  });

  it('revealed: shows both answers and offers save-as-memory', () => {
    current = makeDaily({
      state: {
        ...baseState(),
        myAnswer: answer('A dog on the bus'),
        partnerAnswer: answer('Your text this morning', 'partner_two'),
        status: 'revealed',
      },
    });
    render(<TodayPage />);
    expect(screen.getByText('A dog on the bus')).toBeInTheDocument();
    expect(screen.getByText('Your text this morning')).toBeInTheDocument();
    expect(screen.getByText(/see you tomorrow/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save this as a memory/i })).toBeInTheDocument();
  });

  it('online: no connection notice', () => {
    current = makeDaily();
    render(<TodayPage />);
    expect(screen.queryByText(/you're offline/i)).not.toBeInTheDocument();
  });

  it('offline: shows a calm connection notice without over-promising', () => {
    current = makeDaily({ online: false });
    render(<TodayPage />);
    const notice = screen.getByText(/you're offline/i);
    expect(notice).toBeInTheDocument();
    // Honest copy: no false "your answer is safe" claim while a draft is unsaved.
    expect(notice.textContent).not.toMatch(/safe/i);
  });

  it('shows the arrival lines plainly, with nothing to dismiss', () => {
    current = makeDaily({ presence: { lines: ['Sam checked in today.'] } });
    render(<TodayPage />);
    expect(screen.getByText('Sam checked in today.')).toBeInTheDocument();
    // No badge, no counter, no dismiss control — it is a sentence, not a widget.
    expect(screen.queryByRole('button', { name: /dismiss|close|mark as read/i })).not.toBeInTheDocument();
  });

  it('shows nothing when there is nothing waiting', () => {
    current = makeDaily();
    render(<TodayPage />);
    expect(screen.queryByText(/checked in|answered today|message from/i)).not.toBeInTheDocument();
  });

  it('offers the daily suggestion with nothing to mark done', () => {
    current = makeDaily();
    render(<TodayPage />);
    expect(screen.getByText(/tell them one small thing/i)).toBeInTheDocument();
    // An invitation, not a task: no completion control anywhere near it.
    expect(
      screen.queryByRole('button', { name: /done|complete|did it|mark/i }),
    ).not.toBeInTheDocument();
  });

  it('revealed + saved: shows the saved badge, no save button', () => {
    current = makeDaily({
      state: {
        ...baseState(),
        myAnswer: answer('x'),
        partnerAnswer: answer('y', 'partner_two'),
        status: 'revealed',
        saved: true,
      },
    });
    render(<TodayPage />);
    expect(screen.getByText(/saved to memories/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save this as a memory/i })).not.toBeInTheDocument();
  });
});
