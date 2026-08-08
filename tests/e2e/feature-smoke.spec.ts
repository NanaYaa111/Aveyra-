import { test, expect, type Page } from '@playwright/test';

/** Sign in and complete onboarding, so the three pages have a relationship. */
async function setUp(page: Page) {
  await page.goto('/sign-in/');
  await page.getByLabel('Email').fill('smoke@example.com');
  await page.getByRole('button', { name: /send my code/i }).click();
  await expect(page.getByRole('heading', { name: 'Enter your code', level: 1 })).toBeVisible();
  const code = (await page.getByTestId('dev-otp').textContent())!.trim();
  await page.getByLabel(/6-digit code/i).fill(code);
  await page.getByRole('button', { name: /verify and continue/i }).click();

  await expect(page).toHaveURL(/\/onboarding\/?$/);
  await page.getByLabel('Your name').fill('Nana');
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('button', { name: /start our space/i }).click();
  await page.getByRole('button', { name: /create our space/i }).click();
  await page.getByRole('button', { name: /continue to aveyra/i }).click();
  await expect(page).toHaveURL(/\/today\/?$/);
}

test('Scripture, Notes and Vault work once set up', async ({ page }) => {
  await setUp(page);

  // ---- Scripture: choose today's verse
  await page.goto('/scripture/');
  await expect(page.getByRole('heading', { name: 'Scripture' })).toBeVisible();
  await expect(page.getByText(/isn't set up yet/i)).toHaveCount(0);
  await expect(page.getByText(/today's suggestion/i)).toBeVisible();
  await page.getByRole('button', { name: /share this verse/i }).click();
  await expect(page.getByText(/waiting to hear what/i)).toBeVisible();

  // ---- Notes: all three kinds, then write one
  await page.goto('/notes/');
  await expect(page.getByText(/isn't set up yet/i)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /weighing on me/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /something lovely/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /something to try/i })).toBeVisible();
  await page.getByRole('button', { name: /something lovely/i }).click();
  await page.getByPlaceholder(/made you think of them/i).fill('You looked happy today.');
  await page.getByRole('button', { name: /send to/i }).click();
  await expect(page.getByText('You looked happy today.')).toBeVisible();

  // ---- Vault: renders, states its limits, offers both send modes
  await page.goto('/vault/');
  await expect(page.getByRole('heading', { name: 'Vault' })).toBeVisible();
  await expect(page.getByText(/can't stop a screenshot/i)).toBeVisible();
  await expect(page.getByText("Keep it here", { exact: true })).toBeVisible();
  await expect(page.getByText("Show once", { exact: true })).toBeVisible();
});
