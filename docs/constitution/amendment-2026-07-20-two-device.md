# Amendment — Two-Device Architecture (2026-07-20)

**Status:** Approved by the Constitution's author on 2026-07-20.
**Scope:** Amends Volume 1 (Parts 1–5). Supersedes the specific single-device
clauses listed below. **All Part 2 §1.2 emotional-safety prohibitions and all
simplicity/accessibility/reversibility rules remain fully in force.**

## Why
The product, **Aveyra**, is a two-person relationship platform. It is built
**local-first** (the device remains the source of truth), with a partner device
and synchronization added as an *enhancement layer* — never in the critical path
of any local action.

## The five amendments

| # | Original rule | Amended rule |
|---|---------------|--------------|
| A1 | Single-device only (Part 1 §6; Part 2 §13; Part 5 §2) | **Two devices** (User A + User B), local-first, with sync as enhancement. |
| A2 | No server / no cloud database (Part 3 §2.3; Part 4 §12) | A backend exists **solely as an end-to-end-encrypted sync relay** — it stores only ciphertext and never holds keys. |
| A3 | No user accounts (Part 1 §4/§6; Part 4 §12) | **Minimal identity** for device pairing — the least data necessary; data-minimization (Part 2 §2.4) preserved. |
| A4 | "Not end-to-end encryption (no second device yet)" (Part 2 §2.4) | **End-to-end encrypted between the two paired devices.** The honesty rule now *requires* E2EE to be literally true. |
| A5 | Static export, no server hosting (Part 3; M1 §3) | Frontend may remain a static Next.js export talking to a **separate encrypted backend**. |

## The privacy invariant (load-bearing)
> The sync relay stores only ciphertext it can never read. Keys never leave the
> paired devices. If this is ever untrue, the amendment is void — because it is
> the only thing that preserves Aveyra's core promise ("privacy is
> architecturally guaranteed, not merely claimed").

## What does NOT change
- All Part 2 §1.2 permanent prohibitions: no XP/levels/streaks/scores/
  leaderboards/comparison; nothing that renders a partner as a deficit.
- Offline-first: local is the source of truth; no feature blocked by
  connectivity; **no sync UI/state until sync actually exists** (Part 2 §5).
- Data minimization, honest privacy messaging, WCAG 2.2 AA, reversibility (soft
  delete / Recently Deleted / undo / export), four-destination navigation,
  deliberate pace, honest voice.

## Build sequencing (approved)
Per the project's own risk mitigation ("build local-first before sync"),
**Milestone 1 builds the two-device-ready foundation**: local identity model,
E2EE-ready cryptography (per-device ECDH keypair + relationship key), a local
mutation outbox, and an **abstract `SyncTransport` interface with a local stub**.
The **concrete backend, live cross-device sync, and network invitation
redemption are Milestone 2** (backend chosen at M2 planning; M1 stays
backend-agnostic).

## Data-model impact (extends Part 4, does not replace)
- Add minimal **User** (`id`, `display_name`, `device_id`, `created_at`) and
  **Relationship** (`id`, `creator_id`, `partner_id`, `status: solo|pending|linked`,
  `created_at`), folding in `partner_name` + `relationship_start_date`.
- Every syncable record keeps `schema_version` and gains sync metadata
  (version/updated_at) for future conflict resolution (timestamps + version
  numbers + conflict records).
- `Answer.author` stays a neutral local label (never rankings/tracking).
- `Question` uses `category`/`theme`, not `difficulty` (Part 2 §2.1).

## Known trade-off accepted
Two-device re-introduces the category's hardest problem — two-sided adoption
(research dossier §1.8, §5.4). Accepted knowingly in exchange for a true
two-person shared experience with a privacy guarantee no competitor matches.
