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
- **Question bank → ~190 questions, 9 canonical categories**; first question fixed
  ("What's one small thing about yourself that you hope I always remember?"). 🟢
  *(Refined to the canonical **9** by Part 3 Section E — dropped standalone
  Gratitude, folded into Appreciation; re-mapped in code (V-03). See Q14 below.)*
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

## 🟢 Reconciled — 2026-07-23 (Part 3 Section E)
- **Q14 — Question categories: 9 canonical (Section E) supersede "10".** 🟢 **DONE**
  Section E's authoritative categories are **Discovery · Appreciation · Memories ·
  Communication · Dreams & Future · Growth · Reflection · Fun & Play · Conflict &
  Repair** (+ **Love Maps** sub-category under Discovery). Two earlier "10"s were
  superseded: (a) the decisions-batch's 10 — **Section E's 9 = that list minus
  standalone Gratitude, folded into Appreciation**; and (b) the earlier built **draft**
  bank, which used 10 ad-hoc slugs and was always flagged draft. **Resolution:** Section E governs.
  **Done (V-03, 2026-07-23):** `lib/questions/types.ts` now declares the 9 canonical
  `CategorySlug`s + a `love-maps` `SubCategory`; `lib/questions/bank.ts` re-maps the
  draft (~188 questions) across the 9 categories, adds a Conflict & Repair set
  (reserved for matured relationships), and folds Love Maps under Discovery (seeded
  from [love-maps-example-questions.md](love-maps-example-questions.md)). The rotation
  engine is category-agnostic, so this was content-only — no code decision was needed.

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

## 🟢 Resolved — Part 4 reconciliation (2026-07-23, author decision: "it's embedded in the website. Start with milestone 2")
- **Volume 2 · Part 4 — Technical Architecture RECEIVED & RECORDED (2026-07-23).**
  The full "Aveyra Engineering Prompt Library" (Document 0 + Sections A–T, most in
  full-spec form) is recorded in
  [volume-2-part-4-technical-architecture.md](volume-2-part-4-technical-architecture.md).
- **Q22–Q25 now resolved** by the author's decision. Reading the full corpus
  surfaced no conflicts beyond these four.

### Q22 — Product scope 🟢 RESOLVED: unified product, features embedded in one web app
Author: *"it's embedded in the website."* → Aveyra is **one web app** with **Daily
Questions as the hero surface** and the broader areas — **Memory Vault, Journal,
Date Planner, Private Messaging, Emotional Wellness** — **embedded within the same
product** (not separate apps, not deferred to a distant phase). Sequencing across
Milestone 2+ is by dependency: the auth + accounts + cloud-sync foundation and the
core Daily-Questions/Memories loop come first; the additional surfaces follow, each
under the Design Research Policy. The four-nav may grow to accommodate them (an IA
revision, proposed per screen). **Superset of the prior MVP, not a replacement of
the Daily-Questions thesis.**

### Q23 — Gamification 🟢 RESOLVED: permanent prohibition STANDS
The author endorsed the embedded feature set but did **not** amend the permanent
prohibition (Part 2 §1.2: no streaks/XP/levels/scores/leaderboards/achievements).
Per guardian role a permanent rule is **not** reversed by silence or by inheriting
Document 0 §3.1's "Gamification" area. **Held: no gamification.** Document 0's
"light milestones/shared achievements" is **struck** unless the author later, and
explicitly, amends the prohibition. Emotional Wellness ships as *supportive,
non-scored* check-ins only. *(If you DO want light milestones, say so and I'll draft
a narrow amendment — as we did for telemetry, Q17.)*

### Q24 — UI/state/forms/viz stack 🟢 RESOLVED: keep the bespoke zero-dependency build
Retain Tailwind + **bespoke, accessible, zero-runtime-dependency** components
(runtime deps: dexie/next/react/react-dom), static `output:'export'`, top-level
`app/`/`lib/` layout, Vitest + Playwright. Document 0 §5's shadcn/Framer/Zustand/
RHF-Zod/Recharts + `src/`/SSR/Husky is **superseded**; individual libraries adopted
only when a specific screen genuinely needs one (justified per case). Document 0 §5
to be revised to match. Concrete quality bars from the full specs are adopted:
**≥80% coverage, CWV LCP<2.5s / CLS<0.1 / Lighthouse≥90, retry+jitter.**

### Q25 — Backend 🟢 RESOLVED: Supabase-native
**Supabase** (EU region) is the Phase-2 backend: GoTrue passwordless OTP
(`signInWithOtp`/`verifyOtp`), Postgres + **RLS** for relationship scoping,
Realtime/pull for sync, Storage (photos) with RLS. Document 0 §5 + Document D
(NestJS+PostgreSQL) and Document G/P (hand-rolled `/auth/*` + self-signed JWT) are
**superseded**; **Documents P, D, F are retained as the *behavioural contract*** our
Supabase integration must satisfy (10-min OTP, enumeration protection, rate limits,
RLS scoping, no-PII logs, error-shape consistency, LWW conflict, versioning). We
**keep our stronger posture** where we exceed the specs: client-side AES-GCM field
encryption (specs leave Phase-1 plaintext) and WCAG **2.2** AA (specs 2.1).
**Author task (external, unblocks live auth):** provision the Supabase project (EU)
and provide `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Until
then M2 builds against a backend-agnostic auth seam (stub provider), mirroring how
M1 built sync behind `SyncTransport`.

### Q26 — Encryption vs cross-device sync 🟢 RESOLVED: staged privacy (local-cache encrypted; Supabase plaintext-under-RLS)
The M1 field encryption uses a **device-local** key that a partner's device cannot
decrypt, so it cannot protect *shared* content across two devices as-is. Resolution
(consistent with the staged-privacy decision; **no E2EE claim** at launch):
- **Local Dexie cache** stays encrypted at rest with the device-local key (as built)
  — protects the on-device copy.
- **Supabase (source of truth)** stores shared content (answers, memories) and the
  private journal **plaintext-under-RLS + Supabase at-rest encryption** — access is
  gated by row-level security (members-only / owner-only), not E2EE.
- **Sync boundary:** outbound = decrypt from local cache → send plaintext to
  Supabase; inbound = pull plaintext → re-encrypt into local cache.
- **Future E2EE stage (deferred):** introduce a shared *relationship key* (ECDH via
  the device keypairs we already generate) so shared content is ciphertext before it
  reaches Supabase; the schema's content columns become ciphertext then. Not now.
- **Copy rule:** never claim end-to-end encryption; say "encrypted at rest, strict
  access, never sold."

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
