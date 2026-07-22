# Milestone 2 — Web-First, Two-Device Core (Plan)

Implements the [web-first amendment](constitution/amendment-2026-07-21-web-first-two-device.md).
Presented for approval (cadence A). **Nothing is torn out until this is approved.**

> ⏸️ **On hold:** code build does not start until **Volume 2 · Part 4** arrives.
> **Volume 2 · Part 3 is COMPLETE (all 20 sections A–T, received 2026-07-22)** —
> the full feature specs, recorded across
> [A–D](constitution/volume-2-part-3-sections-a-d.md),
> [E–I](constitution/volume-2-part-3-sections-e-to-i.md),
> [J–N](constitution/volume-2-part-3-sections-j-to-n.md),
> [O–R](constitution/volume-2-part-3-sections-o-to-r.md), and
> [S–T](constitution/volume-2-part-3-sections-s-t.md); all conflicts resolved
> (Q13–Q17). **Only Part 4 (Technical Architecture & Engineering Spec — schema
> DDL / RLS / API / sync / deploy / CI-CD / monitoring) remains** before the
> build, and each screen still needs a design proposal → approval.

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
- **Auth: Email OTP / Magic Link.** Email is the primary account identifier;
  display name only besides that. No passwords, no social login at launch.
- **Hosting: Vercel** (frontend) + **Supabase** (backend). *(Supersedes the
  earlier GitHub Pages default.)* **Domain: `aveyra.app`** (fallbacks `.co` /
  `.io` / `.com`).
- **Supabase sequencing: build against a local mock first** (Option B) — the
  production project is provisioned **when Part 4 begins**, not before.
- **Question bank: ~200 questions across the canonical 9 categories** (Part 3
  Section E — Discovery, Appreciation, Memories, Communication, Dreams & Future,
  Growth, Reflection, Fun & Play, Conflict & Repair; + a **Love Maps** sub-
  category under Discovery). *(Refines the earlier "10" — standalone Gratitude
  folded into Appreciation; Q14. The built draft bank must be re-mapped to these
  9 during the content build.)* **First shared question:** *"What's one small
  thing about yourself that you hope I always remember?"*
- **Question timing:** synced to the relationship's primary timezone (set at
  space creation); exhaustion → shuffle → new randomized cycle, never repeat
  consecutively. **Skip:** silent, no partner notification, question returns later.
- **Automatic milestones (minimal):** Relationship Created · Partner Joined ·
  First Question Answered · First Shared Memory · First Month Together (if a
  start date given) · Anniversary. No scores/streaks/levels attached.
- **Notifications v1: none** (in-app reminders/activity indicators/status
  badges only). Push/email deferred.
- **ToS & Privacy Policy:** draft honest placeholders (staged privacy, no E2EE
  claims), clearly marked draft, replaced with legal review before public launch.

## Good news — the rework is smaller than it sounds
The frontend can talk to **Supabase directly from the browser**, so:
- **No custom server to host** — Vercel serves the frontend; Supabase is the
  only backend.
- **Survives unchanged:** design system, brand, all components, routes/shell/nav,
  Web-Crypto layer, testing + CI.
- **Changes:** add the Supabase client + auth; Dexie becomes a **local draft /
  cache** (repurposed per decision §18 — draft caching, temporary offline
  reading, graceful reconnection, resilience — not source of truth); the
  service-worker *offline guarantee* becomes optional graceful-disconnect; the
  sync stub becomes a real Supabase transport; build accounts + invitation +
  async reveal. **All "always on your device" / offline-first copy gets
  corrected to honestly describe a connected, cloud-based platform.**

## Infrastructure sequencing (confirmed: Option B)
Build the UI + data layer now against a **local mock backend** — fully
demonstrable and tested without infra. **When Part 4 begins**, provision the
production **Supabase project** (author-owned; I can't create it) and configure
project URL, anon public key, service role key, storage buckets, auth, and RLS —
I'll supply exact steps + the SQL/policies at that point. This avoids migrations
against a schema that's still evolving.

## Build stages (each gated: research note → design proposal → approval → build → 4 gates)
1. **Backend model** — Supabase schema (profiles, relationships, invitations,
   questions, answers, memories, journal) with RLS across the three content
   classes; auth (email OTP); client integration behind the existing service
   interfaces. (Device keypairs from M1 are retained for the future E2EE stage,
   not exercised at launch.)
2. **Onboarding** — 4-screen welcome → account → create/join relationship space →
   invitation (QR + code) → link. (Per Design Research Policy.)
3. **Today** — daily question → private draft → submit → "waiting for partner" →
   **async reveal** (states: Draft/Submitted/Waiting/Reveal) → save as memory.
4. **Story** (memories timeline) + **Write** (private journal) → backend + local drafts.
5. **Realtime + graceful disconnect** — sync, saved-state indicators, calm
   reconnection copy (sync language now valid).
6. **Validation + deploy** — gates, then deploy to Vercel + connect the
   production Supabase project (per the Part-4 sequencing above).
7. **Private beta** — 5–10 couples; feedback form, interview guide, bug-report
   and feature-request templates; validate real relationship interactions, not
   just technical function.

## Feature specs → build stages (Part 3 A–I received)
The received specs map onto the stages above: **A** Auth → stages 1–2 · **B**
Relationship Space & Invitation → stage 2 · **C** Onboarding → stage 2 · **D**
Home Dashboard → **Today** (stage 3) · **E** Daily Questions → stage 3
(*selection rules already implemented* by `lib/questions/rotation.ts`) · **F**
Memories + **G** Timeline → **Story** (stage 4) · **H** Journal → **Write**
(stage 4) · **I** Search & Discovery → a search surface within Today/Story
(after stage 4).

**M2 schema additions implied by E–I** (for the Part-4 DDL): Memory +tags / mood
/ related_question_id / multiple photos / creator_id · JournalEntry +mood / tags
/ photos (≤3) / favorite · new DailyQuestion instance + per-partner Answer +
reveal state · **TimelineEvent** (event+reference model) · **search index** ·
question↔memory links. **Hard RLS rule:** journal is owner-only everywhere —
never in shared search, timeline, or partner views.

**M1 head start:** field-level **encryption at rest is already implemented**
(`DatabaseService` auto-inits a vault and encrypts content fields) and **export /
import** ships — a running start on the staged-privacy "encrypted at rest" +
data-portability requirements. The at-rest crypto carries into the Supabase
stage; the M1 device keypairs remain reserved for the later E2EE stage.

## Retained rules (unchanged)
All §1.2 prohibitions (no streaks/scores/comparison), "support connection, never
control" (no user monitoring/location/read-receipts/proof-of-activity), consent &
explicit reveal states, WCAG 2.2 AA, reversibility. The Design Research Policy
governs every screen.

**Auth = passwordless email OTP / magic link** (Q15; no passwords). **Architecture
= web-first** (Q16; cloud = source of truth, local = cache + pending-actions queue,
graceful disconnection). **Telemetry (Q17 narrow amendment):** opt-in, aggregate,
**non-content** crash + performance metrics only — **no** behavioral/feature-usage
analytics, activity dashboards, third-party analytics scripts, or user A/B.

**Provisional product defaults (2026-07-22, Q18–Q21; revisitable):** media v1 =
**photos only** (video later); **18+** minimum age; **EU** data region
(London/Frankfurt) for Supabase; on relationship dissolution **both partners keep
a frozen copy** of shared memories (space archived, no immediate deletion). Age,
region, and dissolution mechanics are firmed in Part 4 / legal review.
