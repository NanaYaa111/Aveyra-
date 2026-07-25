Integration tests for Supabase

These integration tests are optional and intended to run against a disposable
Supabase test project (not production). They validate basic connectivity and
RLS enforcement assumptions.

Required environment variables for CI or local runs:
- `SUPABASE_TEST_URL` — the test Supabase project URL (https://<project>.supabase.co)
- `SUPABASE_TEST_ANON_KEY` — anon key for the test project
- `SUPABASE_TEST_SERVICE_ROLE_KEY` — service role key (only required for admin tasks)

Run locally:

```bash
# install deps
pnpm install

# run integration tests (node + vitest)
SUPABASE_TEST_URL=https://... SUPABASE_TEST_ANON_KEY=... pnpm test -- -t "supabase" 
```

Notes:
- Tests will skip if required environment variables are not present.
- Use a throwaway test project to avoid impacting production data.
