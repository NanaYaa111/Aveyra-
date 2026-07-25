import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import type { Memory } from '@/lib/database/types';

let memories: Memory[];
vi.mock('@/lib/story', () => ({ getMemories: () => Promise.resolve(memories) }));
vi.mock('@/lib/relationship/context', () => ({ useOnboarding: () => ({ relationship: { id: 'r1' } }) }));

import StoryPage from '@/app/story/page';

function memory(partial: Partial<Memory>): Memory {
  return {
    id: crypto.randomUUID(),
    relationship_id: 'r1',
    title: 'A memory',
    description: 'something kept',
    memory_date: Date.parse('2026-02-14'),
    image_ref: null,
    created_at: 0,
    updated_at: 0,
    deleted_at: null,
    schema_version: 1,
    version: 1,
    ...partial,
  };
}

afterEach(cleanup);

describe('Story screen', () => {
  it('shows the empty state when nothing is kept', async () => {
    memories = [];
    render(<StoryPage />);
    expect(await screen.findByText(/your story starts here/i)).toBeInTheDocument();
  });

  it('lists kept memories with their date and title', async () => {
    memories = [
      memory({ title: 'What made you smile today?', description: 'You: a dog\n\nSam: your text' }),
    ];
    render(<StoryPage />);
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'What made you smile today?' })).toBeInTheDocument(),
    );
    expect(screen.getByText(/February 14, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/You: a dog/)).toBeInTheDocument();
  });
});
