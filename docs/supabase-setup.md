# Supabase setup — Milestone 2 backend

**Status:** schema now lives in versioned migrations under `supabase/migrations/`
(not yet applied to a live project — not production-audited). Provisioning is
author-owned (I can't create the project). Once done, drop the two public env vars
in and the app switches from the local stub to real auth automatically (the
Supabase adapter is already wired behind `AuthProvider`).

Decisions this implements: **Q25 Supabase-native**, **Q15 passwordless email OTP**,
**Q20 EU region**, **staged privacy** (RLS + Supabase at-rest encryption; **no E2EE
claim** at launch — see the encryption note at the end).

---

## 1. Create the project
1. supabase.com → **New project**.
2. **Region: EU** — **West EU (London)** or **Central EU (Frankfurt)** (Q20).
3. Save the **Project URL** and the **anon public key** (Project Settings → API).

## 2. Configure Auth (passwordless email OTP)
Authentication → Providers → **Email**:
- **Enable Email provider**; turn **OFF** "Confirm email" password flows — we use OTP.
- **Enable email OTP** (6-digit code).
- **OTP expiry: 600 seconds** (matches the app's "expires in 10 minutes" copy).
- Under URL Configuration, add the **Site URL** (e.g. `https://aveyra.app`) and
  local `http://localhost:3000` to redirect allow-list (for magic-link return).
- Email template subject: `Your Aveyra verification code is: {{ .Token }}` (no
  tracking pixels — Document P §12.1).

## 3. Environment variables
Add to `.env.local` (never commit) and to Vercel's project env:
```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```
The anon key is public by design; **RLS** is what protects data.

## 4. Schema + Row-Level Security + RPCs (versioned migration)
The full schema — tables, indexes, RLS policies, and the `create_space` /
`accept_invitation` RPCs — lives in
[`supabase/migrations/20260725000000_init.sql`](../supabase/migrations/20260725000000_init.sql),
not inline here, so it can be applied and reviewed as a real, ordered migration
rather than a one-off SQL blob pasted into the dashboard's SQL editor.

Apply it with the [Supabase CLI](https://supabase.com/docs/guides/cli):
```
supabase link --project-ref <your-project-ref>
supabase db push
```
(or paste the file's contents into the SQL editor once, if you're not using the
CLI yet — but any *future* schema change should be a new file under
`supabase/migrations/`, never an edit to `20260725000000_init.sql`, so the
migration history stays reproducible across dev/staging/prod.)

Covers: `profiles`, `relationships`, `relationship_members`, `invitations`,
`answers` (unique per relationship/question/author — prevents duplicate-answer
races), `memories`, `journal_entries` (soft-delete via `deleted_at`), indexes on
every FK/filter column the app actually queries by, RLS enabled + policies on
every table, and the `is_member` helper.

## 5. Storage (photos — later increment)
Storage → new bucket `memory-photos` (private). Add RLS so only relationship
members can read/write objects under a `relationship_id/` prefix. Wired when photo
attachments land.

---

## Encryption note (guardian — flag, don't silently resolve)
The M1 client field-encryption uses a **device-local** key, which a partner's
device can't decrypt. Cross-device sharing therefore can't use that key as-is.
Per the **staged-privacy** decision, shared content (answers, memories) launches
protected by **RLS + Supabase at-rest encryption**, not E2EE, and the product must
**not claim E2EE**. Reconciling the existing client field-encryption with
cross-device sync (either store shared content server-side in plaintext-under-RLS,
or introduce a shared relationship key for a later E2EE stage) is a **design
decision for the sync-integration increment** — it is not settled here.
