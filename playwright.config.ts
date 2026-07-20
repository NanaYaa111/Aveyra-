import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end + accessibility tests run against the real static export served
 * over HTTP (closest to production). `pnpm build` produces `out/`, which a
 * simple static server hosts.
 *
 * Locally, point at the preinstalled browser via PLAYWRIGHT_CHROMIUM_PATH;
 * in CI, `playwright install chromium` provides it.
 */
const PORT = 4173;
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    ...(chromiumPath ? { launchOptions: { executablePath: chromiumPath } } : {}),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm build && python3 -m http.server ${PORT} --directory out`,
    url: `http://localhost:${PORT}/today/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
