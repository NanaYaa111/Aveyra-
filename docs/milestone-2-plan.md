# Milestone 2 — Web-First, Two-Device Core (Plan)

Implements the [web-first amendment](constitution/amendment-2026-07-21-web-first-two-device.md).
Presented for approval (cadence A). **Nothing is torn out until this is approved.**

## Locked decisions (confirmed by Volume 2 Sections E–P, 2026-07-21)
- **Backend: Supabase** — Auth + Postgres + Realtime + Row-Level Security.
- **Privacy: STAGED (server-side first).** Launch with **server-side encryption
  at rest + strict RLS access controls**. Design the schema in **3 content
  classes** — shared relational · private device-owned · future-encryptable — so
  **client-side E2EE can be added later without a rewrite**. **Honesty:** the
  product must NOT claim E2EE; copy says "encrypted at rest, strict access, never
  sold." (Supersedes the earlier E2EE-first default.)
- **Navigation: four** — Today / Story / Write / Settings. Today hosts the daily
  question + a light home summary; Story = memories timeline; Settings = profile,
  account, privacy, invitation.
- **Model: neutral `participants`** (Participant A / Participant B) schema, with
  partner-forward UI copy.
- **Per-tab emotional targets:** Today = anticipation + gentle continuity ·
  Story = shared identity + continuity · Write = private safety + self-clarity ·
  Settings = control + trust.

## Good news — the rework is smaller than it sounds
The frontend can **stay a static Next.js export** and talk to **Supabase directly
from the browser**. So:
- **No custom server to host** — deploy the static frontend anywhere (GitHub
  Pages / Netlify); Supabase is the only backend.
- **Survives unchanged:** design system, brand, all components, routes/shell/nav,
  Web-Crypto layer, testing + CI.
- **Changes:** add the Supabase client + auth; Dexie becomes a **local draft /
  cache** (not source of truth); the service-worker *offline guarantee* becomes
  optional graceful-disconnect; the sync stub becomes a real Supabase transport;
  build accounts + invitation + async reveal.

## Infrastructure you'll need to provide
Real two-device sync needs a **Supabase project** (I can't create one under your
account). When you're ready I'll give exact click-by-click steps; I'll need the
**project URL + anon public key** (as env vars) and I'll supply the SQL schema +
RLS policies + auth config. **Until then**, I can build the UI + data layer
against a **local mock backend** so everything is demonstrable and tested without
infra.

## Build stages (each gated: research note → design proposal → approval → build → 4 gates)
1. **Backend model** — Supabase schema (profiles, relationships, invitations,
   questions, answers, memories, journal) with RLS; auth (email OTP); client
   integration behind the existing service interfaces; E2EE key exchange on link.
2. **Onboarding** — 4-screen welcome → account → create/join relationship space →
   invitation (QR + code) → link. (Per Design Research Policy.)
3. **Today** — daily question → private draft → submit → "waiting for partner" →
   **async reveal** (states: Draft/Submitted/Waiting/Reveal) → save as memory.
4. **Story** (memories timeline) + **Write** (private journal) → backend + local drafts.
5. **Realtime + graceful disconnect** — sync, saved-state indicators, calm
   reconnection copy (sync language now valid).
6. **Validation + deploy** — gates, then deploy the static frontend + connect Supabase.

## Retained rules (unchanged)
All §1.2 prohibitions (no streaks/scores/comparison), "support connection, never
control" (no monitoring/location/read-receipts/proof-of-activity), consent &
explicit reveal states, WCAG 2.2 AA, reversibility. The Design Research Policy
governs every screen.
