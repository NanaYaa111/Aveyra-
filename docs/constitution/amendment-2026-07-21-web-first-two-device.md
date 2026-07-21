# Amendment — Web-First, Two-Device, Connected (2026-07-21)

**Status:** Author's stated direction (2026-07-21). Records a major reversal of
Volume 1's offline-first pillar. **Supersedes** the offline-first clauses of
Volume 1 and the "offline-first preserved" framing of the
[2026-07-20 two-device amendment](amendment-2026-07-20-two-device.md).
**All Part 2 §1.2 emotional-safety prohibitions and trust rules remain in force
and are strengthened.**

## Why
Aveyra's core audience is **long-distance couples**. Value lives in **shared
interaction across distance**, not in device-local operation. A pass-the-phone /
local-only model fights that use case; two separate devices coordinated over a
network fits it honestly. Dropping offline-first also removes the hardest
architecture (full offline sync/CRDT/conflict reconciliation), making the product
simpler to explain and ship.

## The direction

| # | Was (Volume 1 / prior amendment) | Now |
|---|---|---|
| 1 | Single device; two-device a later add | **Two separate devices are the normal case** (long-distance first) |
| 2 | **Offline-first mandatory**; full offline guarantee | **Offline-first dropped as a product promise.** Graceful *disconnected* states only |
| 3 | No sync language until sync exists | **Sync language valid** ("waiting for your partner," "saved," "reveal unlocks when both respond") |
| 4 | Installable offline PWA (static export) | **Web-first** primary surface; optional **APK** later for Android |
| 5 | Local is the source of truth; no server | **Backend required** — accounts, invitation/linking, shared relationship space, coordination |
| 6 | Pass-the-phone reveal | **Async (near-real-time) reveal** across two devices |
| 7 | No accounts | **Accounts + invitations + space-linking are central** |

## Retained & strengthened (unchanged)
- **All Part 2 §1.2 prohibitions:** no streaks/loss framing, no XP/levels, no
  scores, no leaderboards/comparison. (Explicitly reaffirmed here.)
- **Trust over control — "support connection, never control":** no passive
  monitoring; no location sharing (never by default); no read receipts implying
  scrutiny; no "proof of activity"; no public/comparative social elements.
- **Consent & boundaries:** private drafting before submission; explicit consent
  before sharing; explicit reveal states; shared history only after both complete
  the interaction; clear controls over what becomes shared and when.
- Calm, **small** navigation (resist feature sprawl); accessibility (WCAG 2.2 AA);
  reversibility.

## Graceful disconnection (replaces "offline-first")
Not a full-offline guarantee, but: preserve drafts locally in the browser until
reconnect · show saved-state indicators · calm, reassuring reconnection messages ·
never claim offline operation we don't provide.

## Impact on the current build (honest)
- **Survives largely intact:** the design system, brand, bespoke components, the
  route/shell/nav layer, testing + CI, and the Web-Crypto primitives.
- **Changes materially:** `output: 'export'` (static, no server) likely gives way
  to a served app + **backend**; the service-worker *offline guarantee* becomes
  optional graceful-disconnect; **Dexie shifts from source-of-truth to a local
  draft/cache**; **accounts/auth + network invitation redemption + real sync**
  get built. The backend-agnostic sync stub becomes a real transport.

## Open within this pivot — ✅ all resolved (Volume 2 Sections E–P, 2026-07-21)
1. **Privacy model → STAGED.** Launch with server-side encryption at rest +
   strict row-level access controls; schema split into three content classes
   (shared / private-device-owned / future-encryptable) so client-side E2EE for
   sensitive content can be added later without a rewrite. **No E2EE claims until
   it is actually implemented.**
2. **Backend → Supabase** (auth + Postgres + realtime + RLS).
3. **Navigation → four** (Today · Story · Write · Settings).
4. **Model → neutral `participants` schema** (Participant A/B) with
   partner-forward UI copy.
