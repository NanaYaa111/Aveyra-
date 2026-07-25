#!/usr/bin/env node
/* Simple RLS validator: connects with anon key and tries to read `relationships`.
   If the anon client can fetch non-empty rows, RLS may be too permissive. */

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_TEST_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.SUPABASE_TEST_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('SUPABASE_TEST_URL and SUPABASE_TEST_ANON_KEY (or NEXT_PUBLIC_ vars) must be set.');
  process.exit(2);
}

const supabase = createClient(url, anon);

(async () => {
  try {
    const { data, error } = await supabase.from('relationships').select('*').limit(5);
    if (error) {
      console.log('Anon client query returned error (expected when RLS denies access):', error.message);
      process.exit(0);
    }
    if (Array.isArray(data) && data.length > 0) {
      console.error('RLS WARNING: anon client returned rows from `relationships`. Check policies.');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
    console.log('RLS check OK: anon client did not return rows.');
    process.exit(0);
  } catch (e) {
    console.error('Unexpected error while validating RLS:', e);
    process.exit(3);
  }
})();
