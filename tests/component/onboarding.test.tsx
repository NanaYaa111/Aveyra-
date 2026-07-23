import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const router = { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() };
vi.mock('next/navigation', () => ({ useRouter: () => router }));

const actions = {
  onboarded: false as boolean,
  relationship: null as unknown,
  createSpace: vi.fn().mockResolvedValue(undefined),
  joinSpace: vi.fn().mockResolvedValue(undefined),
  createInvite: vi
    .fn()
    .mockResolvedValue({ encoded: 'enc-token', code: 'ABCD2345', expiresAt: Date.now() + 1000 }),
  finish: vi.fn().mockResolvedValue(undefined),
  devSimulatePartnerJoined: vi.fn().mockResolvedValue(undefined),
  refresh: vi.fn().mockResolvedValue(undefined),
};
vi.mock('@/lib/relationship/context', () => ({ useOnboarding: () => actions }));

import OnboardingPage from '@/app/onboarding/page';

beforeEach(() => {
  Object.values(actions).forEach((v) => typeof v === 'function' && (v as ReturnType<typeof vi.fn>).mockClear?.());
  router.replace.mockClear();
});
afterEach(cleanup);

describe('onboarding wizard — create path', () => {
  it('walks name → choose → details → invite → into Aveyra', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    // Step 1: name
    await user.type(screen.getByLabelText('Your name'), 'Alex');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 2: choose → start
    await user.click(screen.getByRole('button', { name: /start our space/i }));

    // Step 3: details → create
    await user.type(screen.getByLabelText(/partner's name/i), 'Sam');
    await user.click(screen.getByRole('button', { name: /create our space/i }));

    await waitFor(() =>
      expect(actions.createSpace).toHaveBeenCalledWith(
        expect.objectContaining({ yourName: 'Alex', partnerName: 'Sam' }),
      ),
    );

    // Step 4: invite shows the code
    expect(await screen.findByTestId('invite-code')).toHaveTextContent('ABCD2345');

    // Into the app
    await user.click(screen.getByRole('button', { name: /continue to aveyra/i }));
    await waitFor(() => expect(actions.finish).toHaveBeenCalled());
    expect(router.replace).toHaveBeenCalledWith('/today');
  });
});

describe('onboarding wizard — join path', () => {
  it('joins with a code and reaches the invite/waiting step', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.type(screen.getByLabelText('Your name'), 'Sam');
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('button', { name: /join my partner/i }));

    await user.type(screen.getByLabelText(/invite link or code/i), 'enc-token');
    await user.click(screen.getByRole('button', { name: /^continue$/i }));

    await waitFor(() =>
      expect(actions.joinSpace).toHaveBeenCalledWith({ yourName: 'Sam', encoded: 'enc-token' }),
    );
    expect(await screen.findByRole('button', { name: /continue to aveyra/i })).toBeInTheDocument();
  });
});
