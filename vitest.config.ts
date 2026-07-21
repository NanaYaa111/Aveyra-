import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

/**
 * Two test lanes share one config:
 *  - Unit/integration (tests/unit/**.test.ts) run in Node with real Web Crypto
 *    + structuredClone and a fake IndexedDB, exercising the data, encryption,
 *    sync, and question layers directly.
 *  - Component (tests/component/**.test.tsx) run in jsdom with Testing Library,
 *    exercising the bespoke UI components (accessibility wiring, focus, state).
 *
 * Full-page WCAG is still verified separately with Playwright + axe.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [['tests/component/**', 'jsdom']],
    setupFiles: ['./tests/setup.ts', './tests/setup-dom.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/component/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
