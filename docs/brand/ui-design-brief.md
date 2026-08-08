# Aveyra — UI design brief

Everything needed to design Aveyra's screens and hand the result back. Part 1 is
a prompt for any design tool. Part 2 is the reference detail — real tokens, real
screens, real states.

*Updated after the feature round (Notes, the scripture ritual, view-once media,
daily suggestions) and after a real bug: see **The four states every screen
needs** — two screens shipped rendering nothing at all before setup was
finished.*

---

## Part 1 — The prompt

> Design the UI for **Aveyra**, a private web app for exactly two people in a
> relationship. It is calm, warm and unhurried — the opposite of a social app.
> Its heart is one shared question a day: both partners answer privately, and
> the answers unlock for each other only once both have written. What they
> choose to keep becomes a shared story over time.
>
> **Feeling:** intimate, quiet, a little romantic. Like a well-made paper
> notebook, not a dashboard. The interface should recede so the words between
> two people are the loudest thing on screen. The person it was built for asked
> for one thing above all: **peace of mind.** Nothing in the design should
> create a new thing to worry about.
>
> **Brand:** rose-gold and deep plum on warm blush. The logo is a serif "A"
> cradling a rose-gold heart, with a botanical sprig.
>
> *"The journey of discovering, remembering, and growing together."*
>
> **Hard rules — the design is wrong if it breaks these:**
> - No gamification. No streaks, badges, points, levels, progress bars,
>   percentages or leaderboards. Nothing that turns a relationship into a score.
> - No engagement pressure. No red notification dots, no counts, no urgency, no
>   read receipts, no typing indicators, no "last seen".
> - No social features. No feed, no public profile, no third person. Exactly two
>   people, forever.
> - No dark patterns. Nothing that nags, guilts, or makes leaving hard.
> - No surveillance. Nothing that analyses, scores, or reports on a partner.
>
> **Must be true:**
> - Accessible to WCAG 2.2 AA: 4.5:1 body text, 3:1 large text and interactive
>   shapes, 44×44px touch targets, visible keyboard focus, working light and dark.
> - Content first. Generous whitespace, one clear action per screen, short
>   sentences.
>
> **Voice:** plain, warm, second person. "You", and the partner by name. Never
> "we" — the app doesn't refer to itself as a company. No exclamation marks, no
> mascot copy. Where something has a limit, say the limit plainly.
>
> **Deliver:** light and dark for every screen, mobile (375px) and desktop
> (1280px), plus any component states you changed. For each screen, design its
> **resolving, not-set-up, empty and error** states too — not just the state
> where everything is populated.

---

## Part 2 — Reference

### Palette

| Role | Light | Dark |
| --- | --- | --- |
| Page ground | `#faf1ee` blush | `#1a1016` plum-black |
| Soft well | `#f2e3de` | `#21151d` |
| Card surface | `#fffbfa` | `#271923` |
| Border (decorative) | `#e8d3cc` | `#43303b` |
| Body text | `#2c1f29` deep plum | `#f0e6ec` |
| Secondary text | `#6a5560` | `#cbb6c0` |
| Muted text | `#6f5761` | `#a690a0` |
| Accent | `#a83f5b` berry-rose | `#e59ab0` |
| Accent strong | `#8c2f49` | `#f0b3c4` |
| Accent tint | `#f6e2e6` | rose at 14% |
| Rose-bronze | `#b06a3f` | `#dda67e` |
| Error | `#b23a4e` | `#e5899a` |

### Type

**Fraunces** for headings — a soft, characterful serif carrying the logo's
refinement. Set at **600**, not 700; a serif carries weight differently.
**Nunito Sans** for body *and for button labels* — a serif at button size reads
formal, and controls should feel plain to press.

Scale: `label 13 · body 16 · heading 22 · display clamp(1.6rem, 4.5vw, 2.4rem)`.
Spacing on a 4px scale. Corners `8 / 14 / 20 / 28px`, plus a pill.

Both faces are downloaded at build time and served from the app's own domain —
no runtime call to any font host, which is what keeps the app reachable
everywhere. Any replacement must be self-hostable the same way.

### Layout

- **Mobile** — fixed bottom bar. Past seven destinations it scrolls
  horizontally with fixed-width targets rather than dividing the width, so
  nothing shrinks below 44px and nothing hides behind an overflow menu.
- **Desktop** — 240px left rail with the logo; content column caps at 40rem.
- **Ten destinations**: Today · Check-in · Messages · Dates · Notes ·
  Scripture · Story · Vault · Write · Settings.

---

## Screens and their states

**Today** — the hero.
- *Answering* → question on a card, textarea. *Waiting* → your answer shown
  back, still editable. *Revealed* → both answers, then optional save-as-memory.
- An **arrival line** at the top when something happened: "Sam answered today's
  question." Plain sentences, no badge, no count, nothing to dismiss.
- A **daily suggestion** at the bottom: one small thing to try. No done button —
  it is an invitation, and nothing records whether it was taken.
- *Offline* → a calm inline notice.

**Check-in** — how you're arriving today. Six feeling words with emoji: Calm 🌿,
Happy 🌞, Grateful 🕊️, Tired 🌙, Stretched 🌧️, Low 🌫️, plus an optional line.
Editable all day. No graph, no trend, no average — weather, not a metric.

**Scripture** — a two-part daily ritual, not a verse handed to both.
- *Open* → whoever arrives first chooses. A verse is suggested so it's never a
  blank page, and can be swapped for any other. Optional note on why this one.
- *Waiting* → "Waiting to hear what Sam makes of it."
- *To respond* → the other reads it and writes what it stirred.
- *Complete* → both voices together.
- Translation (KJV or WEB) is **personal** — same verse, each reads their own.

**Notes** — three labelled channels, so nothing arrives as a surprise.
- 🌧️ *Something's weighing on me* — "Say it plainly. It doesn't have to be tidy."
- 🌞 *Something lovely*
- 🌿 *Something to try*
- The reader can mark a note read; **the sender is never shown a receipt**. A
  read receipt on a hard note turns silence into an accusation.
- Nothing is ever counted.

**Messages** — the two of you. Alternating bubbles, timestamps, composer pinned
low. Plus **pings**: one tap from six warm phrasings for when words are hard.
None of them is a question, so none can go unanswered.

**Dates** — Coming up (soonest first) · Ideas · Done together.

**Story** — memories newest first: date, title, optional photo, description.

**Vault** — end-to-end encrypted photos and video.
- Two send modes: **Keep it here** or **Show once**.
- A view-once item from the other person is **never auto-opened** — it waits
  behind "Tap to view once", because rendering it on mount would spend it just
  by scrolling past. After viewing: "Gone now — this was the one look."
- The screen states its limits plainly: the server can't read these; it can't
  stop a screenshot; if both devices are lost it's unrecoverable; deletion is
  permanent. Video up to 60 seconds.

**Write** — a private journal. Owner-only, never shared, never in Story.

**Sign-in / Verify** — email, then a six-digit code. No passwords, no social login.

**Onboarding** — name → create or join → details → invite link.

**Settings** — theme, export/import, the relationship, sign out.

---

## The four states every screen needs

This is the part most designs skip, and it shipped a real bug: Notes and
Scripture rendered their heading and then *nothing*, because there was no
relationship yet. A blank screen with no explanation reads as broken software,
not as unfinished setup. **Design all four, for every screen.**

1. **Resolving** — we don't know yet. "One moment…" and nothing else. Must not
   look like state 2.
2. **No space yet** — resolved, and there is genuinely no relationship. Say so
   plainly and offer the way out:
   > **Your space isn't set up yet**
   > Notes needs the two of you. Once your space exists and your partner has
   > joined, this page comes to life.
   > `[ Finish setting up ]`
   Controls that can't work are **hidden, not greyed**. A disabled button with
   no explanation is worse than no button.
3. **Empty** — set up, but nothing in it yet. Warm, with a way in: *"Your story
   starts here."* · *"It's quiet in here. Say something small."*
4. **Error** — plain and blameless: what happened, what to try. Never scold,
   never show a stack trace.

States 1 and 2 are the ones that look identical if you're not careful. Keep them
visibly distinct.

## Components

Button (primary / secondary / quiet / danger, three sizes), Input, Textarea,
Card, Modal, Dialog, Toast, Navigation, EmptyState, LoadingState, ErrorMessage,
NeedsSpace. All bespoke — no component library. Flag any new pattern; it has to
be built.

---

## Sending it back

Figma link, exported PNGs, or a written spec. Per screen: light and dark, mobile
and desktop, and a note on anything not in the component list. Change palette
values and the contrast gets re-checked against WCAG 2.2 AA before it ships.
