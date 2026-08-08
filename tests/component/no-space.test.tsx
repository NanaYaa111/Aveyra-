import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import type { Relationship } from '@/lib/database/types';

/**
 * Every screen, rendered with **no relationship** — the state a person is in
 * before setup finishes, and the one that shipped a page showing nothing at all
 * but its own heading. A blank screen with no explanation reads as broken, so
 * each of these asserts the page says *something* about why it's empty.
 */
let relationship: Relationship | null = null;
let onboarded: boolean | null = true;

vi.mock('@/lib/relationship/context', () => ({
  useOnboarding: () => ({ relationship, onboarded }),
}));
vi.mock('@/lib/notes', async (orig) => ({
  ...(await orig<typeof import('@/lib/notes')>()),
  getNotes: () => Promise.resolve([]),
  subscribeNotes: () => () => {},
}));
vi.mock('@/lib/dates', async (orig) => ({
  ...(await orig<typeof import('@/lib/dates')>()),
  getPlans: () => Promise.resolve([]),
}));
vi.mock('@/lib/messages', async (orig) => ({
  ...(await orig<typeof import('@/lib/messages')>()),
  getMessages: () => Promise.resolve([]),
  subscribeMessages: () => () => {},
}));
vi.mock('@/lib/story', () => ({
  getMemories: () => Promise.resolve([]),
  createMemory: () => Promise.resolve(),
  photoUrl: () => Promise.resolve(null),
}));
vi.mock('@/lib/vault', async (orig) => ({
  ...(await orig<typeof import('@/lib/vault')>()),
  listVault: () => Promise.resolve([]),
}));
vi.mock('@/lib/e2ee', async (orig) => ({
  ...(await orig<typeof import('@/lib/e2ee')>()),
  publishPublicKey: () => Promise.resolve(),
}));

import NotesPage from '@/app/notes/page';
import ScripturePage from '@/app/scripture/page';
import DatesPage from '@/app/dates/page';
import StoryPage from '@/app/story/page';

beforeEach(() => {
  relationship = null;
  onboarded = true;
});
afterEach(cleanup);

/** Anything a user could read as an explanation, rather than a dead screen. */
function hasVisibleExplanation() {
  const text = document.body.textContent ?? '';
  return /isn't set up|one moment|starts here|nothing here|no plans|quiet in here/i.test(text);
}

describe('screens with no relationship yet', () => {
  it('Notes explains itself instead of rendering an empty page', async () => {
    render(<NotesPage />);
    expect(await screen.findByText(/isn't set up yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /finish setting up/i })).toBeInTheDocument();
  });

  it('Scripture explains itself instead of rendering an empty page', async () => {
    render(<ScripturePage />);
    expect(await screen.findByText(/isn't set up yet/i)).toBeInTheDocument();
  });

  it('Notes offers no dead controls — the kind buttons are hidden, not greyed', async () => {
    render(<NotesPage />);
    await screen.findByText(/isn't set up yet/i);
    expect(screen.queryByRole('button', { name: /weighing on me/i })).not.toBeInTheDocument();
  });

  it('says "one moment" while setup is still resolving, not "not set up"', async () => {
    onboarded = null;
    render(<ScripturePage />);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/one moment/i));
    expect(screen.queryByText(/isn't set up yet/i)).not.toBeInTheDocument();
  });

  it('Dates and Story stay readable with nothing to show', async () => {
    render(<DatesPage />);
    await waitFor(() => expect(hasVisibleExplanation()).toBe(true));
    cleanup();

    render(<StoryPage />);
    await waitFor(() => expect(hasVisibleExplanation()).toBe(true));
  });
});
