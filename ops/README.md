# Operations: Supabase provisioning & deployment

This document describes the minimal, repeatable steps to provision the Milestone-2 Supabase backend, configure the frontend host (e.g. Vercel), and validate Row-Level Security (RLS) and secrets.

Important: the production Supabase project must be owned by the author/owner (see docs/milestone-2-plan.md). Keep infra artifacts (SQL / IaC) under `infra/` and commit them for auditability.

## Required environment variables (frontend)
- `NEXT_PUBLIC_SUPABASE_URL` — the Supabase project URL (example: `https://xyz.supabase.co`). Public.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the Supabase anon public key. Public by design but rotate if compromised.

## Recommended secrets (server-side / CI)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key **never** exposed to the browser; used for admin scripts or CI migrations.

## Provisioning steps (manual)
1. Create a new project at https://app.supabase.com, choose region (EU if required).
2. Create the database and storage buckets as documented in `docs/supabase-setup.md`.
3. Apply SQL schema and RLS policies from `infra/supabase/policies.sql` (or run the IaC tool).
4. Create a non-production test project for CI/integration tests.

### Applying schema and policies (scripted)

You can apply the bundled SQL files with `psql` or via the GitHub Actions workflow.

- Locally (requires `psql`):

```bash
# Get the DB connection string from Supabase → Settings → Database → Connection string (URI)
export DATABASE_URL="postgres://user:password@host:port/database"
DATABASE_URL="$DATABASE_URL" ./scripts/apply-sql.sh
```

- Using GitHub Actions (manual dispatch):
   - Add repository secret `SUPABASE_DB_URL` containing the production/staging DB connection string.
   - Go to the Actions tab, open `Apply infra & run integration` and click `Run workflow`.
   - The job `apply-sql` will run `infra/supabase/schema.sql` and `infra/supabase/policies.sql`.

Note: applying SQL to production should be done carefully — prefer a staging project first.

## Host configuration (Vercel example)
1. In your Vercel project settings, add the following Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → value from Supabase project
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon key
2. Add production-only secrets (in the Vercel UI or via the CLI):
   - `SUPABASE_SERVICE_ROLE_KEY` (set in Vercel's "Environment Variables" but mark as secret)
3. Ensure `NODE_ENV=production` for production deployments.

## Validations after deploy
- Confirm RLS policies are present and that public (anon) role cannot list or read other users' data.
- Test OTP sign-in using a disposable test account.
- Verify logs/alerts for suspicious rate patterns on auth.

## Rotation & incident response
- Rotate anon key if public key is compromised (update Vercel env and redeploy).
- Revoke service role keys immediately if leaked.

## Notes
- The frontend uses the anon public key intentionally; RLS must enforce per-relationship access. See `infra/` for sample policies.
- Keep this file updated with any changes to the provisioning process.
