# Volume 2 — Part 2, Sections E–P (compiled)

*(Written under "Weave" — read as **Aveyra**.)* Consistent with the
[web-first amendment](amendment-2026-07-21-web-first-two-device.md): **cloud-connected,
two-device, Supabase, staged privacy.** The doc's own "Changes Required" note
supersedes the earlier "offline-first" language in these sections — private
journals/drafts stay device-local; shared content is server-synced with graceful
disconnection.

## Resolved open questions (from this batch's recommendations)
- **Backend → Supabase** (auth + Postgres + realtime + RLS).
- **Privacy → staged:** launch with **server-side encryption at rest + strict
  row-level access controls**; architect the schema so **E2EE can be added later**
  without a rewrite. **Honesty rule:** encryption-at-rest ≠ E2EE — the product
  must NOT claim "no one can read your data." Honest copy: stored securely,
  encrypted at rest, strict access boundaries, never sold, no ads.
- **Navigation → four** (Today/Story/Write/Settings).
- **Model → neutral `participants` (Participant A / Participant B) schema, partner-forward copy.**
- **Content taxonomy (design the schema in 3 classes from day one):**
  (1) shared relational content · (2) private device-owned content · (3) sensitive
  content that may later need client-side encryption.

## Per-tab emotional targets (design brief)
Today → anticipation + gentle continuity · Story → shared identity + continuity ·
Write → private safety + self-clarity · Settings → control + trust.

---

## Section E — Memories & Relationship Timeline
Turns meaningful moments into a preserved relationship history. Principles:
**significance over volume** ("memories should feel earned"), belong to the
relationship, **reflection over collection**. Types: **Conversation memory** (from
a reveal), **Personal shared memory**, **Milestone memory**. Create from a reveal
("Save This Moment") or the Memories screen ("Create Memory": title+date required,
description/photo/category optional) → **preview** before save → Timeline + Gallery.
Two views: **Timeline** (narrative, not a feed — no likes/comments/followers/
metrics) and **Gallery** (visual). Detail: image/title/date/description/
contributors/related conversations; actions edit/reflect/archive/delete
(deletion confirmed). "On This Day" = future, opt-in, gentle, excludable. Media:
compress, user-controlled deletion, show storage usage. Empty: "Your story begins
with a moment."
*Research:* mementos are valued as **cues for reflection/identity/continuity**,
not storage; timelines as narrative not feed; intentional (not automatic) saving.

## Section F — Private Journal & Personal Reflection
Aveyra's **personal** space — protects thoughts a user isn't ready to share. Not a
communication channel. Principles: privacy → authentic reflection ("this space
belongs to you"), **reflection before reaction**, simple writing over
organization. **Strictly private:** owner-only, partner cannot access, excluded
from shared exports unless explicitly selected. Entry = content (required) +
optional title/date; future tags. Entry points: "Write Something" / after a
question "Reflect Privately" (link visible only to owner). Large writing area,
minimal controls, **auto-save drafts** ("Draft saved privately"), word count
optional. List history; basic **local** private search. Edit/delete/restore per
Volume 1. Move to shared only by **explicit** action ("Create Shared Memory" /
"Share This Thought"). Emotional-safety: no judging/diagnosing/assumptions/
dependence. **Device-owned → works offline.** Empty: "Your thoughts deserve a
place to exist."
*Research:* private, low-friction reflective writing aids emotional processing;
privacy confidence is prerequisite to honesty; keep it a room, not a productivity app.

## Section G — Notifications, Reminders & Re-engagement
Exist to support connection, **not** usage. Every notification must answer "will
this help strengthen the relationship?" Principles: respect attention (few,
relevant, predictable, controllable); **never create relationship pressure** (no
guilt: "A new conversation is ready whenever you both have time," never "your
partner is waiting, don't disappoint them"); encourage connection not app-opening;
user control first; feel human. Categories: Daily-question reminder (max 1/day),
partner-activity (shared events only, no private info), memory ("one year ago
today", optional), milestones, **security (required, can't fully disable)**.
**Ask permission only after the first shared experience.** Quiet hours (security
bypasses). Re-engagement is **gentle, never streak-punishment/fear/scarcity**.
Lock-screen must not expose private content. **Nothing anywhere rewards frequency
of use.**
*Research:* notification restraint; opt-in; sparse; no guilt/coercion.

## Section H — Account, Partner Management & Relationship Settings
Clean separation: **individual accounts** · **shared relationship space** ·
**private personal data**. Each user: own identity/auth/private storage/settings/
journal — never logs into the other's account. Relationship Space contains shared
(profile, memories, revealed answers, timeline, milestones) and **excludes**
private journals/drafts/personal settings. Create account (display name + auth +
security; optional photo) → create relationship space (optional name/date) →
invitation (QR + code + expiry). **Invitation states:** Created/Pending/Accepted/
Expired/Cancelled. Join = scan/enter code; before joining, see who invited + what
becomes shared. One active relationship space in Phase 1. **Device management +
account recovery** are now first-class (new phone/lost/reinstall). Leaving/
archiving/closing a relationship: explain consequences, confirm, no judgment/
pressure. Data ownership: user-owned vs shared. *Research:* settings are part of
the privacy *experience*; show consequences before destructive actions;
account/relationship boundary is foundational to trust.

## Section I — Search, Organization & Discovery
**Rediscover meaning, not just retrieve files.** Discovery over retrieval,
simplicity first, **privacy first** (private content only for owner; never leak
hidden/deleted/partner content). Global search (memories, shared conversations,
timeline, own journal), plus memory/timeline/journal scopes. Lightweight bar,
optional local private recent searches, suggested discovery. **Results grouped by
type**; filters as helpers (type/date/category); sort relevant/newest/oldest.
Works on local data; more available after sync. Empty: "We couldn't find that
moment yet." *Research:* users search by feeling not exact terms → support broad
discovery + related results; strict query/result scoping; no library-catalog feel,
no popularity signals.

## Section J — Settings & Preferences
Control without technical knowledge. Principles: user control, transparency
(what/why/how it affects you), **safe defaults** (privacy/simplicity/security/
accessibility on the conservative side). Categories: Account · Relationship ·
Notifications · **Privacy & Security** (the emotional center: data protection
explanation, **App Lock** = passphrase / biometric where available / lock timing,
privacy controls) · Appearance (theme, text size, contrast) · Accessibility ·
Data Management (storage info, export/import, delete) · Help & Support · About
(version, legal, **privacy policy, terms of service**). Destructive actions show
plain-language consequences + confirm ("Leaving this relationship space will
disconnect your shared journey. Your private journal remains yours.").
*Research:* group privacy/account/relationship understandably; explain in human
language; avoid dense technical dashboards and over-granular controls.

## Section K — Backup, Export, Import & Data Portability
**Users own their data; never lock it in.** Export from Settings → Data
Management: **Complete** (profile, memories, timeline, revealed conversations,
journal optional, media) or **Selective**. Format human- + machine-readable
(`relationship.json`, `memories.json`, `timeline.json`, `questions.json`,
`journal.json`, `media/`). **Optional export encryption** with unrecoverable
password ("Aveyra cannot recover it"). Import: new-install or existing-data
(replace vs merge; default prevents loss); show backup date/contents/impact +
confirm. **Conflict handling** in human language ("We found different versions of
this memory — choose which to keep"). Respects private/shared separation +
Recently Deleted/retention. *Research:* portability = trust; explicit summaries;
error prevention for high-stakes flows.

## Section M — Accessibility & Inclusive Design
**Core requirement, not a feature.** WCAG **2.2 AA**. Color never the sole signal;
contrast; scalable typography/Dynamic Type; screen-reader labels + landmarks +
reading order; keyboard operable with visible focus; large touch targets, no
precise gestures, no time-limited interactions; reduced-motion; alt text; simple
human language; **no assumptions about relationship structures/communication
styles/culture** — users define their own experience. Testing = automated +
manual (keyboard/SR/scaling/reduced-motion) + user testing with diverse needs.

## Section N — Error Handling & Edge Cases
Human-friendly, protect data first, **never blame the user**. Categories: auth,
partner-connection, data, **sync** (now core), network, permission, storage,
security, account conflicts. Examples: invalid invite → "This invitation is no
longer available"; failed save → "Your memory wasn't saved yet. Your content is
still available"; sync → "Waiting to sync" + auto/manual retry; conflict → "We
found different versions… keep this / keep other / review"; offline → "You're
currently offline. Some features may be unavailable" (view cached, write drafts);
storage full → plain message + free-space actions. Every error: explanation +
helpful action + recovery path + calm language. No dead ends, jargon, or
fear-based warnings.

## Section O — UX Research & Design Validation Framework
**Binding process** (extends the Design Research Policy). Flow: **Research →
Analyze → Design → Test → Approve → Build.** Inspiration ≠ copying. Required
sources: Mobbin, Page Flows, Apple HIG, Material 3, NN/g. **Every feature needs a
research doc:** (1) feature name, (2) problem, (3) research references (sources/
screens/patterns), (4) design decisions (adopted/modified/rejected), (5)
reasoning. Validation phases: concept → prototype → user testing → refinement.
Approved only when problem clear + research done + flow documented + interface
reviewed + accessibility considered. **AI design behavior rules:** research before
UI; reference sources; explain decisions; **no placeholder components; tokens
only; wait for approval before major implementation**; UX over speed.
Review checklist: purpose · simplicity · emotion · accessibility · privacy ·
consistency.

## Section P — Complete User Journey Map
10 stages, each with an emotional goal: (1) Discovery — curiosity/trust; (2) First
launch — "designed for meaningful connection"; (3) Account creation — clear, short;
(4) Create relationship space — "we're starting something"; (5) Partner connection
— understand shared/private boundaries; (6) First shared experience — a daily
question answered privately then revealed (curiosity/appreciation/connection); (7)
Creating memories — history begins; (8) Daily growth; (9) Returning user — "what
meaningful thing can I do today?"; (10) Long-term — "a story we created together."
Key emotional moments: first connection, first question, first memory, first
milestone, difficult periods (support, don't replace communication). Failure
points to monitor: not inviting partner, stopping questions, stopping memories.

---

## Risk guidance to design against (from the doc's risk analysis — adopt)
- **Surveillance disguised as care** — no read receipts, activity-visibility, or
  location; awareness ≠ monitoring.
- **Pressure disguised as engagement** — nothing rewards frequency; reminders
  sparse/opt-in with an escape hatch.
- **Dependency disguised as support** — the app supports conversation, doesn't
  replace it.
- **Privacy ambiguity** — communicate the *real* protection honestly (server-side
  at rest, not E2EE) so users aren't falsely reassured.
- **Asymmetry between partners** — never surface one partner as more/less engaged;
  support a **continuum of privacy comfort** (don't assume symmetrical openness).
- Leave room for **ordinary, unremarkable moments** — don't force the relationship
  into a always-coherent narrative.
