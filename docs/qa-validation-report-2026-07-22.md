# QA Validation Report — Aveyra (2026-07-22)

**Submission validated:** the whole project state — the Milestone-1 codebase **plus**
the now-complete constitution record (Volume 1, Volume 2 Parts 1–3 with all
decisions Q13–Q21). **Lens:** "eventually used by thousands or millions." Judged
strictly; missing items are marked missing, not assumed.

*(Supersedes the 2026-07-21 report, which validated the code alone. That report's
two High items — encryption-not-wired, no export — are now FIXED.)*

---

## Executive Summary

Two things are being judged, and they're at very different maturities. **The
specification is essentially complete and excellent** (Part 3 A–T fully recorded,
every conflict/ambiguity resolved, internally consistent — freshly audited). **The
code is a production-grade Milestone-1 foundation, not a product** — the actual
user-facing features remain Milestone-2 work, gated on Volume 2 Part 4 (technical
architecture).

Since the last report, the two High code gaps closed (encryption is now wired into
storage; export/import ships), test coverage went 133 → **159**, and the spec grew
from ~9 of 20 Part-3 sections to **all 20**, with five decisions (Q13–Q17) and four
product defaults (Q18–Q21) resolved and logged. No critical or high defects remain
in the code or the record.

**The single dominant gap is unchanged and expected: the product isn't built.** As
a shippable product for many users it is pre-beta; as a *foundation + blueprint* it
is in excellent shape. **Overall score ≈ 7.4 / 10. Release: 🟠 Needs Major
Revisions** (i.e. build Milestone 2) — but planning/spec readiness is now very high.

---

## Strengths

- **Specification completeness & consistency.** All 20 Part-3 sections recorded with
  Data Model / User Flow / Edge Cases / Acceptance per the author's structure; every
  conflict resolved (nav, categories, auth, architecture, analytics) and logged with
  rationale; the one permanent-prohibition change (Q17) recorded as a dated
  amendment, not a silent edit. A consistency sweep this session fixed the last 3
  cross-reference drifts — the live record now carries **zero** unresolved markers.
- **Honest privacy posture.** Field-level encryption **now actually protects content
  at rest**; journal-owner-only is a hard rule; data-minimization and consent are
  spec'd (Section O/S); no E2EE is claimed until real; the no-analytics stance is
  preserved except a narrow, opt-in, non-content telemetry exception.
- **Engineering quality.** Clean, strictly-typed code; **159 tests** (unit +
  component) + Playwright/axe WCAG 2.2 AA in CI; small static bundle; error boundary;
  self-healing service worker; no unused deps.
- **Guardian discipline.** Decisions that reversed/amended prior approved rules were
  surfaced and confirmed with the author (Q15–Q17) rather than silently applied.

---

## Issues Found

*(Most 2026-07-21 code issues are now fixed — see Remediation history. Current items
are dominated by "not built yet," which is expected at this milestone.)*

| ID | Title | Description | Severity | Impact | Recommendation |
|----|-------|-------------|----------|--------|----------------|
| V-01 | **Product features not implemented** | M1 is foundation; Today/Story/Write are honest empty states. The daily-question flow, reveal, memories, journal, onboarding, pairing are unbuilt. | High | Product | Build Milestone 2 after Part 4 + per-screen design approval. Expected — not a defect in the code that exists. |
| V-02 | **Volume 2 Part 4 not yet received** | The technical architecture (schema DDL, RLS, API, sync engine, deploy, CI/CD, monitoring) is the last spec gate before M2. | High | Technical | Await Part 4; it's the sole blocker to planning the M2 build. |
| V-03 | **Draft question bank not re-mapped to the 9 canonical categories** | `lib/questions/bank.ts` still uses 10 ad-hoc slugs; Section E's canonical 9 govern (Q14). | Medium | Product | Re-map + add Conflict & Repair during the M2 content build. Engine is category-agnostic, so content-only. |
| V-04 | **"Offline-first" copy in the shipped M1 UI** | `layout.tsx`/`settings`/`package.json`/`sw.js` still say offline-first/"on your device," superseded by web-first (Q16). | Medium | Docs/Product | Correct **during** the M2 web-first work (correcting now would misdescribe the still-local build). Tracked (QA-12). |
| V-05 | **Legal texts (ToS / Privacy) not authored** | Section S needs real policies; only the decision to draft honest placeholders exists (Q7b). | Medium | Legal | Draft honest placeholders for beta; full legal review before public launch. |
| V-06 | **Supabase project not provisioned** | Backend, RLS, storage buckets, EU region (Q20) not stood up; M2 features can't run without it. | Medium | Technical | Provision when Part 4 begins (Option B — build against a mock first). |
| V-07 | **Outbox has no pruning** | Synced mutations accumulate; inert today (stub transport marks nothing synced). | Low | Performance | Add prune-on-sync when the real transport lands (QA-18). |
| V-08 | **Part-4-deferred mechanics undefined** | Recently-Deleted retention, exact RLS, 3rd E2EE content class, storage tiers, Relationship-Archive mechanics. | Low | Technical | Intentionally deferred; capture from Part 4. |

## Missing Items

Present-and-intentional gaps (by the project's own sequencing):
- **Product:** the M2 feature set (daily-question flow, reveal, memories, timeline,
  journal, search, onboarding, pairing, settings depth, notifications-in-app).
- **Backend:** Supabase (accounts via email OTP, Postgres, Realtime, RLS, Storage).
- **Spec:** Volume 2 **Part 4** (technical architecture); Volumes 3–4.
- **Content:** the authored ~200-question bank in the 9 canonical categories.
- **Legal:** ToS / Privacy Policy / Cookie Policy / DPA texts.
- **Ops:** telemetry pipeline (opt-in crash/perf), backups/DR, monitoring.

## Risks

- **Schedule/scope (Medium).** Everything past foundation depends on Part 4; the M2
  surface (accounts, sync, reveal, media, RLS) is substantial.
- **Privacy-promise (Low, controlled).** At-rest encryption is now real, and the
  no-analytics amendment is narrow + documented — provided the shipped copy is
  corrected in lockstep with web-first (V-04), messaging won't outrun reality.
- **Data-loss (Low).** Export/import ships and includes soft-deleted rows; the main
  residual is browser eviction between exports (inherent to local caching).
- **Legal (Medium at public launch).** 18+ / EU-region / data-governance need real
  policies + review before opening beyond a private beta.

## Validation Scores (0–10)

| Category | Score | Note |
|---|---|---|
| Requirements | **9** | Part 3 complete (A–T); all conflicts/ambiguities resolved with acceptance criteria. Part 4 (technical) pending. |
| Functionality | **5** | Foundation works; the product itself is unbuilt (M2). |
| UX | **6** | Design system + a11y components + designed empty/error/loading states; no end-to-end flows yet. |
| Architecture | **8** | Clean M1 + a coherent, decided target architecture (web-first, Supabase, participants, four-nav). |
| Database | **7** | Solid local schema + encryption wired + versioned soft-delete; M2 schema catalogued, needs Part-4 DDL. |
| Security | **7** | At-rest encryption active, PBKDF2 600k, honest threat model, OWASP-aligned Section O; backend/auth still M2. |
| Privacy | **8** | Journal owner-only, data-minimization, consent framework, narrow telemetry; strong and honest. |
| Performance | **7** | Fast static export, small bundle, perf targets spec'd (Section Q); unbounded outbox a minor future item. |
| Reliability | **7** | Error boundary, export/import, SWR SW, 159 tests, CI; incident/reliability spec'd. |
| Documentation | **9** | Exceptional, reconciled, freshly audited constitution record; minor stale UI copy (V-04). |
| Maintainability | **8** | Typed, 159 tests, lint-clean, no unused deps, clear module boundaries. |

**Overall ≈ 7.4 / 10** (up from ~7.0 on 2026-07-21).

## Release Recommendation

### 🟠 Needs Major Revisions

**Why (unchanged verdict, improved position).** This is still Milestone 1 — a
foundation, not a product — so against the "thousands/millions of users" bar it is
pre-beta. But the picture is materially stronger than the last report: both former
High code gaps are closed, and the **specification is now complete and
decision-locked through Part 3**, which de-risks the build substantially.

- **Path to 🟡 Ready for Beta:** receive **Part 4** → build the M2 core flows
  (accounts/OTP, Supabase+RLS, pairing, Today/reveal, Story, Write, search) →
  re-map the question bank (V-03) → correct the offline-first copy (V-04) → author
  honest ToS/Privacy placeholders (V-05) → private beta with 5–10 couples.
- **Path to ✅ Production:** the above + backend hardening (rate limiting,
  monitoring, backups/DR) + legal review + accessibility/perf validation under load.

**Bottom line:** nothing is broken or contradictory; the gate is *build*, and the
blueprint to build against is now complete except for Part 4.

---

*Method: code verified green (typecheck, lint, 159/159 tests, static build; git
clean/pushed). Record audited for cross-document consistency (3 drift items fixed
this session; zero unresolved markers remain). Every finding cites specific code or
spec; unbuilt areas are marked missing, not scored as present.*
