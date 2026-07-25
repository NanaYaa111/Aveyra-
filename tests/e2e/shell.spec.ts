import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DESTINATIONS = [
  { path: '/today/', heading: 'Today' },
  { path: '/story/', heading: 'Story' },
  { path: '/write/', heading: 'Write' },
  { path: '/settings/', heading: 'Settings' },
];

/**
 * Complete the passwordless-OTP flow using the local stub, which surfaces the
 * delivered code inline (data-testid="dev-otp"). Leaves the app authenticated and
 * on /today.
 */
async function verifyEmail(page: Page, email = 'e2e@example.com') {
  await page.goto('/sign-in/');
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: /send my code/i }).click();
  await expect(page.getByRole('heading', { name: 'Enter your code', level: 1 })).toBeVisible();
  const code = (await page.getByTestId('dev-otp').textContent())!.trim();
  await page.getByLabel(/6-digit code/i).fill(code);
  await page.getByRole('button', { name: /verify and continue/i }).click();
}

/** Sign in AND complete first-run onboarding (create path). Lands on /today. */
async function signIn(page: Page, email = 'e2e@example.com') {
  await verifyEmail(page, email);
  await expect(page).toHaveURL(/\/onboarding\/?$/);
  await page.getByLabel('Your name').fill('E2E');
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('button', { name: /start our space/i }).click();
  await page.getByRole('button', { name: /create our space/i }).click();
  await expect(page.getByTestId('invite-code')).toBeVisible();
  await page.getByRole('button', { name: /continue to aveyra/i }).click();
  await expect(page).toHaveURL(/\/today\/?$/);
}

test.describe('authentication', () => {
  test('a signed-out visitor to a protected route is sent to sign-in', async ({ page }) => {
    await page.goto('/today/');
    await expect(page).toHaveURL(/\/sign-in\/?$/);
    await expect(page.getByRole('heading', { name: 'Welcome to Aveyra', level: 1 })).toBeVisible();
  });

  test('a new account is taken to onboarding after verifying', async ({ page }) => {
    await verifyEmail(page);
    await expect(page).toHaveURL(/\/onboarding\/?$/);
    await expect(page.getByRole('heading', { name: /set up your space/i, level: 1 })).toBeVisible();
  });

  test('completing onboarding lands on Today', async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Today', level: 1 })).toBeVisible();
  });

  test('a wrong code shows a calm error and does not sign in', async ({ page }) => {
    await page.goto('/sign-in/');
    await page.getByLabel('Email').fill('e2e@example.com');
    await page.getByRole('button', { name: /send my code/i }).click();
    const code = (await page.getByTestId('dev-otp').textContent())!.trim();
    const wrong = code === '000000' ? '111111' : '000000';
    await page.getByLabel(/6-digit code/i).fill(wrong);
    await page.getByRole('button', { name: /verify and continue/i }).click();
    await expect(page.getByText(/incorrect/i)).toBeVisible();
    await expect(page).toHaveURL(/\/verify\/?$/);
  });
});

test.describe('app shell (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('every destination renders its heading', async ({ page }) => {
    for (const dest of DESTINATIONS) {
      await page.goto(dest.path);
      await expect(page.getByRole('heading', { name: dest.heading, level: 1 })).toBeVisible();
    }
  });

  test('navigation moves between destinations and marks the current one', async ({ page }) => {
    await page.goto('/today/');
    await page.getByRole('link', { name: 'Story' }).click();
    await expect(page).toHaveURL(/\/story\/?$/);
    await expect(page.getByRole('link', { name: 'Story' })).toHaveAttribute('aria-current', 'page');
  });

  test('the theme toggle switches to dark mode', async ({ page }) => {
    await page.goto('/settings/');
    await page.getByRole('radio', { name: 'Dark' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('daily question loop (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('answer → simulate partner → reveal → save as memory', async ({ page }) => {
    // The daily question is shown; answer it.
    await page.getByLabel('Your answer').fill('The way you laughed this morning.');
    await page.getByRole('button', { name: /submit answer/i }).click();

    // Waiting state, still editable.
    await expect(page.getByText(/waiting for/i)).toBeVisible();
    await expect(page.getByText(/still change this until reveal/i)).toBeVisible();

    // Dev-simulate the partner, then reveal.
    await page.getByRole('button', { name: /simulate partner answered/i }).click();
    await expect(page.getByText(/see you tomorrow/i)).toBeVisible();
    await expect(page.getByText('The way you laughed this morning.')).toBeVisible();

    // Keep it as a memory (one tap → save).
    await page.getByRole('button', { name: /save this as a memory/i }).click();
    await page.getByRole('button', { name: /^save memory$/i }).click();
    await expect(page.getByText(/saved to memories/i)).toBeVisible();

    // The kept memory now appears in Story.
    await page.getByRole('link', { name: 'Story' }).click();
    await expect(page).toHaveURL(/\/story\/?$/);
    await expect(page.getByText('The way you laughed this morning.')).toBeVisible();
  });
});

test.describe('graceful offline', () => {
  test('the app still opens with the network offline', async ({ page, context }) => {
    await signIn(page);
    // Wait for the service worker to take control, then cache the shell.
    await page
      .waitForFunction(() => navigator.serviceWorker?.controller != null, null, { timeout: 15_000 })
      .catch(() => {});
    await page.waitForTimeout(2000);

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Today', level: 1 })).toBeVisible();
    await context.setOffline(false);
  });
});

test.describe('accessibility (WCAG 2.2 AA)', () => {
  test('no serious/critical axe violations on the sign-in screen', async ({ page }) => {
    await page.goto('/sign-in/');
    await expect(page.getByRole('heading', { name: 'Welcome to Aveyra', level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const seriousOrWorse = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
  });

  test('no serious/critical axe violations on onboarding', async ({ page }) => {
    await verifyEmail(page);
    await expect(page.getByRole('heading', { name: /set up your space/i, level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const seriousOrWorse = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
  });

  for (const dest of DESTINATIONS) {
    test(`no serious/critical axe violations on ${dest.heading}`, async ({ page }) => {
      await signIn(page);
      await page.goto(dest.path);
      await expect(page.getByRole('heading', { name: dest.heading, level: 1 })).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const seriousOrWorse = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
    });
  }
});
