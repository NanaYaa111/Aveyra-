# Volume 2 — Parts 3 & 4: Scope Preview + Decisions Batch (2026-07-21)

This batch (a) describes what the full Parts 3 & 4 documents will cover when
sent, and (b) resolves nearly every outstanding open question with explicit
decisions. **The detailed content itself (per-feature specs, screen states,
schema DDL, RLS policies, CI/CD config) is still to come** — what follows are
binding decisions, not yet the full specs.

## 1. Scope preview
- **Part 3 — Complete Feature Specifications.** Per feature: purpose, user
  problem, supporting research, user stories, functional requirements, user
  flows, UI/UX requirements, screen states, validation rules, edge cases, data
  requirements, acceptance criteria, accessibility requirements, future
  enhancements. Features: Account Creation, Authentication, Relationship Space,
  Partner Invitations, Daily Questions, Shared Memories, Timeline, Private
  Journal, Settings, Notifications, Search, Profile, Security Settings.
- **Part 4 — Technical Implementation & Launch Blueprint.** Frontend/backend
  architecture, Supabase integration, database schema, auth implementation, RLS,
  file storage, env vars, hosting, domain, deployment, CI/CD, analytics,
  monitoring, security implementation, Privacy Policy, Terms of Service, beta
  testing, MVP scope, release checklist, future roadmap.
- **Rule going forward:** product *behavior* → Part 3; *implementation* → Part 4.

## 2. Supabase provisioning — Option B (build against a mock first)
Build against a **local mock/dev environment** until the product spec and DB
schema are finalized (Volume 2 is still evolving; avoid premature migrations).
**When Part 4 begins**, create the production Supabase project and configure:
project URL, anon public key, **service role key**, storage buckets, auth, RLS
policies. *(Supersedes the earlier "provision now" framing — M2 code work starts
against a mock, not live Supabase.)*

## 3. Authentication — Email OTP / Magic Link
No passwords; lowest friction; simplest recovery; fits the calm/minimal
philosophy; native to Supabase. **Email is the primary account identifier.**
Social login (Google/Apple) is a possible later addition, not launch.

## 4. Terms of Service & Privacy Policy — draft honest placeholders now
Requirements: reflect the actual architecture · clearly explain data
collection/storage · state data is never sold · explain encryption/security
honestly (**staged privacy — do not claim E2EE**) · clearly marked as **drafts**
· replaced with legally-reviewed versions before public release.

## 5. Daily Question Bank — ~200 questions at launch
Research sources: Gottman Institute, Esther Perel, Arthur Aron (36 Questions),
relationship psychology research, the user survey, Aveyra's own philosophy.
**Categories (expanded from 5 to 10):** Discovery · Appreciation · Memories ·
Communication · Dreams & Future · Growth · Reflection · Gratitude · Fun & Play ·
Conflict & Repair. Tone: natural, warm, conversational. *(Superseded the
5-category list in the Sections B–D doc.)* **⚠️ Refined by Part 3 Section E to the
canonical 9 — this list minus standalone "Gratitude" (folded into Appreciation),
plus a Love Maps sub-category under Discovery. Section E governs; see
[open-questions.md](open-questions.md) Q14 and
[volume-2-part-3-sections-e-to-i.md](volume-2-part-3-sections-e-to-i.md).**

## 6. First shared question — official
> **"What's one small thing about yourself that you hope I always remember?"**

Easy to answer, emotionally warm, discovery-oriented, starts the story
immediately, embodies the mission. *(Replaces the placeholder "something small
that makes you happy" from the Journey Map.)*

## 7. Daily question timing & exhaustion
**Synced to the relationship's primary timezone**, chosen at relationship-space
creation (both partners see the same question; avoids per-user timezone drift;
simplest to implement). When the bank is exhausted: **complete the full cycle →
shuffle → begin a new randomized cycle → never repeat consecutively.**

## 8. Skip behavior — confirmed "No Deficit"
If one partner skips: the **other is never informed**, no guilt/pressure, **no
"partner skipped" message ever**, the question **returns later** in a future
rotation. *(Confirms the default I proposed.)*

## 9. Automatic milestones — minimal set at launch
**Relationship Created · Partner Joined · First Question Answered · First Shared
Memory · First Month Together** (if a start date was given) **· Anniversary.**
No scores, streaks, levels, or gamification attached to any of them.

## 10. Domain & hosting
- **Frontend: Vercel.** *(Supersedes the earlier GitHub Pages default —
  static-export-to-GitHub-Pages plan is retired; Vercel is the target.)*
- **Backend: Supabase.**
- **Domain: `aveyra.app`** (primary). Fallbacks: `aveyra.co` · `aveyra.io` ·
  `aveyra.com`.

## 11. Notifications — v1 ships with none
No push, no email at launch. Use **in-app reminders, activity indicators, status
badges** only. Push/email introduced later, after the core experience is
validated.

## 12. Beta testing
Private beta before public release. Target **5–10 couples**. Prepare: feedback
form, interview guide, bug report template, feature request template. Goal:
validate **real relationship interactions**, not just technical function.

## 13. Expanded user research (ongoing, author-side)
Target 50–100 respondents before public beta; broaden to married couples,
long-distance, 5+ years together, ages 25–45. Treated as a **living document**
that continues refining the spec through development.

## 14–17. Account & content minimalism (confirmed)
- **Account info:** email + display name only. No unnecessary personal data.
- **Profile photos:** deferred to a future release (keep focus on the
  relationship, not profiles).
- **Relationship category:** omitted from MVP; architecture stays extensible.
- **Language:** English only at launch; all user-facing text externalized;
  architecture localization-ready.

## 18. Previous offline-era work — explicit repurposing instruction
Aveyra is **no longer offline-first**. Repurpose Milestone 1's offline
foundation as: **draft caching · temporary offline reading where appropriate ·
graceful reconnection · local persistence for resilience** (not as a source of
truth). **All product messaging must be corrected to honestly describe Aveyra as
a connected, cloud-based platform.** *(Action item: the M1 app's "always on your
device" copy is stale and must be revised in Milestone 2 — tracked in the README
remaining-items list.)*

## 19–24. Reaffirmed permanent principles (already in the record — cross-checked, consistent)
- **Product principles** (conversation before content; connection over
  engagement; privacy by default; quality over quantity; rituals not habits; help
  willing people connect, don't try to "fix" relationships; memories support
  conversations, don't replace them) — matches `volume-2-product-strategy.md`.
- **Research rule:** every major decision must cite user research, Mobbin, NN/g,
  Apple HIG, Material Design, Page Flows, or another reputable UX source — never
  add a feature because it's trendy. *(Adds "user research: surveys/interviews/
  usability testing" as an explicit citable source alongside the Design Research
  Policy's list — appended there.)*
- **Success metrics** (both-partner completion %, memories created, meaningful
  conversations, weekly active **couples**, 30/90/180-day retention, trust/
  satisfaction — never DAU/time-in-app/notification clicks) — matches strategy doc.
- **Design rule:** every screen must answer *"How does this help two people
  understand each other better?"* — matches the feature-entry criteria.
- **Positioning** and **North Star** — verbatim match to what's already recorded.
