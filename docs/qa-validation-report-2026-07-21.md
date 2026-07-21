# QA Validation Report — Aveyra

**Date:** 2026-07-21 · **Scope:** the committed codebase on `claude/offline-couples-website-cxeptq` (Milestone 1 foundation + tonight's question foundation & test hardening).
**Reviewers:** primary audit + three independent AI reviewers (question-engine logic, test-suite quality, integration/build).
**Lens requested:** "eventually used by thousands or millions" — judged strictly against that bar.

---

## Executive Summary

The codebase is a **high-quality Milestone-1 foundation, not yet a shippable product.** Engineering quality is strong: clean architecture, strict TypeScript, 133 passing tests across two lanes, WCAG 2.2 AA verified in CI, and a static build that ships ~109 kB first-load JS. Three independent reviews plus this audit found **no critical defects** and confirmed the rotation engine is sound on the real 201-question bank.

However, judged as a product for many users, it is **pre-beta**: the actual user-facing features (daily-question flow, answering, reveal, memories, journaling, onboarding, pairing) are **not built** — most screens are honest empty states — and two foundation-level gaps must close before real data is entrusted to it: **field-level encryption is implemented but not wired into storage** (content is currently plaintext in IndexedDB), and there is **no data export/import** despite local persistence being explicitly "never guaranteed."

This pass **fixed 9 confirmed issues** (1 High, 3 Medium, 5 Low) surfaced by the reviews; **12 items remain as tracked recommendations** (2 High, 5 Medium, 5 Low), most of which are Milestone-2 work by design.

**Overall score: 6.5 / 10** · **Release recommendation: 🟠 Needs Major Revisions** (expected for this milestone stage — the foundation is production-grade; the product is not built yet).

---

## Strengths

- **Architecture & boundaries.** Backend-agnostic modules (invitation, sync, identity, questions) sit behind clean interfaces; the DatabaseService is the single storage path; the SyncTransport boundary lets a real backend drop in without touching callers.
- **Accessibility.** Bespoke components with correct ARIA wiring; axe (serious/critical) passes on every route in CI; focus trap, live regions, reduced-motion, 44px targets, visible focus.
- **Honesty discipline.** The encryption module documents an accurate threat model; sync UI is deliberately absent until sync exists; no analytics/tracking; permanent prohibitions (streaks/scores/ranking) are enforced *in tests* against the question bank.
- **Test depth.** 133 tests: crypto auth-tag/tamper, PBKDF2 lock/unlock, DB versioning/soft-delete, deterministic rotation invariants (600-day no-repeat, cycle exhaustion), and component a11y/interaction. Verified stable across repeated and isolated runs.
- **Determinism.** The question rotation is a pure, seeded, serialisable state machine — reproducible and trivially testable.

---

## Issues Found

### Fixed in this pass (commit accompanying this report)

| ID | Title | Sev | Impact | Resolution |
|----|-------|-----|--------|-----------|
| QA-01 | **Modal backdrop-dismiss broken** — dismiss handler is on the overlay container, but the visible scrim child intercepted clicks (no `pointer-events-none`), so clicking the visible backdrop never closed the dialog. Test only checked the negative half, masking it. (`components/ui/Modal.tsx:54`) | High | UX / Functional | Added `pointer-events-none` to the scrim; added a structural regression guard + overlay-dismiss + panel-negative tests. |
| QA-02 | **Rotation empty-pool returns `undefined` as a `questionId: string`** — `createRotation('x', [], …)` then a second day dereferenced `order[0]!` on an empty array. (`lib/questions/rotation.ts:155`) | Medium | Technical | `advance` now guards an empty pool and always returns a real id. |
| QA-03 | **Rotation idempotency gated on truthiness** — same-day guard used `&& currentQuestionId`, so a falsy id (empty pool / empty-string id) re-entered `advance`, drifting the cycle counter. (`lib/questions/rotation.ts:179`) | Medium | Technical | Guard now keys on `assignedDateKey === dateKey && currentQuestionId != null`; added empty-pool idempotency test. |
| QA-04 | **Misleading "tampered token" test** — claimed tamper-resistance the format lacks (plaintext base64url, no MAC; 16/128 single-char mutations decode cleanly). (`tests/unit/invitation-extended.test.ts:58`) | Medium | Security / Docs | Reframed to test *structural* validation honestly; added an explicit "no integrity — authenticity is server-side (M2)" note in `lib/invitation/index.ts`. |
| QA-05 | **`__setDB` singleton never reset** — dormant order-dependence hazard (inert only because Vitest isolates per file). (`tests/unit/keyManager.test.ts:11`) | Low-Med | Maintainability | Added `afterEach` reset of the module singleton. |
| QA-06 | **`resolveConflict` edge cases untested** — argument-order symmetry and version/timestamp ties unverified. (`tests/unit/sync.test.ts`) | Low | Technical | Added order-agnostic + tie tests. |
| QA-07 | **Hollow assertions** — `aria-hidden` checked without value; body-scroll restore asserted `not 'hidden'` instead of the saved value; two component files relied on implicit auto-cleanup. | Low | Maintainability | Tightened to exact values; added explicit `afterEach(cleanup)`. |
| QA-08 | **Redundant Tailwind token** — nested `text.onAccent` compiled to an unused `text-text-onAccent` (leftover from an earlier fix). (`tailwind.config.ts:32`) | Low | Maintainability | Removed the dead nested entry; the used top-level `onAccent` remains. |
| QA-09 | **Question wording** — near-duplicate pair (`q-dreams-12` ~ `q-play-08`) and a borderline "small win" phrasing near the anti-competition rule. | Low | Product | Reworded both. |

### Outstanding (tracked recommendations — not changed in this pass)

| ID | Title | Sev | Impact | Recommendation |
|----|-------|-----|--------|----------------|
| QA-10 | **Field-level encryption not wired into storage.** `KeyManager`/`Cipher` exist and are tested, but nothing calls them and there is no onboarding to create the vault — so `answers`, `memory.description`, `journalEntry.content`, `partner_name` are stored **plaintext** in IndexedDB. (`lib/database/service.ts`) | **High** | Security / Privacy | Wire encrypt-on-write / decrypt-on-read through the DatabaseService and build the key-setup step **before** real user content is stored. Until then, do not present the app as protecting data at rest. |
| QA-11 | **No data export/import.** `storage.ts` warns persistence "is never a guarantee" and Settings promises export "as the app grows," but nothing implements it. Only `recordExport` bookkeeping exists. | **High** | Reliability / Product | Implement JSON export (download) + import before real use; it is the only backstop against IndexedDB eviction/data loss. |
| QA-12 | **"Offline-first" copy contradicts the web-first pivot.** `app/layout.tsx` metadata, `settings/page.tsx`, `package.json` description, `public/sw.js`, and an e2e test name still say offline-first/"stays on your device," which the reconciled docs supersede for M2. | Medium | Docs / Product | Reconcile copy **when** M2 web-first work lands — not before (correcting it now would claim web-first while the code is still local). Tracked in the constitution as a known M2 item. |
| QA-13 | **Service worker ships a stale shell after deploys.** Cache-first with a hard-coded `CACHE = 'aveyra-v1'`; the precached HTML shell only refreshes when a human bumps the constant. (`public/sw.js:7`) | Medium | Reliability | Derive the cache name from the build id / automate the bump so a forgotten bump can't serve stale UI. |
| QA-14 | **Soft-delete journals `version: 0` and doesn't bump the record version.** `softDelete`/`restore`/`purge` call `journal(…, 0)`; a future last-writer-wins sync would mis-resolve deletes. Inert today (stub transport). (`lib/database/service.ts:83,86,93,102`) | Medium (latent) | Technical | Bump `version` on soft-delete/restore and journal the real version when the sync transport lands. |
| QA-15 | **No top-level React error boundary** — an unhandled render error white-screens the app. | Medium | Reliability / UX | Add a bespoke `ErrorBoundary` around the shell with a calm recovery surface. |
| QA-16 | **Unused heavy dependencies** — `framer-motion`, `react-hook-form`, `zod`, `zustand` are declared in `dependencies` but imported nowhere. | Medium | Maintainability / Security | Remove until actually used (re-add in M2); every declared dep is supply-chain surface. |
| QA-17 | **PBKDF2 iteration count below current guidance** — 210k vs OWASP 2023's 600k for PBKDF2-HMAC-SHA256. (`lib/encryption/primitives.ts:15`) | Low-Med | Security | Raise to ~600k (measure unlock latency on target devices). |
| QA-18 | **Outbox grows unbounded** — with the stub transport nothing is marked synced, so mutations accumulate in IndexedDB indefinitely. | Low | Performance | Add a prune/cap policy, or accept as inert until real sync and document it. |
| QA-19 | **Untested modules** — `lib/identity` and `lib/platform/storage` have no unit tests. | Low | Maintainability | Add coverage (device-id persistence, self-user creation, storage-status fallbacks). |
| QA-20 | **`persistent_storage_granted` never written** — the settings field exists but `PwaInit` requests persistence without recording the result. | Low | Maintainability | Persist the outcome or drop the field. |
| QA-21 | **Rotation, theoretical** — a backward `dateKey` jump advances (burns a question); seed-adjacent relationships can produce correlated per-cycle orders (`seed + cycle`). | Low | Technical | Documented via code comment; add a monotonic-date guard / `hash(seed, cycle)` if these conditions are reachable in deployment. |

---

## Missing Items

Present-and-intentional gaps (mostly Milestone 2 by the project's own sequencing):

- **Product features:** daily-question UI, answering, async reveal, memories create/view, journaling, onboarding, relationship setup & pairing. *(M2)*
- **Backend:** accounts (email OTP), Supabase (Postgres + Realtime + RLS), the real sync transport. *(M2)*
- **Security/ops that require a server:** authN/authZ, rate limiting, API-abuse defense, session management, monitoring/observability, backups/recovery. *(N/A now — no server; M2)*
- **Applied privacy mechanics:** encryption actually protecting stored content (QA-10), export/import (QA-11), Recently-Deleted UI, account/data-deletion flow.
- **Legal:** honest draft ToS / Privacy Policy text (decided as placeholders, not yet authored).
- **Deliberately excluded (v1):** push notifications, analytics/tracking, streaks/scores.

---

## Risks

- **Privacy-promise risk (High).** Storing plaintext content (QA-10) while the UI says "your data stays yours" would be a false promise. Encryption must be wired before real users. The docs already forbid E2EE claims until real — keep that discipline for at-rest claims too.
- **Data-loss risk (High).** Non-guaranteed persistence + no export (QA-11) means a browser eviction loses everything irrecoverably.
- **Trust/honesty risk (Medium).** Stale "offline-first" copy (QA-12) must be reconciled in lockstep with the actual architecture so messaging never outruns reality.
- **Deploy risk (Medium).** Stale SW shell (QA-13) can serve old UI after a release.
- **Schedule/scope risk.** The product is still foundation; a usable beta depends on Milestone 2, which is gated on Volume 2 Parts 3–4 (pending) and per-screen design approval.

---

## Validation Score (0–10)

| Category | Score | Note |
|---|---|---|
| Requirements | 7 | M1 requirements clear & reconciled; M2 specs (Parts 3–4) pending, so some acceptance criteria not yet measurable. |
| Functionality | 5 | Foundation works; product features not built (empty screens). |
| UX | 6 | Excellent a11y and designed empty/error/loading states; no real end-to-end flows yet. |
| Architecture | 8 | Clean separation, backend-agnostic seams, testable. |
| Database | 6 | Solid local schema/soft-delete/versioning; encryption unwired, `version:0` on deletes, no export. |
| Security | 5 | Honest, well-built crypto **module** — but not applied; PBKDF2 low; no server surface yet. |
| Privacy | 6 | Local-only, no tracking; but at-rest protection & export not active. |
| Performance | 7 | Small bundle, fast static export; unbounded outbox is a minor future concern. |
| Reliability | 5 | Offline SW + soft-delete/undo; no error boundary, no backup/export, stale-shell risk. |
| Documentation | 8 | Extensive, reconciled record; minor live "offline-first" copy contradiction. |
| Maintainability | 8 | Clean, typed, 133 tests, lint-clean; unused deps the main ding. |

**Overall: ≈ 6.5 / 10.**

---

## Release Recommendation

### 🟠 Needs Major Revisions

**Why.** This is Milestone 1 — a deliberately foundational slice — so the verdict is *expected*, not alarming. The engineering is production-grade in quality (CI-green, 133 tests, a11y AA, clean architecture) and no critical defects survived review. But against the "thousands/millions of users" bar it is pre-beta on two axes:

1. **The product isn't built yet** — the daily-question experience and every other core feature are Milestone-2 work.
2. **Two foundation gaps must close before real data is entrusted:** wire encryption into storage (QA-10) and ship export/import (QA-11).

**Path to 🟡 Ready for Beta:** deliver the M2 core flows, close QA-10 and QA-11, add the error boundary (QA-15), reconcile the offline-first copy (QA-12), and authored honest ToS/Privacy placeholders. **Path to ✅ Production** additionally needs the backend hardening set (authZ, rate limiting, monitoring, backups) and a real private beta.

---

*Method note: every finding cites specific code and was verified by direct inspection and/or an independent reviewer. Nothing was assumed; unbuilt areas are marked missing rather than scored as if present. Fixes in this pass were re-verified: typecheck ✓, lint ✓ (0 warnings), 133/133 tests ✓, static build ✓, 9/9 Playwright + axe ✓.*
