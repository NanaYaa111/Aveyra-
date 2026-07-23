# Volume 2 Part 4 — Technical Architecture (Engineering Prompt Library)

**Received:** 2026-07-23 · **Status:** recorded; reconciliation OPEN (see conflict
register at the end). Source: seven `.docx` files — Document 0 and Documents A, B,
C, D, S, T of the "Aveyra Engineering Prompt Library." Duplicate copies of 0, A,
and T were sent; all duplicates are byte-identical.

> Guardian note: Part 4 arrived as an **engineering prompt library**, not as a set
> of finished technical specs. **Document 0** is the substantive one — it carries
> locked decisions. **Documents A, B, C, D, S, T are prompt *scaffolds*** — each
> states a role, scope, deliverables, and a "Do Not" list for the spec that would
> be *generated from* it; they do not themselves contain filled-in architecture.
> So Part 4 today gives us (a) Document 0's locked engineering decisions and (b)
> the table of contents / authoring contract for Sections A–T.

---

## Document 0 — Global Engineering Context (the master prompt)

The single source of truth every section prompt (A–T) must inherit. Its own rule:
*"If a downstream section appears to conflict with a decision recorded here, the
decision in this document wins unless this document is explicitly revised."*

### Product vision (§2)
- **Aveyra** = merge of "Avela" (discovery, revelation, opening up) + "Veya"
  (journey, path, growth). A private platform **for exactly two people**. One
  dedicated space to connect, preserve memories, plan time together, and grow.
- Guiding principles: **two people, one space**; **privacy is the product, not a
  feature**; **calm over engagement** (no infinite feeds, streak-shaming,
  manipulative push); **durable by default**; **accessible and inclusive**.

### Product summary & features (§3)
- "An offline-capable, premium couples **web application** — built first for the
  browser, with a clear path to Android, iOS, and desktop."
- **Core Feature Areas (§3.1):** Memory Vault · Private Messaging · Date Planner ·
  Journal · Emotional Wellness · **Gamification** ("light, non-manipulative
  mechanics — milestones, shared achievements — that reinforce connection rather
  than compulsive use").
- **Non-goals (§3.2):** not dating/matchmaking; not a social network; no
  behavioral advertising / growth-hacking analytics / data resale; not a clinical
  or diagnostic mental-health tool.

### Locked architectural decisions (§4)
| Area | Locked decision |
|---|---|
| Platform | **Web-first with graceful offline support**; same core codebase can extend to native Android/iOS/desktop later. |
| Offline / local-first data | Client-side persistence via **IndexedDB (Dexie)**; a sync layer is *architected for but not required to ship* in the first release. |
| Authentication | **Passwordless email OTP.** No stored passwords; no social login unless explicitly revisited. |
| Telemetry | **Operational only** — reliability, error tracking, performance. No behavioral analytics / engagement scoring / ad tracking. |
| Privacy posture | Privacy-first by architecture; data scoped to the two account holders; encryption + access control designed in from the start. |
| Accessibility posture | **WCAG 2.1 AA** as the working baseline, not a post-launch pass. |
| Project isolation | Fully independent of the Easy Votes / Nue Labs coursework project. |

§4 open item (raised by Document 0 itself): *"web-first with graceful offline
support" vs an earlier "offline-first" phrasing* — flagged for confirmation before
Section B. **→ Resolved by the user as web-first (open-questions Q16).**

### Fixed technology stack (§5)
| Area | Locked choice |
|---|---|
| Framework | **Next.js 15 (App Router), React 19, TypeScript** |
| Styling / UI | **Tailwind CSS, shadcn/ui, Framer Motion** |
| State management | **Zustand** |
| Forms & validation | **React Hook Form + Zod** |
| Local persistence | **Dexie (IndexedDB)** |
| Offline delivery | **PWA with service workers** |
| Data visualization | **Recharts** |
| Testing | **Vitest + React Testing Library** |
| Package manager | **pnpm** |
| Server (set aside) | An earlier **NestJS + PostgreSQL** backend is set aside in favor of local-first; do not reintroduce without an explicit decision. |

### Constitutional rules (§6)
- **Always:** design for exactly two account holders; smallest data collection that
  satisfies the feature; keep offline/local-first functional (network is an
  enhancement); meet WCAG 2.1 AA on every new surface; keep Aveyra separate from
  Easy Votes; write specs an engineer can implement with minimal follow-up.
- **Never:** introduce passwords / social login / extra identity providers without
  a documented decision; add behavioral analytics / engagement scoring / ad SDKs;
  design manipulative retention mechanics (streak-shaming, FOMO, dark-pattern
  upsells); assume server-side persistence; contradict a §4 locked decision in a
  downstream section without flagging it.

### Naming, philosophy, privacy, a11y (§7–§11)
- **Naming (§7):** product always "Aveyra" (never an acronym); files/dirs
  kebab-case; components PascalCase; vars camelCase (booleans `is/has/should`);
  types PascalCase (no `I` prefix); Zustand stores `useXStore`; **Dexie tables
  plural snake_case** (`memory_entries`, `journal_entries`); Conventional Commits.
- **Philosophy (§8):** explicit over clever; co-locate by feature folder; strict
  TypeScript; every mutating function safe to call offline and never silently
  loses data; composition over config flags; a11y at build time; perf budget =
  instant on a mid-range mobile device.
- **Privacy (§10):** data minimization; every record scoped to one relationship;
  local-first encrypted at rest where the platform allows; any future sync
  encrypts in transit and ideally end-to-end; no third-party trackers.
- **A11y (§11):** WCAG 2.1 AA baseline; keyboard-operable; alt text for meaningful
  images; `prefers-reduced-motion` respected; non-clinical wellness/journal copy.

### Process rules (§12–§16)
- Research method: state the question, prefer primary sources, present trade-offs,
  check against §4/§5, flag time-sensitive guidance.
- Cross-section consistency: every section opens by affirming Document 0; feature
  names match §3.1 exactly; any new decision is marked **"Proposed — not yet
  locked"** until folded back into Document 0; deviations from a locked decision
  must be stated explicitly and flagged for a Document 0 revision — never silent.
- Output shape for A–T: Executive Context · AI Role · Scope & Objectives ·
  Constraints · Deliverables · Required diagrams/tables · Edge cases · Validation
  checklist · Acceptance criteria · "Do Not" list.

---

## Documents A–T — section prompt scaffolds

**Received (2026-07-23):** Document 0 + the **complete A–T set** (A, B, C, D, E, F,
G, H, I, J, K, L, M, N, O, P, Q, R, S, T; duplicate copies of 0, A, S, T are
byte-identical). **All are prompt scaffolds EXCEPT Document P**, which arrived as a
FULL, filled-in specification (see its own subsection below). The substantive locked
decisions otherwise all live in Document 0. Per-section notes:

- **A — Architecture Principles & Technical Vision.** Role: Principal Software
  Architect. Wants: technical-vision statement; 8–12 architecture principles;
  C4 L1 System Context + C4 L2 Container diagrams; offline write-path flowchart;
  quality-attributes table (perf/availability/privacy/a11y/maintainability/
  portability) with targets + verification; an ADR for the local-first strategy;
  a top-5 risk register (IndexedDB limits, schema migration, multi-device
  consistency without sync, data loss on device loss). Explicitly: cross-device
  edits before a sync layer exists are a **deferred** concern; do not design as if
  a sync backend already exists.
- **B — Technology Stack & Development Environment.** Role: DevOps/Platform
  Engineer. Wants: full stack inventory (library/version/purpose/rationale); dev
  setup guide; build-config summary; dependency-upgrade + security-scanning
  policy; `package.json` script template.
- **C — Frontend Architecture.** Role: Senior Frontend Architect. Wants: folder
  structure (`app/`, `features/`, `components/`, `hooks/`, `utils/`); component
  taxonomy; routing spec (names routes: **memory vault, journal, planner, chat,
  settings**); RHF+Zod form pattern; layout/navigation spec; Tailwind color/type
  system. Explicitly names **shadcn/ui** as the UI-library pattern.
- **D — Backend Architecture & Sync Layer (Future Phase).** Role: Backend
  Architect. Wants: REST-ish API spec; a **PostgreSQL** schema; conflict-resolution
  algorithm (LWW / OT / CRDT); a **NestJS** project-structure template *"if/when
  this phase is greenlit."* Entire section is explicitly future/optional.
- **S — Documentation & Knowledge Management.** Role: Technical Writer. Wants: ADR
  process + template; comment guidelines; README structure; inline docs for
  complex algorithms; onboarding checklist.
- **T — Future Architecture & Technical Roadmap.** Role: Technical Strategist.
  Phased rollout: **Phase 1 web-only · Phase 2 sync backend · Phase 3 native
  apps.** Wants: phased roadmap; inter-phase dependencies; known tech debt
  (NestJS backend, multi-device sync, native apps); research items (CRDTs, E2EE);
  graduation criteria between phases.

### Sections E–R — remaining scaffolds (notes + how they touch our build)
- **E — Local Data Layer & Dexie Schema.** Entities named: memories, journal
  entries, **messages, dates**, relationships, settings; "Zustand slices" for the
  data-access layer. → reinforces **Q22** (scope: messages/dates) and **Q24**
  (Zustand). Also wants ERD + migration patterns + backup/export (we have export).
- **F — Offline & Sync Architecture.** Define "works offline" per feature; sync
  state machine (online/offline, queued/syncing/done); conflict resolution;
  cache invalidation. Future-phase; consistent with our outbox/pending-queue model.
- **G — Authentication & Authorization.** End-to-end **passwordless OTP** flow;
  session lifecycle (no stored passwords); authz = a user only sees their own
  relationship's data. ✓ consistent (Q15).
- **H — Privacy & Data Protection.** Data-collection lockdown; **encryption at
  rest + in transit**; retention/deletion; GDPR. ✓ consistent (matches our field
  encryption + archive-on-dissolution).
- **I — Security Architecture.** Threat model (unauthorized access, exfiltration,
  account takeover); per-layer controls; secure coding (input validation, XSS,
  CSRF). ✓ consistent.
- **J — Accessibility Architecture.** **WCAG 2.1 AA**, build-time a11y, semantic
  HTML/ARIA/keyboard/screen-reader, contrast/focus/motion. We exceed at **2.2 AA**
  (see C-5). ✓
- **K — Performance & Optimization.** Measurable budgets (initial paint,
  interaction latency, bundle size); code-split/lazy-load/image opt; caching. ✓
  consistent with our perf posture.
- **L — Testing Strategy & Coverage.** Names **Vitest + RTL + Playwright** and
  a11y testing. ✓ matches our actual lanes (extends Document 0 §5, which listed
  only Vitest+RTL — Playwright is a welcome, consistent addition).
- **M — Error Handling & Resilience.** "Never silently fails or loses data";
  error boundaries; retry logic; storage-quota handling. ✓ matches our
  ErrorBoundary + atomic import + outbox.
- **N — Deployment & DevOps.** CI/CD (test/staging/prod); rollout + rollback;
  hosting/CDN/domain/SSL; incident runbooks. (Phase-appropriate; Supabase +
  Vercel per our decisions — see C-4.)
- **O — Monitoring, Logging & Telemetry.** **Operational telemetry only**, no
  behavioral analytics/engagement metrics; health dashboards without invading
  privacy. ✓ consistent (Q17).
- **Q — Frontend Components & Design System.** "**shadcn/ui as the base**, extended
  with Aveyra-specific components"; **design tokens** (colors, spacing, typography,
  shadows, animations). Our token-based "First Light on the Path" system matches
  the *tokens* intent; the *shadcn/ui base* reinforces **Q24**.
- **R — Mobile & Native App Strategy.** Phase-3 native (React Native / Flutter /
  native); feature parity; app-store deployment. Deferred; consistent with our
  web-first-with-native-path posture.

---

## Document P — API Design & Integration (the one FULL spec)

Unlike the scaffolds, P is a complete API contract. Substance:

**Phase-1 auth (passwordless OTP):**
- `POST /auth/request-otp` → `{requestId, expiresIn:600}`; 6-digit code, **10-min**
  validity; rate limit **3/min per email, 10/hr per IP**; response **does not reveal
  whether the email is registered** (enumeration protection).
- `POST /auth/verify-otp` → `{token(JWT), expiresIn:2592000 (30d), user}`; **5
  attempts per requestId** then backoff; OTP invalidated after 3 failed attempts.
- `POST /auth/logout` (204; server-side revocation optional in Phase 1);
  `GET /auth/me` (validate token on load).
- Sessions = **signed JWT** (`sub/email/iat/exp`), stateless, stored client-side
  (localStorage/IndexedDB), sent as `Authorization: Bearer`.

**Phase-2 sync (deferred contract):** `POST /sync/pull` (delta since timestamp for
named entities — uses `memories`, `journal_entries` snake_case) and `POST
/sync/push` (client changes → acks with server timestamps + conflict metadata).
**Last-write-wins** by timestamp; all sync scoped to the relationship.

**Cross-cutting:** uniform error schema `{error, message, details}` + a fixed status
/ error-code table (400/401/403/404/409/429/500/503); rate-limit headers
(`X-RateLimit-*`, `Retry-After`); **URL versioning** (`/v1/…`, 6-mo deprecation);
testing via mock server (MSW/Mirage) + contract tests (Pact) + integration + E2E;
OTP email via a third-party service (SendGrid/Mailgun/SES) — subject "Your Aveyra
verification code…", **no tracking pixels**; **no PII/OTP/JWT in logs**;
operational-only telemetry (p50/p95/p99, error rates, email success); TLS 1.2+,
CORS to trusted origins only, `SameSite=Strict`.

**Guardian reconciliation (feeds C-4/Q25):** P describes a **hand-rolled** auth +
sync backend. Our confirmed choice is **Supabase**, whose Auth (GoTrue
`signInWithOtp`/`verifyOtp`) already provides these `/auth/*` semantics, JWT
sessions, email delivery, and RLS-based relationship scoping. So P is best treated
as the **behavioural contract our Supabase integration must satisfy**, not an
instruction to build a custom server. Its *principles* (10-min OTP, enumeration
protection, rate limits, relationship scoping, no-PII logs, operational-only
telemetry, versioning, error-shape consistency) are all consistent with our
decisions and worth honoring regardless of transport. The only conflict is the
same one already open: **custom backend (P/D) vs Supabase (confirmed)** — P widens
C-4 to cover Phase-1 auth transport, not just the future sync layer.

---

## FULL specifications received (B, C, D, E, F, G, P — 2026-07-23)

Beyond the scaffolds, **seven sections arrived as complete, filled-in specs** (10–17K
each). They add concrete detail but **no new conflict category** — each sharpens one
of the four already open. Read in full:

- **B (Tech Stack, full).** Pins the entire Document-0 stack with versions:
  shadcn/ui, framer-motion ^11, zustand ^4.5, react-hook-form ^7.5, zod ^3.22,
  recharts ^2.10, workbox, clsx, class-variance-authority, date-fns, uuid, husky.
  Also: **`src/` layout** with `@/*` aliases; **`next build`/`next start` (SSR)** not
  static export; Husky pre-commit; `@types/react ^18`. → all **C-3/Q24**. (Our M1:
  bespoke, runtime deps = dexie/next/react/react-dom only; static `output:'export'`.)
- **C (Frontend, full).** Routes = **`/memories`, `/journal`, `/planner`, `/chat`,
  `/wellness`, `/settings`** (+ `/sign-in`, `/verify-otp`). **No Daily-Questions
  surface at all** — no `/today`, `/story`, `/write`. Our entire four-nav is absent.
  → strongest evidence for **C-1/Q22**. Also `features/` + Zustand stores + shadcn/ui
  + RHF/Zod (**Q24**) and a **navy/maroon palette `#1F2A44` / `#8A3B52`** vs our
  Evergreen "First Light on the Path" (design divergence under Q24).
- **D (Backend/Sync, full).** **NestJS + PostgreSQL + TypeORM** Phase-2 blueprint;
  custom `/auth` + JWT guards; LWW conflict resolution; treats Supabase as merely one
  managed-Postgres *host* option. → **C-4/Q25** (we chose Supabase-native: GoTrue +
  RLS + Realtime, no NestJS tier). Correctly keeps Phase-1 backend-agnostic. Tables
  include `dates`, `messages` (**Q22**).
- **E (Dexie schema, full).** Tables = **`memories, journal_entries, dates,
  messages, settings`** — **omits the Daily-Questions core** (no `questions`/`answers`/
  `revealSessions`) and **adds `dates`+`messages`** (**Q22**). `src/lib/db.ts`,
  repository pattern, `sync_state`, soft-deletes. **Plaintext local storage** (no
  field encryption) — *weaker* than our built client-side AES-GCM encryption. Has a
  `rating?: 1–5` on memories ("how memorable") — a private self-rating, watch under
  **Q23** but not gamification/comparison as written.
- **F (Offline/Sync, full).** Optimistic writes; 5-state sync machine; IndexedDB
  queue; exponential backoff (1s→30s); LWW; **Zustand `syncStore`**; SW background
  sync (Phase 2). Consistent with our **outbox** model; only Zustand touches **Q24**.
  (Note: F says "offline-first" in one line — superseded by web-first, Q16.)
- **G (Auth, full).** Custom OTP → self-signed **HS256 JWT** (`sub/email/
  relationshipId/exp/iss/aud`, 30-day); **Zustand `authStore`**; hybrid
  memory+localStorage token; relationship scoping via JWT claim + FK check; rate
  limits; 403-not-404. → **C-4/Q25** (Supabase Auth provides all this) and **Q24**
  (Zustand). Principles (no passwords, relationship isolation, no-PII logs) ✓.
- **P (API, full).** Recorded in its own section above.

**Quality-attribute full specs (Security, Accessibility, Performance, Testing,
Error Handling) — 2026-07-23.** *(Note: this FULL batch re-lettered — H=Security,
I=Accessibility, J=Performance, K=Testing, L=Error Handling — a shift from the
scaffold lettering where H=Privacy/I=Security/J=Accessibility/etc.)* All are
consistent with, or below, what M1 already ships — no new conflicts:
- **H — Security.** Threat model; CSP + HSTS + HTTPS/TLS 1.3; Zod input validation;
  parameterized queries; rate limits; no-PII logs; GDPR 72h breach + RTBF hard-delete
  on account deletion; Dependabot/Snyk; quarterly/annual pen-tests. §7.2 states
  **Phase-1 does not encrypt at rest** (device trusted) and E2EE is a Phase-2 option
  → **we exceed** (AES-GCM field encryption now). Zod/TypeORM refs → Q24/Q25.
- **I — Accessibility.** **WCAG 2.1 AA**, semantic HTML/ARIA, keyboard, jest-axe +
  Lighthouse + manual AT testing, contrast 4.5:1. We run **2.2 AA** via
  @axe-core/playwright → **we meet/exceed** (C-5).
- **J — Performance.** Core Web Vitals targets — **LCP < 2.5s, FID < 100ms, CLS <
  0.1, Lighthouse ≥ 90**, `<2s` on 4G, bundle budget, WebP @75%, `React.memo`/
  `useMemo`, Zustand batching. Concrete targets worth adopting regardless of the Q24
  outcome; Zustand/Framer references → Q24.
- **K — Testing.** **≥80% coverage (90% goal)**; but leans **jest + Cypress**
  where M1 uses **Vitest + Playwright + @axe-core/playwright** → Q24 (test tooling).
  Coverage ≥80% is a useful concrete bar to adopt.
- **L — Error Handling.** Retry with exponential backoff **+ jitter**; typed error
  taxonomy; **error boundary**; safe logging (no PII). Matches our ErrorBoundary +
  outbox retry. Adopt the ±10% jitter detail when we build M2 sync.

**Where our build is *stricter* than the spec (keep ours; no action):**
- **Encryption:** we ship client-side AES-GCM field encryption + PBKDF2-600k;
  D/E store local data in plaintext and treat E2EE as "optional/future." We exceed.
- **Accessibility:** WCAG **2.2 AA** vs the specs' 2.1 AA (C-5). We exceed.

---

## GUARDIAN CONFLICT REGISTER — OPEN (pending your decision)

Document 0 predates several decisions we later locked together (Volume 1, Volume 2
Part 3, and the Q13–Q21 resolutions). Where they disagree, I will **not** silently
pick a winner. Each conflict below is a decision that is genuinely yours.

### C-1 — Product scope & the Daily-Questions thesis  🔴 material
- **Constitution (ours):** *"Daily Questions is the hero; Memories are the
  outcome."* Four-nav MVP (Today / Story / Write / Settings); photos-only.
- **Document 0 §3.1:** six core areas — Memory Vault, **Private Messaging**,
  **Date Planner**, Journal, **Emotional Wellness**, **Gamification**. Daily
  Questions is **not mentioned at all**.
- Question: is Document 0 the *earlier, broader* vision that our focused
  Daily-Questions MVP now supersedes (or scopes down to phase 1)? Or does it
  re-expand the product to those six areas?

### C-2 — Gamification vs a permanent prohibition  🔴 touches a permanent rule
- **Constitution (Part 2 §1.2, permanent prohibition):** no streaks / XP / levels
  / scores / leaderboards / comparison — *at all*.
- **Document 0 §3.1:** explicitly lists **Gamification** as a core area — "light,
  non-manipulative mechanics (milestones, shared achievements)." (§6 still bans
  streak-shaming and FOMO, but §3.1 permits light milestones/achievements.)
- These directly contradict. Per my guardian role I must ask before reversing a
  permanent prohibition — I will not adopt milestones/achievements on my own.

### C-3 — UI / state / forms / viz stack  🟠 build already diverges
- **Document 0 §5 (fixed stack):** Tailwind **+ shadcn/ui + Framer Motion +
  Zustand + React Hook Form + Zod + Recharts**.
- **What M1 actually built (deliberately):** Tailwind + **bespoke, accessible,
  zero-runtime-dependency** components; **no** shadcn/ui, **no** Framer Motion,
  **no** Zustand, **no** RHF/Zod, **no** Recharts. Runtime deps are exactly:
  `dexie`, `next`, `react`, `react-dom`. This was a considered choice (a11y
  control + static-export + minimal supply-chain surface).
- Matching parts (no conflict): Next.js 15 App Router, React 19, TS strict, Dexie,
  PWA/service worker, Vitest, pnpm.
- Question: keep the bespoke zero-dep stack, or adopt Document 0's named libraries?

### C-4 — Backend: Supabase vs NestJS + PostgreSQL  🟠 stale in Document 0
- **Confirmed by you (Q15/Q20, re-confirmed today with Supabase-specific
  reasoning):** **Supabase** (EU region, London/Frankfurt), passwordless
  `signInWithOtp` / `verifyOtp`, Storage with RLS.
- **Document 0 §5 + Document D:** frame the future backend as **NestJS +
  PostgreSQL** (set aside for now). Document D still asks for a NestJS template.
- **Document P (full spec)** widens this: it specifies a **hand-rolled Phase-1
  auth API** (`/auth/*`, self-signed JWTs, direct email-service integration) —
  work Supabase Auth provides off the shelf. Under Supabase we consume the SDK
  rather than build these endpoints; P becomes the *behavioural contract* to match.
- Recommendation (guardian): Supabase wins — it is the more recent, explicit,
  repeatedly-confirmed decision. Document 0 §5 and Document D should be **revised**
  to name Supabase as the Phase-2 sync backend. I flag this rather than editing
  Document 0's decisions unasked.

### C-5 — Accessibility baseline  🟢 no action (we are stricter)
- Document 0: **WCAG 2.1 AA**. Our build/CI: **WCAG 2.2 AA** (a superset). We
  exceed Document 0's baseline; keep 2.2 AA.

### C-6 — Dexie table naming  🟢 minor
- Document 0 §7: tables **plural snake_case** (`memory_entries`, `journal_entries`).
- Built schema: `users, relationships, questions, answers, revealSessions,
  memories, journalEntries, exportRecords, settings, images, keyvault, outbox` —
  mixed (some camelCase). Low-stakes; align opportunistically if we touch schema.

### Consistent / confirmed (no conflict)
- Product name **Aveyra**; DB name `aveyra`. ✓
- Web-first + graceful offline (Q16) — Document 0's own §4 open item, now resolved;
  matches our V-04 copy ("graceful offline"). ✓
- Passwordless OTP (Q15), operational-only telemetry (Q17), 18+ (Q19), EU region
  (Q20), archived-copies-on-dissolution (Q21), photos-only (Q18). ✓
- Privacy-first, two-people-only, data-minimization, durable-by-default. ✓
