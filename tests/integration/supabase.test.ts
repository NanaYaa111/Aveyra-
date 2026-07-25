import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Integration test that requires a configured disposable test project.
// The test will be skipped if the required env vars are absent.

const url = process.env.SUPABASE_TEST_URL;
const anon = process.env.SUPABASE_TEST_ANON_KEY;

if (!url || !anon) {
  // Skip tests in CI if env isn't provided
  describe('supabase integration (skipped)', () => {
    it('skipped because SUPABASE_TEST_URL or SUPABASE_TEST_ANON_KEY not set', () => {
      expect(true).toBe(true);
    });
  });
} else {
  describe('supabase integration', () => {
    it('connects and queries relationships table', async () => {
      const supabase = createClient(url, anon);
      // This will return either rows or an error if RLS denies access.
      const { data, error } = await supabase.from('relationships').select('*').limit(1);
      // The test expects a successful request object; the content depends on staging data.
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });
}
