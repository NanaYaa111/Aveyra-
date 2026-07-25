Incident response & key rotation runbook

Purpose: provide concise steps to follow if keys are compromised or a security incident
is suspected. Keep this file in the repo and update when procedures change.

1) Detection & Triage
- Identify the compromised key (anon vs service role). Check monitoring alerts and access logs.
- Notify the owner and on-call responders.
- Downgrade access: if possible, disable related service accounts.

2) Short-term mitigation
- Revoke or rotate the compromised key immediately.
  - For Supabase, rotate keys via the Supabase dashboard (Project Settings → API).
  - If you need to apply automation, use the Supabase Admin API or CLI where available.
- If the service role key is compromised, rotate it and audit any admin actions.

3) Update deployment
- Update host environment variables (Vercel/Netlify) with the new keys and redeploy.
  - Example (Vercel CLI):
    - `vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY <value> production`
    - `vercel env add SUPABASE_SERVICE_ROLE_KEY <value> production`
- If you use GitHub Actions, update repository secrets accordingly.

4) Post-incident tasks
- Rotate any outstanding keys and confirm new keys are not exposed in logs.
- Rotate credentials for any other services that may have been impacted.
- Run integration smoke-tests and validate RLS and auth behavior.
- Prepare a short post-incident report with timeline and remediation steps.

5) Communications
- Notify stakeholders per internal communication policy. If user-facing data was exposed,
  consult legal for disclosure obligations.

Notes:
- The anon key is public by design — it grants browser-level access subject to RLS enforcement.
  A leaked anon key is less severe than a leaked service role key but still requires rotation
  if policies might be bypassed.
- Always rotate service role keys immediately if leaked.
