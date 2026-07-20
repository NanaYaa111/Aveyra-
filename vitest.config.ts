import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Unit/integration tests run in Node (real Web Crypto + structuredClone) with
 * a fake IndexedDB, exercising the data, encryption, and sync layers directly.
 * UI accessibility is verified separately with Playwright + axe.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
