# Overnight Work Report — 2026-07-21 → 22

**Role:** autonomous overnight session (you granted a free hand; we continue tomorrow).
**Branch:** `claude/offline-couples-website-cxeptq`
**Status:** all work committed, pushed, and fully green.

---

## The boundary I held (guardian note)

You gave me the whole night, but two lines stayed uncrossed because crossing
them would violate your own methodology:

- **No Milestone 2 features or screens.** They need Volume 2 Parts 3–4 and
  per-screen approval under the Design Research Policy. I built no UI.
- **No Supabase / backend.** Decided: provision when Part 4 begins.

Everything below is either **hardening of already-approved M1 code** or a
**backend-agnostic foundation** in the exact spirit of the existing
invitation / sync / identity modules — logic and content that sit ready for a
feature to consume, with nothing shipped into the product yet. All of it is
**reviewable, not live.**

---

## 1. Question foundation (`lib/questions/`) — NEW

A pure, backend-agnostic module implementing the decided question spec. No UI,
no backend, no persistence assumptions.

| File | What it is |
| --- | --- |
| `types.ts` | `CategorySlug` (10), labels, `QuestionSeed`, internal `Depth` hint |
| `bank.ts` | **DRAFT** ~200 questions across 10 categories + the fixed opener |
| `rotation.ts` | Deterministic daily selection engine |
| `index.ts` | Barrel |

**Rotation engine guarantees (all tested):**
- Day one is **always** the fixed opening question.
- **Idempotent within a day** — reopening shows the same question; the engine
  never mutates the state you pass it.
- **No consecutive repeats**, even across a cycle boundary (verified over 600
  simulated days).
- **Exhaustion → shuffle → new cycle** (the decided behaviour).
- **Deterministic** per relationship id (same couple → same sequence); different
  couples get different sequences.
- **Silent skip returns later** — a skipped question is re-queued, never lost.
- Timezone-aware day keys via `dateKeyInTimeZone` (defaults sanely; Accra =
  UTC+0 as in this project).

### What needs YOUR review here
- **The 200 questions are a draft.** Wording, additions, cuts, and the category
  set are yours to change — edit freely; the engine treats the bank as an opaque
  pool, so changes are safe as long as ids stay unique.
- **Skip semantics** are a draft assumption: skipping assigns the *next*
  question for the same day so the couple is never left empty, and the skipped
  one reappears later. Confirm this matches your intent in Parts 3–4.
- **Depth** is an internal ordering hint only and is **never surfaced** (honours
  open-questions Q9 — no "difficulty" in the UI).

The bank is checked against the permanent prohibitions in tests: no
streak/score/rank/leaderboard/"difficulty"/quiz framing, and no deficit framing
("you never…", "what's wrong with…").

---

## 2. Deep test hardening — existing M1 code

Unit tests grew **17 → 90** (all passing). New coverage:

- **`questions.test.ts` (31)** — bank integrity + full rotation behaviour,
  including small-pool and single-question edge cases (no infinite loops).
- **`database-extended.test.ts` (10)** — record stamping, version increments on
  update, Recently Deleted ordering + human labels + empty-title fallback,
  restore, `get` miss, export bookkeeping, settings singleton.
- **`keyManager.test.ts` (12)** — no-passphrase vs passphrase modes, lock/unlock
  across a simulated new session, `WrongPassphraseError` on a bad passphrase,
  idempotent init, and Cipher round-trips (incl. unicode + refuses while locked).
- **`invitation-extended.test.ts` (11)** — URL-safe output, unicode round-trip,
  expiry boundary, tampered-token rejection, version + missing-field guards,
  code alphabet + uniqueness.
- **`encryption-extended.test.ts` (9)** — base64 round-trips (zeros/high bytes),
  AES-GCM auth-tag rejection on tampered ct/iv, wrong-key failure, empty/long
  strings.

No bugs were surfaced by the new tests — the M1 code held up. (The four QA
fixes from the earlier pass remain the only code defects found to date.)

---

## 3. Verification (all green)

| Gate | Result |
| --- | --- |
| `pnpm typecheck` | ✓ |
| `pnpm lint` | ✓ (0 warnings) |
| `pnpm test` | ✓ 90/90 unit |
| `pnpm build` | ✓ static export |
| `pnpm test:e2e` | ✓ 9/9 Playwright + axe (WCAG 2.2 AA) |

---

## Where we pick up tomorrow

1. **Review the draft question bank** — keep / rewrite / expand; confirm the 10
   categories and the skip semantics.
2. **Volume 2 Parts 3–4** — when the full documents arrive, Milestone 2 (Today
   screen consuming this engine, accounts, Supabase, reveal flow) resumes under
   the normal plan → approval cadence.
3. Nothing here blocks or pre-commits any of that — it's foundation waiting for
   a feature, exactly like the invitation/sync modules already in the tree.
