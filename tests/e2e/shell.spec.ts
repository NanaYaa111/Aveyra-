import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DESTINATIONS = [
  { path: '/today/', heading: 'Today' },
  { path: '/story/', heading: 'Story' },
  { path: '/write/', heading: 'Write' },
  { path: '/settings/', heading: 'Settings' },
];

test.describe('app shell', () => {
  test('the root redirects to Today', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/today\/?$/);
    await expect(page.getByRole('heading', { name: 'Today', level: 1 })).toBeVisible();
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

test.describe('offline-first', () => {
  test('the app still opens with the network offline', async ({ page, context }) => {
    await page.goto('/today/');
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
  for (const dest of DESTINATIONS) {
    test(`no serious/critical axe violations on ${dest.heading}`, async ({ page }) => {
      await page.goto(dest.path);
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
