# Release Checklist — Production readiness

This checklist captures the minimum items to consider before a production release. Mark each item as complete before promoting to production.

## Infrastructure
- [ ] Production Supabase project provisioned and owned by the author.
- [ ] `infra/supabase/policies.sql` (or IaC) applied to production DB.
- [ ] RLS policies reviewed and validated in a staging environment.
- [ ] Service role keys stored in CI (not in repo).

## Secrets & CI
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured in host (Vercel), per-environment.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured as a secret in CI for migration/admin tasks.
- [ ] CI job exists that verifies `infra/supabase/policies.sql` presence and lints SQL.

## Security & Privacy
- [ ] Confirm RLS prevents cross-relationship access (test with staging accounts).
- [ ] Confirm OTP rate limits and abuse protection configured in Supabase Auth.
- [ ] Confirm legal/privacy signoff: retention policy, export capability, deletion semantics.

## Observability
- [ ] Error reporting configured (Sentry/Logflare/other) for auth and sync errors.
- [ ] Monitoring/alerts for auth rate spikes and failed sign-in attempts.

## Testing
- [ ] Integration tests pass against a disposable Supabase test project.
- [ ] End-to-end flows tested: sign-in OTP, verify, today flow, save memory, export/import.
- [ ] Performance load test for local DB encryption on expected dataset sizes.

## Documentation
- [ ] Update `ops/README.md` with final provisioning steps and rotation procedures.
- [ ] Update privacy/retention doc and ensure in-repo copy exists.

## Post-deploy
- [ ] Run smoke tests against production endpoint.
- [ ] Verify RLS behavior by attempting to access other relationship data (expected: denied).
- [ ] Configure incident response runbook for key rotation and data incidents.
