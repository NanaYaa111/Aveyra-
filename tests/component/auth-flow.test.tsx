import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const router = { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() };
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/sign-in',
}));

import { AuthProvider } from '@/lib/auth/context';
import { clearSession, resetAuthProvider } from '@/lib/auth';
import { SignInScreenAdapter } from '@/components/figma-ui/SignInScreenAdapter';

beforeEach(() => {
  clearSession();
  resetAuthProvider();
  router.push.mockClear();
  router.replace.mockClear();
});
afterEach(cleanup);

describe('sign-in adapter', () => {
  it('renders email input and send button', async () => {
    render(
      <AuthProvider>
        <SignInScreenAdapter />
      </AuthProvider>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send code/i })).toBeInTheDocument();
  });

  it('submits form with valid email and navigates to verify', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <SignInScreenAdapter />
      </AuthProvider>,
    );

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send code/i }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/verify'));
  });
});
