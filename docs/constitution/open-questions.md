# Open Questions — Decisions Needed

Living tracker of unresolved decisions. Fill in **Decision:** as you settle each;
resolved ones move to the README decisions log. Status: 🔴 open · 🟡 leaning ·
🟢 decided.

> **Most important: Q1 (scope/sequencing).** Q5–Q8 resolve automatically from it.

---

## ✅ Resolved 2026-07-21 — see [web-first amendment](amendment-2026-07-21-web-first-two-device.md)
- **Q1 → Full two-device now.** 🟢
- **Q3 → Keep the streak ban** (no streaks / loss framing). 🟢
- **Q5 → Async reveal.** 🟢
- **Q6 → Sync language valid.** 🟢
- **Q7 → Accounts + invitations central.** 🟢
- **NEW: offline-first dropped**, web-first primary, APK later. 🟢

## ✅ Resolved 2026-07-21 (batch 2) — see [Sections E–P](volume-2-part-2-sections-e-to-p.md)
- **Q12 → Staged privacy.** 🟢 Launch with **server-side encryption at rest +
  strict row-level access controls**; design the schema in 3 content classes
  (shared / private-device-owned / future-encryptable) so **E2EE can be added
  later**. **Honesty rule: do NOT claim E2EE / "no one can read your data."**
- **Q8 → Supabase.** 🟢
- **Q2 → Four destinations** (Today/Story/Write/Settings). 🟢
- **Q4 → Neutral `participants` schema (Participant A/B), partner-forward copy.** 🟢

## ✅ Resolved 2026-07-21 (batch 3) — see [Parts 3–4 decisions](volume-2-parts-3-4-decisions.md)
- **Q7b → Draft honest ToS/Privacy placeholders now**, clearly marked draft;
  legal review before public launch. 🟢
- **Q8b → Option B** — build against a local mock; provision Supabase **when
  Part 4 begins** (not now). 🟢
- **Auth → Email OTP / magic link**, email as primary identifier. 🟢
- **Hosting/domain → Vercel + Supabase; aveyra.app** (fallbacks .co/.io/.com). 🟢
- **Question bank → ~200 questions, 10 categories**; first question fixed
  ("What's one small thing about yourself that you hope I always remember?"). 🟢
  *(⚠️ later refined to the canonical **9** by Part 3 Section E — dropped standalone
  Gratitude; see Q14 below.)*
- **Question timing → relationship's primary timezone**; exhaustion → shuffle →
  new cycle, no consecutive repeats. 🟢
- **Skip → silent, no partner notification, returns later.** 🟢
- **Milestones (minimal) → Relationship Created, Partner Joined, First Question
  Answered, First Shared Memory, First Month Together, Anniversary.** 🟢
- **Notifications v1 → none** (in-app only). 🟢
- **Beta → 5–10 couples**, private, with feedback/interview/bug/feature templates. 🟢
- **Account info → email + display name only.** Profile photos deferred.
  Relationship category omitted from MVP. English only, localization-ready. 🟢
- **Offline-era work → repurposed** as draft cache/graceful reconnection/
  resilience; all "offline-first" messaging to be corrected. 🟢

## ✅ Resolved 2026-07-22 — Part 3 Section D
- **Q13 — Navigation count (four vs five).** 🟢 **Four governs** (Today · Story ·
  Write · Settings). Section D's five-destination nav (Home/Timeline/Memories/
  Journal/Settings) is the older IA; author expressed **no preference**, so the
  resolved four-nav decision (Q2) stands and the built shell is preserved.
  **Mapping:** Home → **Today** (the dashboard *is* the Today screen), Timeline +
  Memories → **Story**, Journal → **Write**, Settings → **Settings**. Every
  Section-D requirement maps on with no loss. Revisitable if the full Part 3
  (E–T) + Part 4 IA argues otherwise.

## 🟡 Reconciliation pending build — 2026-07-22 (Part 3 Section E)
- **Q14 — Question categories: 9 canonical (Section E) supersede "10".** 🟡
  Section E's authoritative categories are **Discovery · Appreciation · Memories ·
  Communication · Dreams & Future · Growth · Reflection · Fun & Play · Conflict &
  Repair** (+ **Love Maps** sub-category under Discovery). Two earlier "10"s are
  superseded: (a) the decisions-batch's 10 — **Section E's 9 = that list minus
  standalone Gratitude, folded into Appreciation**; and (b) the built **draft**
  bank (`lib/questions/bank.ts`), which uses 10 different ad-hoc slugs and was
  always flagged draft. **Resolution:** Section E governs. **Action (M2 content build):** re-map
  the draft questions to the 9 categories, add Conflict & Repair (reserved for
  matured relationships), fold Love Maps under Discovery, seed from
  [love-maps-example-questions.md](love-maps-example-questions.md). The rotation
  engine is category-agnostic, so this is content-only — no code decision needed
  now; done as part of the M2 question-bank build.

## ✅ Resolved 2026-07-22 — Part 3 J–R conflicts (author decided)

- **Q15 — Auth → passwordless email OTP / magic link (Option A).** 🟢 Section A +
  the resolved decision govern; **Section M's password/recovery language is
  superseded.** Credential = email + OTP/magic link; recovery = request a new
  code/link (no password reset); device/session management retained; passkeys a
  future option. Canonical layer = Supabase email OTP / magic link.

- **Q16 — Architecture → web-first; Section N reframed (Option A).** 🟢 Cloud is
  the canonical **source of truth**; local = cache + pending-actions queue.
  Offline UX preserved (create/edit locally → "pending" → auto-sync later, with
  **conflict-preservation**, not blind last-writer-wins). Section N is reworded to
  **"local-first EXPERIENCE, cloud source of truth"** — keep the UX language
  ("Saved safely. Waiting to sync."), drop full local-first / CRDT architecture.
  Section Q §1/§3 "offline-first" reads the same way.

- **Q17 — Analytics → narrow telemetry exception (Option B). AMENDS a permanent
  prohibition.** 🟢 **Still banned:** behavioral analytics, clickstreams,
  engagement funnels, **activity dashboards**, tracking, third-party analytics
  scripts, and **A/B experiments that alter the user experience for
  optimization.** **Newly permitted (by amendment):** **opt-in, aggregate,
  non-content operational telemetry** — crash reports + performance/reliability
  metrics (launch/search/timeline/media times, sync success, error counts, API
  times) — **with PII and all user content stripped**, ideally processed
  in-house. Section R is reframed as **"Performance & Reliability Telemetry"**
  (not a general analytics system); O §15 = operational only. R's ethical
  guardrails (no dark patterns, no engagement optimization, content never analyzed
  without consent) remain binding. See the README permanent-prohibitions
  amendment.

## ✅ Author-confirmed 2026-07-22 (pre-Part-4 ambiguity sweep)

All four chosen as recommended (Option A), with reasoning + concrete spec impact.

- **Q18 — Media in MVP → photos only (video later).** 🟢 Section L v1 = **images
  only (JPEG / PNG / HEIC / WebP)**; video is an explicit future enhancement.
  Part 4 media pipeline focuses on **image upload, compression, thumbnails,
  caching** — no transcoding/streaming at launch (heavier storage/egress avoided).
- **Q19 — Minimum age → 18+.** 🟢 Adults-only at launch (GDPR Art. 8 sets 16 as
  default child-consent age; a couples/journaling product is simpler/safer as an
  adult product). Section S + onboarding: *"Aveyra is for users 18 and older."*
  **No child-specific consent / parental-verification flows in v1.** Revisit only
  with legal review.
- **Q20 — Data region → EU (London / Frankfurt).** 🟢 Primary production Supabase
  project in an **EU region** — best latency to Accra/West Africa among available
  regions + clean GDPR-grade posture aligned with Section O. Part 4: *"Primary
  production environment: Supabase project in EU region."* Region reconfirmed at
  provisioning.
- **Q21 — Relationship ends / partner leaves → "Relationship Archive" (both keep a
  copy).** 🟢 Concrete policy: the shared relationship space is marked
  **archived** (no new content); **each partner retains a read-only personal copy
  of the shared memories and can export them**; the archive follows the retention/
  deletion rules — **no silent data loss**. **Private journals are unaffected**
  (only shared data is archived). Part 4 / Section B: define the **Relationship
  Archive** state + per-partner frozen copies (grace period, export packaging, RLS
  on the archived space).

## 🔴 Still pending
- **Volume 2 · Part 3 is COMPLETE (A–T, 20 sections).** The only remaining spec
  gate is **Volume 2 · Part 4 — Technical Architecture & Engineering
  Specification** (schema DDL, RLS policies, API standards, sync engine, deploy
  blueprint, CI/CD, monitoring). Milestone 2 code build stays on hold until Part 4
  arrives (and each screen passes the Design Research Policy: research → design
  proposal → approval).
- No open conflicts — Q13/Q14/Q15/Q16/Q17 all resolved.

---

## A. Pivotal

### Q1 — Phase-1 scope / sequencing 🔴 *(blocking Milestone 2)*
Volume 1 = local, single-device, no accounts, no sync. Volume 2 (Sections B/C/D)
describes the **full two-device product** (accounts, invitation, live sync, async
reveal) as Phase 1.
- **Options:** (a) **Local-first core next** (onboarding + daily question with
  pass-the-phone + Story/Write, no accounts/sync; two-device follows). (b) **Full
  two-device now** (accounts + invitation + E2EE sync + async reveal; needs a backend).
- **Recommendation:** (a) — matches "build local-first before sync"; usable sooner.
- **Research:** onboarding "aha" timing; risk of building sync before a local core.
- **Decision:** 🟢 **(b) Full two-device now** — web-first amendment, 2026-07-21.

### Q2 — Navigation: four vs five destinations 🔴
Volume 1 §4.2 fixes four (Today/Story/Write/Settings), "no fifth ever." Volume 2
assumes five (Home/Questions/Memories/Journal/Profile). App is built to four.
- **Options:** keep four (fold Home+Questions into Today) / switch to five.
- **Recommendation:** keep four — fits the calm/ritual research; no churn.
- **Research:** mobile IA — top-level destination count vs cognitive load.
- **Decision:** 🟢 **Keep four** (Home + Questions fold into Today) — Sections E–P, 2026-07-21.

### Q3 — Streak: allowed or banned? 🔴
Dashboard §21 lists a "relationship streak (if implemented ethically)." Part 2
§1.2 **permanently bans** streaks/loss-framing.
- **Options:** keep the ban (accumulation-only) / allow an "ethical" streak.
- **Recommendation:** keep the ban.
- **Research:** Silverman et al. 2023 (broken streaks → abandonment); streaks in
  relationship contexts (loss reads as a verdict on the relationship).
- **Decision:** 🟢 **Ban kept** — accumulation-only progress; confirmed in the pivot's safeguards.

### Q4 — Relationship model: `partner` vs `participants` 🔴
Volume 2 = a space for exactly two people. §10 future personas (friends,
parent/child, mentor/mentee) + wellbeing research (benefits not romance-specific)
argue for a neutral two-person model.
- **Options:** romantic `partner` now / neutral `participants` from the start /
  decide at schema time.
- **Recommendation:** `participants` schema, romantic-warm default copy — avoids a
  later migration.
- **Research:** cost of retrofitting a two-person data model later.
- **Decision:** 🟢 **Neutral `participants` schema (Participant A/B), partner-forward copy** — Sections E–P.

---

## B. Resolve automatically from Q1

### Q5 — Reveal mechanic 🔴
Async two-device (§37; needs 2 devices + sync) vs pass-the-phone (single device).
Async if Q1 = two-device-now; pass-the-phone if Q1 = local-first.
- **Decision:** 🟢 **Async two-device reveal** (follows Q1).

### Q6 — Sync copy 🔴
Dashboard/offline/error text uses sync language; Volume 1 §5 prohibits it until
sync exists. Valid only if Q1 = two-device-now; else rewritten local-only.
- **Decision:** 🟢 **Sync language valid** (follows Q1).

### Q7 — Accounts + Terms/Privacy Policy 🔴
§12 collects display name, optional photo, region/language, **Terms & Privacy
acceptance**. An offline, no-server product has no obvious author/host for legal
terms. If Q1 = local-first → no accounts, drop this. If two-device → decide who
provides the Terms/Privacy text.
- **Decision:** 🟢 **Accounts are core** (follows Q1). Terms/Privacy **texts still to be authored** (see Q7b below).

### Q8 — Backend choice 🔴 *(only if Q1 = two-device-now)*
Supabase + client-side E2EE · custom encrypted relay · decide at that milestone.
- **Decision:** 🟢 **Supabase**, with **staged privacy** (server-side at rest first; E2EE later for sensitive content).

---

## C. Smaller / independent

### Q9 — "Difficulty progression" wording 🟡
Questions deepen gradually (fine internally), but the UI must never show
"difficulty" (questions are invitations). Default: implement this way.
- **Decision:** 🟢 Confirmed — internal only, never surfaced (Sections B–D resolution).

### Q10 — Relationship lifecycle states 🟡
Adopt Volume 2's richer `Pending/Active/Paused/Archived/Closed` vs current
`solo/pending/linked`? Low-stakes; relevant once relationships/sync are built.
- **Decision:** 🟢 **Adopt the richer lifecycle** when relationships ship (README resolved table).

### Q11 — Self-hosted brand fonts 🟡
Brand guide specifies Fraunces + Inter (self-hosted); app ships system-font
fallbacks now (zero network/bytes). Bundle real fonts now or later?
- **Recommendation:** later — changes no tokens, adds weight.
- **Decision:** 🟡 **Deferred** — system stacks ship now; Fraunces/Inter remain the sanctioned upgrade.

---

*All pivotal and secondary questions are resolved as of 2026-07-21 (see the
[Parts 3–4 decisions batch](volume-2-parts-3-4-decisions.md)). Milestone 2 is
planned in detail ([docs/milestone-2-plan.md](../milestone-2-plan.md)); code build
resumes once the full Volume 2 Parts 3–4 documents arrive. Only Q11
(self-hosted fonts) remains a deliberately deferred, non-blocking item.*
