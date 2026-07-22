# Volume 2 · Part 3 — Complete Feature Specifications (Sections A–D)

> Received 2026-07-22. **Part 3 has 20 sections; A–D captured here, E–T pending.**
> This is the detailed feature spec that (with Part 4) gates the Milestone-2
> code build. Recorded faithfully; reconciliation notes flag where a section
> meets or conflicts with already-resolved decisions.

> 🔺 **One conflict flagged for the author (Section D):** the spec lists a
> **five**-destination bottom nav (Home / Timeline / Memories / Journal /
> Settings). The durable record already **resolved four** (Today · Story ·
> Write · Settings — "Home + Questions fold into Today; no fifth ever",
> 2026-07-21), and the built app uses four. Recorded below mapped onto the
> four-nav model, **pending the author's explicit confirmation**. See
> [open-questions.md](open-questions.md) Q13.

---

## Section A — Account Creation & Authentication

**Purpose.** The foundation: establish a secure identity, let two independent
users create/join a shared relationship space, protect data, minimise onboarding
friction, keep trust from the first interaction. Auth must feel effortless while
remaining secure.

**Goals.** Onboarding in **< 3 minutes**; minimal personal info; no unnecessary
complexity; never expose relationship info before authentication; smooth
transition into create/join.

**Principles.** Privacy first (collect only what's required) · Low friction (no
passwords where possible) · Security by default (every session protected) ·
Recovery without complexity (regain access via verified email).

**Required info.** Email address + Display name. *Optional (future):* profile
photo. Nothing else at registration.

**Method.** **Email OTP / magic link** (Supabase `signInWithOtp`). Rationale:
no forgotten passwords, faster onboarding, lower cognitive load, native Supabase
support, easier recovery, consistent with a calm experience.

**Registration flow.** Open → *Create Account* → enter email + display name →
receive code/link → verify email → auth completes → proceed to Relationship
Setup.

**Returning user.** Open → enter email → receive OTP → verify → land on Home. No
password.

**Session management.** Secure session on success; persists across restarts;
secure automatic refresh; expired → re-authenticate.

**Logout.** Sign out any time → removes local session, **does not delete data**,
requires email verification again to return.

**Recovery.** Verified-email only: enter email → OTP → verify → session restored.
No security questions, no password resets.

**Errors (friendly, no jargon).** Invalid email · Expired OTP (allow resend) ·
Invalid OTP (gentle guidance) · Network error (explain + retry) · Rate limit
(inform without abuse).

**UX.** Calm, friendly, minimal, fast, trustworthy. Avoid jargon, long forms,
multiple pages, unnecessary confirmations.

**Accessibility.** Screen readers, keyboard nav, high contrast, scalable text,
large touch targets, clear focus indicators.

**Security.** Verify every email; HTTPS only; secure session storage; never
expose credentials; protect against replay; respect Row-Level Security (Part 4).

**Supabase notes (author-provided research).** Magic links & email OTP share one
`signInWithOtp` flow; rate-limited by default (~1 request / 60s, ~1h expiry);
the email-OTP expiry setting also governs magic-link/confirmation/recovery
(dashboard → Authentication → Email); `shouldCreateUser` controls auto-signup.

**Acceptance.** Account in < 3 min; only email + display name; reliable OTP;
passwordless returning sign-in; informative errors; secure sessions; a11y met.

**Future (not MVP).** Google / Apple sign-in, optional MFA, trusted-device
recognition, biometric unlock, multiple-email management.

**Reconciliation.** ✅ Fully consistent with resolved decisions (Auth → email
OTP/magic link; account info → email + display name only; Supabase; RLS in
Part 4). No conflict.

---

## Section B — Relationship Space Creation & Partner Invitation

**Purpose.** The Relationship Space is the heart of Aveyra — the secure, private
environment shared by **exactly two people**. Not a chat app: it encourages
*intentional* connection through curated interactions, not continuous messaging.

**Objectives.** Connect exactly two users; one shared environment; clearly
separate shared vs private content; simple to create/understand; maintain trust
& privacy; support future expansion without changing the core model.

**Core principles.**
- **One shared space** per relationship; everything shared belongs to it.
- **Two equal participants** — neither has greater emotional authority; equal
  access; admin permissions exist only where *technically* necessary.
- **Privacy by design** — personal stays personal; shared exists only by
  intentional participation.
- **Intentional participation** — joining always requires explicit consent; no
  one is added automatically.

**Lifecycle.** **Draft** (created by first user, awaiting invite) → **Pending**
(invite sent, awaiting acceptance) → **Active** (both joined; all shared features
available) → **Paused** *(future — inactive, no reminders/new questions, history
accessible)* → **Archived** *(future — no longer active; data per user choice)*.

**Creating a space.** After account creation → *Create Relationship*. Collect:
relationship **name** (optional), **start date** (optional), **timezone**, cover
image (future). Creator becomes initial **administrator for technical management
only**.

**Relationship name.** Optional (e.g. "Our Journey", "Michael & Sarah"). If
omitted, a neutral default: **"Our Relationship"**. Renameable any time.

**Timezone.** Creator selects the **primary** timezone — the shared reference for
Daily Questions, anniversaries, milestones, even if partners live apart.

**Partner invitation.** *Invite Partner* generates a **secure invitation code** +
optional link + expiration. Codes must be **random, hard to guess, single-use,
time-limited**.

**Joining.** Invited partner: create account (if needed) → *Join Relationship* →
enter code / open link → review details → **confirm acceptance**. Space activates
**only after confirmation**.

**Expiration.** Codes expire after a configurable period (**recommended 7 days**);
expired cannot be reused; creator may regenerate.

**Invitation states.** Draft · Sent · Pending · Accepted · Expired · Revoked.
**Only one active invitation at a time.**

**Ownership.** Only for administrative actions (regenerate/manage invitations).
After activation, shared content belongs **equally** to both; neither owns the
relationship emotionally.

**Shared content** (both partners): Daily Questions · shared answers · shared
memories · timeline · milestones · relationship settings.

**Private content** (author only): private journal · draft reflections · personal
preferences · notification settings · accessibility settings.

**Permissions.** Both may create memories, edit their own contributions, view
shared history, answer Daily Questions, participate equally. Admin privileges
stay minimal.

**Partner leaving.** Remaining user gets a clear explanation; space enters a
**protected state**; **no data immediately deleted**; full handling in Part 4.

**Deletion.** Major action: multiple confirmations, clear explanation, **grace
period** before permanent deletion, chance to **export** first. Policies
finalised in Part 4.

**Security.** Invitations cryptographically secure; prevent brute-force; prevent
reuse; respect RLS; never expose personal info before acceptance.

**Acceptance.** Create a space in < 2 min; secure invitation generated; second
user joins; shared/private correctly separated; activation requires explicit
consent; a11y met; errors clearly handled.

**Future.** QR invitations, deep links, trusted-device pairing, multiple invite
methods, relationship transfer, family/group spaces (outside MVP).

**Reconciliation.**
- ✅ Two equal participants / one shared space → matches the **neutral
  `participants`** model (Participant A/B, partner-forward copy).
- ✅ Secure, single-use, time-limited (7-day) invitation with a public-key-
  carrying code → matches the **built `lib/invitation` foundation** (7-day TTL,
  single-use code, unambiguous alphabet); server-side single-use enforcement &
  authenticity remain Part-4 work (already noted in code).
- 🟡 **Lifecycle naming:** spec uses `Draft/Pending/Active/Paused/Archived`; the
  resolved model was `Pending/Active/Paused/Archived/Closed`. **Reconcile:**
  adopt **Draft** as the initial creator state; retain **Closed** as the terminal
  state (post-deletion/grace). Net set: `Draft → Pending → Active → Paused →
  Archived → Closed`.
- 🟡 **New field:** relationship **name** (optional, default "Our Relationship")
  is not in the current M1 schema (which has `partner_name`). Add for M2.

---

## Section C — Onboarding Experience

**Purpose.** Introduce Aveyra and answer three questions — *What is Aveyra? Why
is it different? How do I begin?* — building confidence, excitement, and trust
with minimal effort. Not a feature tour.

**Objectives.** Explain purpose in < 1 min; set expectations; build privacy
trust; help create/join a space; demonstrate immediate value; minimise friction;
encourage completion without pressure.

**Principles.** Purpose before features · Calm, not salesy (honest, human) · Show
value early · Minimal steps.

**Flow.** Welcome → Introduction → Privacy Commitment → Account Creation →
Relationship Setup → Partner Invitation/Join → **First Shared Experience**.

**Welcome.** "Welcome to Aveyra — a private space where two people can understand
each other better, preserve meaningful moments, and grow together." Primary:
*Get Started*. Secondary: *Learn More*. Minimal text, calm illustration, strong
identity, no feature overload.

**Introduction.** Emotional value, not a feature list: more meaningful
conversations; preserve moments that matter; build your story together; private
by design.

**Privacy commitment (own screen).** "Your conversations belong to you · your
shared memories remain private · your information is never sold · Aveyra is
designed around trust." Links to Privacy Policy & Terms. No technical language.

**Account creation transition.** Collect only email + display name; explain why.

**Relationship choice (present both equally).** *Create a Relationship* /
*Join a Relationship* — don't assume every user is the creator.

**Creating.** Name (optional), start date (optional), timezone. < 1 min.

**Inviting.** "Your partner will create their own account and join your shared
space using a secure invitation." Copy code / share link / regenerate.

**Joining.** Clear confirmation of whose invitation; accept or decline; explain
what becomes shared; assure private stays private.

**Empty relationship (waiting).** Calm waiting screen: "Your relationship space
is ready. Once your partner joins, you'll begin your journey together." Light
guidance, not repeated prompts.

**First Shared Experience.** When both have joined, introduce the core value via
the **first Daily Question** — the official fixed opener:

> **"What's one small thing about yourself that you hope I always remember?"**

Should feel safe, personal, easy, thought-provoking.

**First answer flow.** Each partner answers **privately**; neither sees the
other's until **both** submit (fairness + curiosity).

**First reveal.** Both answers shown together in a calm, celebratory interface;
offer (don't require) *Save this as your first shared memory*.

**First success moment.** Gentle congratulation: "You've just created the first
page of your Aveyra journey." Single action: *Continue to Home*.

**Empty Home.** Encouraging guidance (answer tomorrow's question; create your
first memory; explore your timeline as it grows) — no tutorial overload.

**Completion.** Account created · space exists · both joined (or creator waiting)
· first shared question completed or ready.

**Accessibility / UX.** Screen readers, keyboard nav, large targets, high
contrast, **reduced motion**, clear progress indicators. Feel calm, hopeful,
human, private, welcoming. Avoid long explanations, feature checklists, forced
tutorials, pop-up overload.

**Acceptance.** Purpose understood < 1 min; account < 3 min; create/join without
confusion; privacy clearly communicated; first question demonstrates value; user
reaches Home; a11y met.

**Reconciliation.**
- ✅ Fixed first question is **verbatim** the built draft `q-open-01`
  (`FIRST_QUESTION_ID`) in `lib/questions/bank.ts`.
- ✅ Private-then-mutual-reveal → matches the **async two-device reveal**
  decision; "save as memory" → **"Daily Questions is the hero; Memories are the
  outcome."**
- ⚠️ **Honesty guardrail:** the privacy screen copy ("belong to you", "remain
  private", "never sold") is compatible with **staged privacy** and must stay
  that way — **never imply E2EE / "no one can read your data"** until real
  (server-side encryption at rest + RLS at launch).

---

## Section D — Home Dashboard  🔺 *(nav conflict — see top)*

**Purpose.** The heart of the daily experience; first screen after sign-in and
the most-returned-to. Not a social feed — answers one question: *"What meaningful
thing can we do together today?"*

**Objectives.** Communicate current relationship status; surface today's most
meaningful action; effortless navigation; celebrate progress without pressure;
calm, welcoming, personal; minimise cognitive load.

**Principles.** Meaning before activity · **one primary focus** (usually Today's
Daily Question) · calm visual hierarchy (generous whitespace) · intentional
return (quality over quantity).

**Information hierarchy (in order).** Greeting → **Today's Daily Question (hero)**
→ Relationship Snapshot → Recent Shared Activity → Quick Actions → Upcoming
Milestones. Everything else lives elsewhere.

**Greeting.** Warm, contextual, time-based; personalise with display name; no
marketing language.

**Hero — Today's Daily Question.** The most important element; always visible
without scrolling. Shows: today's question; completion status; **whether the
partner has answered (without revealing their answer)**; CTA (*Answer Today's
Question* / *Continue Your Answer* / *View Reveal* when both done).

**Relationship snapshot.** Days together (if start date) · memories created ·
questions answered together · upcoming anniversary · recent milestone. **Present
as meaningful narrative, never a competitive score.**

**Recent shared activity.** Short chronological summary, **max 5 items**,
tappable for detail.

**Quick actions (secondary to the hero).** Create Memory · View Timeline · Open
Journal · Search · Relationship Settings.

**Upcoming milestones.** One is enough (e.g. "Anniversary in 10 days"); don't
overwhelm with countdowns.

**Empty states.** New relationship (welcome + first question + invite status) ·
Waiting for partner (ready message + copy code / share link) · No memories yet
(gentle "your journey begins with today's conversation").

**Completion states.** Answered → replace hero with "Today's conversation is
complete" + *View Reveal* / *Save as Memory*; already saved → small confirmation.

**Activity indicators.** Subtle only (partner joined, new memory, answer
submitted, invitation pending). **No bright badges, red urgency, or artificial
pressure.**

**Navigation (🔺 as written).** Bottom nav: **Home · Timeline · Memories ·
Journal · Settings**; Home is the default landing page.

**Personalization.** Time-based greeting, milestones, seasonal illustrations,
recent activity — light, predictable.

**Visual / motion.** Calm, warm, spacious, elegant, reassuring; readability over
decoration. Subtle meaningful motion only (gentle fades, smooth transitions, soft
celebration) — **no confetti, flashy animation, reward explosions, or
gamification**. Honour reduced-motion.

**Accessibility.** Screen readers, keyboard nav, dynamic text sizing, high
contrast, reduced motion, clear focus; **all primary actions reachable without
gesture-only interaction**.

**UX feeling.** Welcome, calm, connected, curious, encouraged. Never judged,
pressured, guilty, overwhelmed.

**Acceptance.** Users know what to do next; Daily Question is always the primary
focus; shared activity easy to review; navigation intuitive; empty states
meaningful; a11y met; interface calm and uncluttered.

**Future.** Personalized insights, AI conversation suggestions, shared goals,
anniversary collections, seasonal themes, recap cards — all still within
intentional-connection + privacy principles.

**Reconciliation.**
- ✅ Hero = Daily Question · snapshot-as-narrative-not-score · calm indicators ·
  no gamification → all match resolved principles and the permanent prohibitions.
- 🔺 **CONFLICT — navigation count.** Five destinations (Home/Timeline/Memories/
  Journal/Settings) vs the **resolved four** (Today/Story/Write/Settings). The
  four-nav resolution folds: **Home → Today** (this whole dashboard *is* the
  Today screen), **Timeline + Memories → Story** (the compounding archive of
  entries, memories, milestones), **Journal → Write**, **Settings → Settings**.
  Recorded under the four-nav model pending author confirmation (Q13). Every
  Section-D requirement maps cleanly onto **Today** (the dashboard) with no loss.
