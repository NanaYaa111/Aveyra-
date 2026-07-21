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
| [volume-2-part-1-product-ux.md](volume-2-part-1-product-ux.md) | Product overview, vision/mission, IA, target users, Phase 1 scope |
| [volume-2-part-2-ia-journey.md](volume-2-part-2-ia-journey.md) | Information architecture, user journey, relationship lifecycle — ⚠️ contains an unresolved nav conflict |
| [volume-2-part-2-sections-b-c-d.md](volume-2-part-2-sections-b-c-d.md) | Onboarding, Home Dashboard, Daily Questions — ⚠️ assume two-device/accounts/sync/async-reveal; open decisions |
| [design-research-policy.md](design-research-policy.md) | Binding: research proven UX patterns + get design approval before building any major screen |
| [research-dossier.md](research-dossier.md) | Evidence base (competitive analysis + relationship psychology + behavioural/technical research) |
| [positive-love-research.md](positive-love-research.md) | Positive-love evidence extract — what healthy love is, graded; drives Milestone 2 decisions |

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

### ⚠️ Open decision — Phase-1 scope: two-device now vs local-first-first (Volume 2 Sections B/C/D)

Volume 2's onboarding, dashboard, and daily-question sections specify a **full
two-device, account-based, sync-enabled product with an async reveal** as Phase 1.
This reverses Volume 1's deliberately local single-device Phase-1 scope and the
approved "build local-first before sync" sequencing. **Either** build the full
two-device product now (requires the backend + accounts + E2EE key exchange + sync
— a large milestone needing the deferred backend decision) **or** keep the
sequencing (build the local core now; treat Volume 2's two-device flows as the
spec for the next milestone). Almost everything else (reveal type, sync copy,
account fields) resolves from this. **Blocking Milestone 2.**

### ⚠️ Open decision — streak (Volume 2 §21 vs Constitution Part 2 §1.2)

Home Dashboard §21 lists a "current relationship **streak** (if implemented
ethically)." Part 2 §1.2 **permanently prohibits** consecutive-day streaks and
loss framing, and the streak research strongly supports that ban. **Keep the ban
(accumulation-only progress)** or reconsider it? Recommend keeping the ban.

### ⚠️ Open decision — navigation: four vs five destinations (Volume 1 §4.2 vs Volume 2 Part 2 §4)

**Conflict.** Volume 1 Part 2 §4.2 fixes **four** destinations (Today · Story ·
Write · Settings) and forbids a fifth "ever." Volume 2 Part 2 §4 specifies
**five** (Home · Questions · Memories · Journal · Profile), splitting Today into
Home + Questions and renaming the rest. **The shipped app implements the four.**
Until the author decides, **the four-destination model remains in force.** Code
impact of switching: routes, `Navigation`, and `AppShell` (moderate).

### Open decision — Phase-1 onboarding model (Volume 1 §13 vs Volume 2 Part 2 §5)

Volume 1 defines Phase-1 onboarding as **≤3 local screens** (partner name, start
date, optional passphrase, **no account**). Volume 2 Part 2's journey uses
**account creation + partner invitation + activation** — the two-device flow,
which needs the deferred backend. Approved sequencing is *local-first first*, so
the account/invite journey belongs to the later two-device milestone. **To
confirm at Milestone 2 planning.**

### Binding process — Design Research Policy (Volume 2 §2.X)

Before any major screen is built, Claude must research proven UX patterns (Apple
HIG, Material 3, NN/g, Laws of UX — all reachable; **Mobbin/Page Flows are
login-gated and generally not reachable from here**, so those are substituted +
flagged), then present a design proposal with **pattern justifications + an
accessibility checkpoint** for approval before implementing. See
[design-research-policy.md](design-research-policy.md).

### Open decision — `participants` vs `partner` (raised by Positive Love research §6)

The wellbeing evidence is **not romance-specific** (it holds for close-friendship
and familial love too), which argues for modelling **`participants`** rather than a
romantic **`partner`**. This is a genuine fork from the two-romantic-partners
framing, not a silent change. **To be decided at Milestone 2 planning** before the
onboarding/relationship data model is finalized.

### Open questions deferred to Volume 2

Product-flow specifics (daily-question bank & selection, pass-the-phone exact
UX, the "moment after" reveal, memory creation entry points, journal fields,
two-name identity model) are expected to be specified by **Volume 2** and will
be resolved there before the corresponding flows are built.
