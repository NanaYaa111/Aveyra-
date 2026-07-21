# Project Constitution — Index & Governing Record

This directory is the **permanent, durable record** of the project's governing
specification. Per the Claude Code Execution Protocol (Volume 1, Part 5, §7.1),
the relevant sections here **must be read before writing any code**.

> Working sessions are ephemeral; this repo is the only permanent memory.
> If it isn't written here, it isn't binding.

## Product Identity

**Aveyra** — a private, offline-first relationship platform for two people to
connect, preserve memories, and grow together.

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
| [research-dossier.md](research-dossier.md) | Evidence base (competitive analysis + relationship psychology + behavioural/technical research) |

**Status:** Volume 1 complete (Parts 1–5). Volumes 2–4 pending.
Next per the source: *Volume 2 — Product Requirements, Feature Specifications,
User Flows & Detailed Experience Design.*

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

*(Amended 2026-07-20: a backend is now permitted **solely** as an end-to-end-encrypted
sync relay that stores only ciphertext; accounts are minimal pairing identity only.
See the [two-device amendment](amendment-2026-07-20-two-device.md).)*

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
| 6 | **Hosting: static host** for the frontend (target **GitHub Pages** → sets `basePath` + service-worker scope). Backend (E2EE relay) hosting decided at M2. | Approved |
| 7 | **Product name: Aveyra** (Avela = discovery/revelation + Veya = journey/growth → "the journey of discovering, remembering, and growing together"). Supersedes the working title "Weave" used in all Constitution volumes and research. | Approved |
| 8 | **Two-Device Amendment approved** — see [amendment-2026-07-20-two-device.md](amendment-2026-07-20-two-device.md). Aveyra is two-device, local-first, with an E2EE sync relay. All Part 2 §1.2 emotional-safety prohibitions retained. | Approved |
| 9 | **Milestone 1 = two-device-ready, local-first, backend-agnostic foundation.** Sync/identity/encryption/invitation *foundations* built now (client-side, abstract `SyncTransport` + local stub); concrete backend + live cross-device sync + network invitation redemption = **Milestone 2**. | Approved |

### Retained from Part 1 fixed stack (unchanged)

React 19 · TypeScript · Tailwind CSS · Framer Motion · Dexie.js · Zustand ·
React Hook Form · Zod · PWA · Vitest · ESLint · Prettier · pnpm.

### Open questions deferred to Volume 2

Product-flow specifics (daily-question bank & selection, pass-the-phone exact
UX, the "moment after" reveal, memory creation entry points, journal fields,
two-name identity model) are expected to be specified by **Volume 2** and will
be resolved there before the corresponding flows are built.
