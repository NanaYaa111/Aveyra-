# Volume 2 — Part 2, Sections B/C/D: Onboarding · Home Dashboard · Daily Questions

*(Written under "Weave" — read as **Aveyra**.)*

> ✅ **Status update (2026-07-21):** the two-device/account/async-reveal model
> these sections assume was **adopted** via the
> [web-first amendment](amendment-2026-07-21-web-first-two-device.md). The inline
> ⚠️ flags below are retained as history; their outcomes: scope → two-device
> **adopted** · async reveal → **adopted** · sync copy → **valid** · accounts →
> **core** · navigation → **four** (not five; Home + Questions fold into Today) ·
> §21 streak → **rejected** (Part 2 §1.2 ban stands; accumulation-only) ·
> "difficulty" → internal only, never surfaced.

---

## Section B — Complete Onboarding Experience

### Philosophy & first launch
Explain Aveyra's purpose without overwhelm · build trust via transparency/privacy
· guide to create/join a relationship space · reach the first meaningful shared
experience fast. Communicate **emotional value before asking to create an
account**.

### Welcome flow — four intro screens
Each: one illustration, headline, short paragraph, progress indicator, Next, Skip
(except last).
1. **Welcome** — "Welcome to Aveyra / A private place where two people can
   discover, remember, and grow together." (two paths converging)
2. **Discover** — "Every Conversation Reveals Something New."
3. **Remember** — "Preserve the Moments That Matter."
4. **Privacy** — "Your Relationship. Your Data." (no clichéd padlocks) → primary
   button **Get Started**.

### Account decision → creation → space → invitation → join
- **Decision:** *Create a new relationship space* OR *Join an existing one*
  (code/QR). Only two people per space. ⚠️ *reverses Volume 1 "no accounts."*
- **Create (min data):** display name · optional photo · region/language ·
  **accept Terms & Privacy Policy**. Explain why each item is asked.
  ⚠️ *Terms/Privacy Policy imply a legal author/host — undefined for an offline,
  no-server product.*
- **Relationship space:** nickname (opt) · anniversary/start date (opt) ·
  relationship type (future) → generates a secure invitation.
- **Invitation:** QR + code; copy/share/regenerate; explain temporary /
  single-use / expiry. ⚠️ *network redemption needs the deferred backend.*
- **Join:** scan/enter code → validate → link → **establish shared encryption
  keys (Volume 1 architecture)** → both confirm. ⚠️ *this is the E2EE key
  exchange scheduled for the two-device milestone.*
- **First shared experience:** one guided, low-pressure, no-right-answer
  question; after both answer, **celebrate the first shared moment** and offer to
  save it as the timeline's start.

### Research relation
Reach the "aha" moment fast; value **before** account friction; minimal data
(each field increases abandonment); low-pressure, storytelling first question;
celebrate the first memory as the activation moment; transparent single-use
invitations reduce anxiety. (NN/g cognitive load, Page Flows end-to-end, onboarding studies.)

---

## Section C — Home Dashboard

⚠️ *"Home" is the disputed **fifth destination** (four-vs-five nav decision).*

### Purpose & principles
Answers *what should I do now / what happened recently / how is our journey
progressing.* One primary action at a time; meaningful info over volume; minimize
scrolling; **adapt to relationship state**; encourage completion over browsing;
calm and spacious. Not a feature catalogue.

### Layout
Welcome Header · Relationship Summary · **Today's Priority** (single dominant
CTA) · Recent Shared Activity (chronological, tappable) · Relationship Journey
(moments preserved, timeline preview, upcoming anniversaries, "on this day" —
future) · Quick Actions (sparse: Add Memory, Write, Timeline, Browse Questions,
Search) · Daily Reflection (future).

- **Welcome header:** time-appropriate greeting, name, date, relationship name;
  varies over time.
- ⚠️ **Relationship Summary** lists "current relationship **streak** (if
  implemented ethically)" — **conflicts with Part 2 §1.2's permanent ban on
  streaks / loss framing** (and the streak research). Flagged for decision;
  recommend accumulation-only (totals that never decrease), no streak.
- **Empty states** (keep — strong, hopeful, one action each): "Your story is
  just beginning" → *Create Your First Memory*; "Some thoughts are worth keeping"
  → *Start Writing*; "Meaningful moments begin with a conversation" → *Answer
  Today's Question*.
- **Loading:** calm skeletons matching final layout.
- ⚠️ **Offline/Error copy uses sync language** ("waiting to synchronize," "will
  sync when a connection is available," "sent when your connection is restored").
  **Volume 1 Part 2 §5 prohibits sync language until sync exists.** Valid only
  once the two-device sync ships; otherwise must be rewritten as local-only copy.
- **Accessibility:** keyboard, screen readers, dynamic text, high contrast,
  color-independent indicators, reduced motion (Volume 1 mandatory).

### Research relation
Progressive disclosure (NN/g), one primary action to reduce decision fatigue,
cards for grouped content (Material 3), state-aware dashboard, empty states as
onboarding moments, sparse quick actions, reassuring offline/error copy.

---

## Section D — Daily Questions & Shared Conversation

### Purpose & philosophy
Structured opportunities to discover, share, reflect, strengthen understanding,
and create memories — never a questionnaire. Five principles: **curiosity over
testing** (no right answers) · **depth over frequency** · **safety before
vulnerability** (gradual) · **mutual participation** · **memories emerge
naturally** (never force a memory).

### Categories, delivery, selection
- **Categories:** Discovery · Memories · Dreams & Future · Appreciation · Growth
  & Reflection. *(A light→deep emotional arc; aligns with the "tonal range"
  from the Positive Love research — mostly light, occasional depth.)*
- **Delivery:** one primary question/day on Home. Actions: **Answer · Skip ·
  Save for later**.
- **Selection logic:** previous answers, categories, engagement, relationship
  age, avoid repetition, gradual depth. ⚠️ *"difficulty progression" — keep
  internal; never surface "difficulty" (questions are invitations, Part 2 §2.1).*

### Two-device answer flow — ⚠️ async reveal (vs Volume 1 pass-the-phone)
Each person: own account/device/private data + shared space.
1. Question appears to both. 2. Each answers **privately** on their device.
3. One finishes → **"Waiting for your partner's response"** (other's answer
hidden). 4. Both submit → **reveal available**.
⚠️ *This is the true **asynchronous** reveal — it requires two devices + sync.
Volume 1 Part 2 §13 specified **pass-the-phone** for single-device Phase 1.
Resolves with the scope decision.*

### Reveal, privacy, editing, after-reveal
- **Reveal:** "Reveal Together"; **symmetrical/balanced** layout (your answer /
  partner's answer — equal visual weight).
- **Privacy:** drafts private; submitted answers unviewable until the reveal
  condition; editable before submission; after reveal → shared history.
- **Editing:** free before submit; editable after submit but before reveal
  (partner not notified unless changed post-submission); after reveal, editing
  needs confirmation and preserves original history.
- **After reveal:** *Save as Memory* (question + both answers + date + optional
  photo/description) · *Add Reflection* · *Continue Conversation*. (Save is
  **intentional**, never automatic.)

### Missed questions, bank, safety
- **Missed:** no guilt — "A meaningful conversation is waiting whenever you're
  ready." Answer current / browse previous / continue.
- **Bank:** Phase 1 local, curated, offline; future expandable packs.
- **Safety:** no forced disclosure, sensitive interrogation, judgment,
  manipulation, or manufactured conflict; the user is always in control.
  *(Research adds: gently signal emotionally heavier categories before answering.)*

### Research relation
One question/day (depth over frequency); gradual category depth; reveal as a true
**state change** (Draft → Submitted → Waiting → Reveal Available); preserve &
label drafts; non-judgmental missed-day language; save-as-memory only after
reflection; symmetrical reveal; accessibility (focus states, SR-friendly status
text, reduced-motion reveal, large tap targets). (NN/g, Material 3, Apple HIG.)

---

## Consolidated decisions this batch forced — ✅ ALL RESOLVED 2026-07-21
1. **Scope → full two-device now** (web-first amendment).
2. **Navigation → four** (Home + Questions fold into Today).
3. **Streak → ban stands** (accumulation-only progress).
4. **Reveal → async two-device.**
5. **Model → neutral `participants` schema, partner-forward copy.**
6. **Secondary:** sync copy **valid**; account data minimal per §12 with
   Terms/Privacy texts still to be authored; "difficulty" internal-only.
