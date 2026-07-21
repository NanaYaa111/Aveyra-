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

## 🔴 Remaining (mostly infra / content, not architecture)
- **Q7b — Terms of Service & Privacy Policy.** With real accounts + a backend,
  these legal texts are genuinely needed (Settings → About). Author is the user's
  to provide; I can draft honest placeholders reflecting the real privacy model.
- **Q8b — Supabase project provisioning.** I can't create it under your account.
  Need project URL + anon key (env) to build networked features; local mock
  usable until then.
- **Privacy copy stance** — I'll write honest copy (encrypted at rest, strict
  access, never sold; *not* E2EE) unless you object.

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

*Q1 was decided 2026-07-21 (two-device, web-first). Milestone 2 is planned
([docs/milestone-2-plan.md](../milestone-2-plan.md)) and **on hold until Volume 2
Parts 3–4 arrive**. Remaining open: Terms/Privacy texts (Q7b), Supabase project
provisioning (Q8b), self-hosted fonts (Q11).*
