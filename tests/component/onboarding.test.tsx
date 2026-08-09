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

import { OnboardingNameAdapter } from '@/components/figma-ui/OnboardingNameAdapter';
import { OnboardingChoiceAdapter } from '@/components/figma-ui/OnboardingChoiceAdapter';
import { OnboardingDetailsAdapter } from '@/components/figma-ui/OnboardingDetailsAdapter';
import { OnboardingJoinAdapter } from '@/components/figma-ui/OnboardingJoinAdapter';

beforeEach(() => {
  Object.values(actions).forEach((v) => typeof v === 'function' && (v as ReturnType<typeof vi.fn>).mockClear?.());
  router.push.mockClear();
  router.replace.mockClear();
  sessionStorage.clear();
});
afterEach(cleanup);

describe('onboarding adapters', () => {
  it('name adapter stores and navigates', async () => {
    const user = userEvent.setup();
    render(<OnboardingNameAdapter />);

    await user.type(screen.getByLabelText('Your name'), 'Alex');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(sessionStorage.getItem('onboarding_name')).toBe('Alex');
    expect(router.push).toHaveBeenCalledWith('/onboarding/choice');
  });

  it('choice adapter routes to details on start', async () => {
    const user = userEvent.setup();
    render(<OnboardingChoiceAdapter />);

    await user.click(screen.getByRole('button', { name: /start our space/i }));

    expect(sessionStorage.getItem('onboarding_mode')).toBe('create');
    expect(router.push).toHaveBeenCalledWith('/onboarding/details');
  });

  it('choice adapter routes to join on join', async () => {
    const user = userEvent.setup();
    render(<OnboardingChoiceAdapter />);

    await user.click(screen.getByRole('button', { name: /join my partner/i }));

    expect(sessionStorage.getItem('onboarding_mode')).toBe('join');
    expect(router.push).toHaveBeenCalledWith('/onboarding/join');
  });

  it('details adapter stores partner info and navigates', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('onboarding_name', 'Alex');
    render(<OnboardingDetailsAdapter />);

    await user.type(screen.getByLabelText(/partner's name/i), 'Sam');
    await user.click(screen.getByRole('button', { name: /create our space/i }));

    expect(sessionStorage.getItem('onboarding_partner_name')).toBe('Sam');
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/onboarding/invite'));
  });

  it('join adapter stores invite code and navigates', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('onboarding_name', 'Sam');
    render(<OnboardingJoinAdapter />);

    await user.type(screen.getByLabelText(/invite/i), 'enc-token');
    await user.click(screen.getByRole('button', { name: /connect/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem('onboarding_invite_code')).toBe('enc-token');
      expect(router.push).toHaveBeenCalledWith('/onboarding/invite');
    });
  });
});
