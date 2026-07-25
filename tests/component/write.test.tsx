import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { JournalEntry } from '@/lib/database/types';

let store: JournalEntry[];
const createEntry = vi.fn(async ({ title, content }: { title?: string; content: string }) => {
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    owner_id: 'self',
    title: title?.trim() ?? '',
    content: content.trim(),
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };
  store = [entry, ...store];
  return entry;
});
vi.mock('@/lib/journal', () => ({
  getEntries: () => Promise.resolve(store),
  createEntry: (args: { title?: string; content: string }) => createEntry(args),
}));

import WritePage from '@/app/write/page';

beforeEach(() => {
  store = [];
  createEntry.mockClear();
});
afterEach(cleanup);

describe('Write screen', () => {
  it('shows the empty state, then the entry after saving', async () => {
    const user = userEvent.setup();
    render(<WritePage />);

    expect(await screen.findByText(/nothing here yet/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Your entry'), 'A quiet thought.');
    await user.click(screen.getByRole('button', { name: /save entry/i }));

    await waitFor(() => expect(createEntry).toHaveBeenCalled());
    expect(await screen.findByText('A quiet thought.')).toBeInTheDocument();
  });

  it('disables save until there is content', async () => {
    render(<WritePage />);
    expect(await screen.findByRole('button', { name: /save entry/i })).toBeDisabled();
  });
});
