# Project Constitution — Index & Governing Record

This directory is the **permanent, durable record** of the project's governing
specification. Per the Claude Code Execution Protocol (Volume 1, Part 5, §7.1),
the relevant sections here **must be read before writing any code**.

> Working sessions are ephemeral; this repo is the only permanent memory.
> If it isn't written here, it isn't binding.

## Product Identity

**Aveyra** — a private, web-first relationship platform for two people to
intentionally understand each other better through meaningful conversations,
shared experiences, and a relationship story they build together.

The name merges two concepts:
- **Avela** — discovery, revelation, opening up
- **Veya** — a journey, a path, growth

Together: *"the journey of discovering, remembering, and growing together."*

Full brand identity (logo, palette, typography, taglines, design tokens):
[`../brand/aveyra-brand-identity.md`](../brand/aveyra-brand-identity.md) —
visual system **"First Light on the Path"** (Evergreen · Dawn Gold · Paper).

> Earlier documents (the Constitution volumes and research dossiers) were written
> under the working title **"Weave"**. Wherever they say "Weave"/"WEAVE", read
> **Aveyra**. The codebase, manifest, and all UI use Aveyra.

## Volumes

| Doc | Covers |
|-----|--------|
| [volume-1-part-1-foundation.md](volume-1-part-1-foundation.md) | Product vision, core principles, AI operating rules, fixed tech stack, Phase 1 scope |
| [volume-1-part-2-ux-design.md](volume-1-part-2-ux-design.md) | UX philosophy, relationship psychology, design language, interaction, accessibility, offline experience |
| [volume-1-part-3-architecture-security.md](volume-1-part-3-architecture-security.md) | Offline-first architecture, storage, encryption, backup, export/import, data management |
| [volume-1-part-4-schema-implementation.md](volume-1-part-4-schema-implementation.md) | Database schema, data models, application architecture, technology rules |
| [volume-1-part-5-roadmap-protocol.md](volume-1-part-5-roadmap-protocol.md) | Phase 1 roadmap, workflow, testing gates, code review, Claude Code execution protocol |
| [volume-2-part-1-product-ux.md](volume-2-part-1-product-ux.md) | Product overview, vision/mission, IA, target users, Phase 1 scope |
| [volume-2-part-2-ia-journey.md](volume-2-part-2-ia-journey.md) | Information architecture, user journey, relationship lifecycle *(nav conflict since resolved: four destinations govern)* |
| [volume-2-part-2-sections-b-c-d.md](volume-2-part-2-sections-b-c-d.md) | Onboarding, Home Dashboard, Daily Questions *(two-device/accounts/async-reveal — adopted via the web-first amendment)* |
| [volume-2-part-2-sections-e-to-p.md](volume-2-part-2-sections-e-to-p.md) | Memories, Journal, Notifications, Account, Search, Settings, Backup, Accessibility, Errors, Research framework, Journey map — resolves Supabase/staged-privacy/four-nav/participants |
| [design-research-policy.md](design-research-policy.md) | Binding: research proven UX patterns + get design approval before building any major screen |
| [research-dossier.md](research-dossier.md) | Evidence base (competitive analysis + relationship psychology + behavioural/technical research) |
| [positive-love-research.md](positive-love-research.md) | Positive-love evidence extract — what healthy love is, graded; drives Milestone 2 decisions |
| [volume-2-product-strategy.md](volume-2-product-strategy.md) | Positioning (communication-first), product principles, metrics, brand voice, feature-entry criteria, AI boundaries, North Star |
| [user-research-report.md](user-research-report.md) | Validation survey (n=13) — the empirical basis for communication-first; feature-priority signal |
| [volume-2-parts-3-4-decisions.md](volume-2-parts-3-4-decisions.md) | Preview of Parts 3–4 scope + a full decisions batch (Supabase sequencing, auth, question bank, domain/hosting, notifications, beta, milestones) |
| [volume-2-part-3-sections-a-d.md](volume-2-part-3-sections-a-d.md) | **Part 3 feature specs A–D** — Authentication, Relationship Space & Invitation, Onboarding, Home Dashboard *(nav conflict flagged: Section D lists five destinations vs the resolved four — awaiting author confirmation, Q13)* |

> 🔺 **Major direction change (2026-07-21):** Aveyra is now **web-first,
> two-device, and connected** — **offline-first has been dropped** as a product
> promise. See the [web-first amendment](amendment-2026-07-21-web-first-two-device.md).
> Where Volume 1 says "offline-first / no server / local is source of truth / no
> accounts," that pillar is **superseded**. Emotional-safety and trust rules
> remain fully in force.

**Status:** Volume 1 complete (Parts 1–5, as amended). Volume 2: Parts 1–2
(Sections A–P), the product-strategy directives, the user-research report, a
**Parts 3–4 scope-preview + decisions batch**, and now **Part 3 Sections A–D**
(auth, relationship space, onboarding, home dashboard) received; **Part 3
Sections E–T and all of Part 4 (schema/RLS/deploy blueprint) still to come**.
Volumes 3–4 pending. Milestone 1 (built foundation) shipped and approved;
Milestone 2 planned in detail but **code build remains on hold until the full
Parts 3–4 arrive** (only 4 of Part 3's 20 sections are in). One open conflict to
confirm: Section D's five-nav vs the resolved four-nav (Q13).

## North Star (Volume 2)

> **Every interaction in Aveyra should help two people know each other a little
> better than they did yesterday.**

**Positioning:** Aveyra is a private space for two people to intentionally
understand each other better through meaningful conversations, shared
experiences, and a relationship story they build together. **Daily Questions is
the hero; Memories are the outcome.**

## The one rule above all rules

> Every screen, interaction, and feature must answer:
> **"Does this make the couple's experience better?"** If no, it does not belong.

And its structural corollary (Part 5 Final Rule): *the codebase makes the right
behaviour the easiest behaviour — the architecture itself prevents harmful
features, so no developer discipline is required to avoid them.*

## Permanent prohibitions (Part 2 §1.2 — never build, any phase)

- Experience points, levels, or ranks
- Consecutive-day streaks and loss framing
- Scores, grades, or ratings applied to the relationship
- Leaderboards or comparison of any kind
- Features locked behind earned progress
- Anything that renders one partner's behaviour as a deficit to the other
- Analytics, telemetry, tracking, third-party scripts
- "Relationship health" scores / metrics / activity dashboards

*(Amendment history: 2026-07-20 permitted a backend as an E2EE-only relay; the
[2026-07-21 web-first amendment](amendment-2026-07-21-web-first-two-device.md)
then made Aveyra fully connected, and Volume 2 Sections E–P set the current
privacy model: **staged** — server-side encryption at rest + strict row-level
access controls at launch, schema split into three content classes so client-side
E2EE for sensitive content can be added later. The product never claims E2EE
until it is real.)*

---

## Decisions Log

Records decisions, and any **author-sanctioned deviations** from the Part 1
fixed stack. Deviations are only valid when the Constitution's author approves
them here.

### 2026-07-20 — Pre–Milestone-1 decisions

| # | Decision | Status |
|---|----------|--------|
| 1 | **Begin Milestone 1 now**; do not wait for Volumes 2–4 to start the foundation. | Approved |
| 2 | **Approval cadence A**: Claude presents the plan for approval, then builds milestone-by-milestone, pausing at each testing gate. | Approved |
| 3 | **Persist the Constitution to the repo** under `docs/constitution/`. | Done |
| 4 | **Meta-framework: Next.js 15 static export** (`output: 'export'`, no server runtime/API routes for the frontend). Author's explicit choice (M1 §3); Claude's earlier Vite recommendation withdrawn. | Approved |
| 5 | **Components: fully bespoke** — no shadcn/ui, no Radix. Hand-built, token-driven, accessible base components. *Deviation from Part 1 fixed stack (shadcn/ui), author-selected.* Claude owns WCAG 2.2 AA correctness. | Approved |
| 6 | **Hosting: Vercel** (frontend) + **Supabase** (backend). *(Supersedes the earlier GitHub Pages default, decided 2026-07-21.)* Domain: **aveyra.app** (fallbacks `.co`/`.io`/`.com`). | Approved |
| 7 | **Product name: Aveyra** (Avela = discovery/revelation + Veya = journey/growth → "the journey of discovering, remembering, and growing together"). Supersedes the working title "Weave" used in all Constitution volumes and research. | Approved |
| 8 | **Two-Device Amendment approved** — see [amendment-2026-07-20-two-device.md](amendment-2026-07-20-two-device.md). *(Its "local-first + E2EE-relay" framing was superseded on 2026-07-21 by the web-first amendment + staged privacy.)* All Part 2 §1.2 emotional-safety prohibitions retained. | Approved · partly superseded |
| 9 | **Milestone 1 = two-device-ready, local-first, backend-agnostic foundation.** Sync/identity/encryption/invitation *foundations* built now (client-side, abstract `SyncTransport` + local stub); concrete backend + live cross-device sync + network invitation redemption = **Milestone 2**. | Approved |

### Retained from Part 1 fixed stack (unchanged)

React 19 · TypeScript · Tailwind CSS · Framer Motion · Dexie.js · Zustand ·
React Hook Form · Zod · PWA · Vitest · ESLint · Prettier · pnpm.

### ✅ 2026-07-21 — Resolved decisions (web-first pivot + Volume 2 Sections E–P)

| Decision | Resolution |
|---|---|
| Phase-1 scope | **Full two-device, connected product** (accounts + invitation + sync + async reveal). Offline-first dropped as a promise; graceful disconnect only. See the [web-first amendment](amendment-2026-07-21-web-first-two-device.md). |
| Reveal | **Async two-device reveal** (pass-the-phone retired with the pivot). |
| Sync language | **Valid** — the product truly coordinates across devices. |
| Streak | **Ban kept.** No streaks / loss framing; accumulation-only progress. |
| Navigation | **Four destinations** (Today · Story · Write · Settings). Home + Questions fold into Today. |
| Relationship model | **Neutral `participants` schema** (Participant A/B), partner-forward UI copy. |
| Backend | **Supabase** (auth + Postgres + realtime + RLS). |
| Privacy | **Staged:** server-side encryption at rest + strict RLS now; 3-class content taxonomy (shared / private-device-owned / future-encryptable) so client-side E2EE lands later without a rewrite. **No E2EE claims until real.** |
| Onboarding model | Volume 2 Section B governs: welcome flow → account → create/join space → invitation → first shared experience. |
| Lifecycle | Adopt `Pending / Active / Paused / Archived / Closed` when relationships ship. |
| Supabase sequencing | **Option B** — build against a local mock first; provision the production project when Part 4 begins. |
| Auth | **Email OTP / magic link**; email is the primary identifier. |
| Hosting / domain | **Vercel** + Supabase; domain **aveyra.app**. |
| Question bank | **~200 questions, 10 categories** (see decisions batch); first question fixed. |
| Notifications v1 | **None** — in-app only; push/email later. |
| Beta | Private beta, **5–10 couples**, before public release. |

*(Full detail: [volume-2-parts-3-4-decisions.md](volume-2-parts-3-4-decisions.md).)*

### Binding process — Design Research Policy (Volume 2 §2.X + Section O)

Before any major screen is built, Claude must research proven UX patterns (Apple
HIG, Material 3, NN/g, Laws of UX — all reachable; **Mobbin/Page Flows are
login-gated and generally not reachable from here**, so those are substituted +
flagged), then present a design proposal with **pattern justifications + an
accessibility checkpoint** for approval before implementing. Every feature ships
with a research doc (feature → problem → references → decisions → reasoning). See
[design-research-policy.md](design-research-policy.md) and Section O.

### 🔴 Remaining open items

- **Volume 2 Parts 3–4** — awaited; Milestone 2 build holds until received.
- **Terms of Service & Privacy Policy** — real accounts/backend need legal texts
  (author to provide; honest placeholders can be drafted).
- **Supabase project provisioning** — author-created; URL + anon key needed for
  networked features (local mock until then).
- **Self-hosted brand fonts** (Fraunces/Inter) — later enhancement; system
  stacks ship today.
- **Current build note:** the shipped Milestone-1 app predates the pivot — its
  local-only/PWA copy ("always on your device") is true *for that build* and
  will be revised during Milestone 2, not before.
