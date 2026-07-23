import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const router = { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() };
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/sign-in',
}));

import { AuthProvider, useAuth } from '@/lib/auth/context';
import { clearSession, resetAuthProvider } from '@/lib/auth';
import SignInPage from '@/app/sign-in/page';
import VerifyPage from '@/app/verify/page';

/** Renders the code screen once a sign-in is in flight, mirroring the guard's route swap. */
function Flow() {
  const { pending } = useAuth();
  return pending ? <VerifyPage /> : <SignInPage />;
}

beforeEach(() => {
  clearSession();
  resetAuthProvider();
  router.push.mockClear();
  router.replace.mockClear();
});
afterEach(cleanup);

describe('sign-in screen', () => {
  it('rejects an invalid email without advancing', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <SignInPage />
      </AuthProvider>,
    );
    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /send my code/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });
});

describe('sign-in → verify → signed in', () => {
  it('completes passwordless OTP end to end (stub delivers the code inline)', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Flow />
      </AuthProvider>,
    );

    await user.type(screen.getByLabelText('Email'), 'alex@example.com');
    await user.click(screen.getByRole('button', { name: /send my code/i }));

    // Navigation intent fired, and the flow swapped to the code screen.
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/verify'));
    expect(await screen.findByRole('heading', { name: /enter your code/i })).toBeInTheDocument();
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();

    // The stub surfaces the code inline (no email backend).
    const code = (await screen.findByText(/^\d{6}$/)).textContent!;

    await user.type(screen.getByLabelText(/6-digit code/i), code);
    await user.click(screen.getByRole('button', { name: /verify and continue/i }));

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/today'));
  });

  it('shows a calm error on a wrong code', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Flow />
      </AuthProvider>,
    );
    await user.type(screen.getByLabelText('Email'), 'sam@example.com');
    await user.click(screen.getByRole('button', { name: /send my code/i }));
    await screen.findByRole('heading', { name: /enter your code/i });

    const code = (await screen.findByText(/^\d{6}$/)).textContent!;
    const wrong = code === '000000' ? '111111' : '000000';
    await user.type(screen.getByLabelText(/6-digit code/i), wrong);
    await user.click(screen.getByRole('button', { name: /verify and continue/i }));

    expect(await screen.findByText(/incorrect/i)).toBeInTheDocument();
    expect(router.replace).not.toHaveBeenCalled();
  });
});
