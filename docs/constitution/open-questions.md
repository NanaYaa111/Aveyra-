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

## 🔴 Still open (blocking Milestone-2 planning)
- **Q12 — Privacy model: E2EE vs server-side encryption?** E2EE (relay stores
  only ciphertext; max privacy, more complex) **vs** server-side encryption at
  rest (server can read; simpler — matches the stated "reduce complexity" goal).
- **Q8 — Backend choice:** managed BaaS (e.g. Supabase) vs custom service.
- **Q2 — Navigation 4 vs 5** (this direction *leans four* — "small, ritual-centered").
- **Q4 — `partner` vs `participants`** (this direction *leans `partner`* — couples).

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
- **Decision:** _______

### Q2 — Navigation: four vs five destinations 🔴
Volume 1 §4.2 fixes four (Today/Story/Write/Settings), "no fifth ever." Volume 2
assumes five (Home/Questions/Memories/Journal/Profile). App is built to four.
- **Options:** keep four (fold Home+Questions into Today) / switch to five.
- **Recommendation:** keep four — fits the calm/ritual research; no churn.
- **Research:** mobile IA — top-level destination count vs cognitive load.
- **Decision:** _______

### Q3 — Streak: allowed or banned? 🔴
Dashboard §21 lists a "relationship streak (if implemented ethically)." Part 2
§1.2 **permanently bans** streaks/loss-framing.
- **Options:** keep the ban (accumulation-only) / allow an "ethical" streak.
- **Recommendation:** keep the ban.
- **Research:** Silverman et al. 2023 (broken streaks → abandonment); streaks in
  relationship contexts (loss reads as a verdict on the relationship).
- **Decision:** _______

### Q4 — Relationship model: `partner` vs `participants` 🔴
Volume 2 = a space for exactly two people. §10 future personas (friends,
parent/child, mentor/mentee) + wellbeing research (benefits not romance-specific)
argue for a neutral two-person model.
- **Options:** romantic `partner` now / neutral `participants` from the start /
  decide at schema time.
- **Recommendation:** `participants` schema, romantic-warm default copy — avoids a
  later migration.
- **Research:** cost of retrofitting a two-person data model later.
- **Decision:** _______

---

## B. Resolve automatically from Q1

### Q5 — Reveal mechanic 🔴
Async two-device (§37; needs 2 devices + sync) vs pass-the-phone (single device).
Async if Q1 = two-device-now; pass-the-phone if Q1 = local-first.
- **Decision:** _______ (or: follows Q1)

### Q6 — Sync copy 🔴
Dashboard/offline/error text uses sync language; Volume 1 §5 prohibits it until
sync exists. Valid only if Q1 = two-device-now; else rewritten local-only.
- **Decision:** _______ (or: follows Q1)

### Q7 — Accounts + Terms/Privacy Policy 🔴
§12 collects display name, optional photo, region/language, **Terms & Privacy
acceptance**. An offline, no-server product has no obvious author/host for legal
terms. If Q1 = local-first → no accounts, drop this. If two-device → decide who
provides the Terms/Privacy text.
- **Decision:** _______ (or: follows Q1)

### Q8 — Backend choice 🔴 *(only if Q1 = two-device-now)*
Supabase + client-side E2EE · custom encrypted relay · decide at that milestone.
- **Decision:** _______

---

## C. Smaller / independent

### Q9 — "Difficulty progression" wording 🟡
Questions deepen gradually (fine internally), but the UI must never show
"difficulty" (questions are invitations). Default: implement this way.
- **Decision:** _______ (default: keep internal, never surfaced)

### Q10 — Relationship lifecycle states 🟡
Adopt Volume 2's richer `Pending/Active/Paused/Archived/Closed` vs current
`solo/pending/linked`? Low-stakes; relevant once relationships/sync are built.
- **Decision:** _______

### Q11 — Self-hosted brand fonts 🟡
Brand guide specifies Fraunces + Inter (self-hosted); app ships system-font
fallbacks now (zero network/bytes). Bundle real fonts now or later?
- **Recommendation:** later — changes no tokens, adds weight.
- **Decision:** _______

---

*When Q1 is decided, I can proceed to Milestone 2 planning and the rest largely
falls into place.*
