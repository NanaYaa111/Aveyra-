import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

type DailyMock = ReturnType<typeof makeDaily>;
let current: DailyMock;
vi.mock('@/lib/daily', () => ({ useDaily: () => current }));

import TodayPage from '@/app/today/page';

function makeDaily(overrides: Partial<DailyMock> = {}) {
  const base = {
    state: {
      question: { id: 'q-open-01', category: 'discovery', text: 'What made you smile today?', depth: 1 },
      dateKey: '2026-07-25',
      myAnswer: null as null | { content: string },
      partnerAnswer: null as null | { content: string },
      status: 'answering' as 'answering' | 'waiting' | 'revealed',
      saved: false,
    },
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
    dev: { enabled: false, simulatePartner: vi.fn(), advanceDay: vi.fn(), reset: vi.fn() },
    partnerName: 'Sam',
  };
  return { ...base, ...overrides };
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
        ...makeDaily().state,
        myAnswer: { content: 'A dog on the bus' },
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
        ...makeDaily().state,
        myAnswer: { content: 'A dog on the bus' },
        partnerAnswer: { content: 'Your text this morning' },
        status: 'revealed',
      },
    });
    render(<TodayPage />);
    expect(screen.getByText('A dog on the bus')).toBeInTheDocument();
    expect(screen.getByText('Your text this morning')).toBeInTheDocument();
    expect(screen.getByText(/see you tomorrow/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save this as a memory/i })).toBeInTheDocument();
  });

  it('revealed + saved: shows the saved badge, no save button', () => {
    current = makeDaily({
      state: {
        ...makeDaily().state,
        myAnswer: { content: 'x' },
        partnerAnswer: { content: 'y' },
        status: 'revealed',
        saved: true,
      },
    });
    render(<TodayPage />);
    expect(screen.getByText(/saved to memories/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save this as a memory/i })).not.toBeInTheDocument();
  });
});
