# Aveyra — UI design brief

Everything you need to design Aveyra's screens yourself and hand the result
back. Part 1 is a prompt you can paste into any design tool. Part 2 is the
reference detail — real tokens, real screens, real states — so what you design
maps cleanly onto what's already built.

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
> two people are the loudest thing on screen.
>
> **Brand:** rose-gold and deep plum on warm blush. The logo is a serif "A"
> cradling a rose-gold heart, with a botanical sprig; the tagline is "The
> journey of discovering, remembering, and growing together."
>
> **Hard rules — the design is wrong if it breaks these:**
> - No gamification of any kind. No streaks, badges, points, levels, progress
>   bars, percentages, leaderboards or "you're on a roll!" Nothing that turns a
>   relationship into a score.
> - No engagement pressure. No red notification dots, no urgency, no "don't
>   break your streak", no read receipts, no typing indicators, no "last seen".
> - No social features. There is no feed, no public profile, no third person.
>   Exactly two people, forever.
> - No dark patterns. Nothing that nags, guilts, or makes leaving hard.
> - Accessible: WCAG 2.2 AA. Body text at 4.5:1 contrast, large text and
>   interactive shapes at 3:1, touch targets at least 44×44px, a visible focus
>   ring on everything reachable by keyboard, and it must work in light and
>   dark themes.
> - Content first. Generous whitespace, one clear action per screen, short
>   sentences.
>
> **Voice:** plain, warm, second-person. Speak to the user as "you" and to
> their partner by name. Never say "we" — the app doesn't refer to itself as a
> company. No exclamation marks, no cutesy mascot copy.
>
> **Screens to design:** listed in Part 2 below, with the states each one needs.
>
> Deliver: light and dark for each screen, mobile (375px) and desktop (1280px),
> plus any component states you changed.

---

## Part 2 — Reference

### The palette in use

These are the live tokens. Keep the roles; change the values if you want, but
re-check contrast if you do.

| Role | Light | Dark |
| --- | --- | --- |
| Page background | `#faf1ee` blush | `#1a1016` plum-black |
| Soft background (wells, quiet rows) | `#f2e3de` | `#21151d` |
| Card surface | `#fffbfa` | `#271923` |
| Border (subtle, decorative) | `#e8d3cc` | `#43303b` |
| Body text | `#2c1f29` deep plum | `#f0e6ec` |
| Secondary text | `#6a5560` | `#cbb6c0` |
| Muted text | `#6f5761` | `#a690a0` |
| Accent (buttons, links, active nav) | `#a83f5b` berry-rose | `#e59ab0` |
| Accent strong (hover, emphasis) | `#8c2f49` | `#f0b3c4` |
| Accent soft (tints, selected) | `#f6e2e6` | rose at 14% |
| Warm secondary | `#b06a3f` rose-bronze | `#dda67e` |
| Error | `#b23a4e` | `#e5899a` |

### Type

**Fraunces** for headings — a soft, characterful serif carrying the logo's
refinement without the roundness a display sans was giving it. Its `SOFT` axis
rounds the terminals slightly and `WONK` allows its alternate shapes; both sit
low, so it reads warm rather than novelty. Set headings at **600**, not 700 — a
serif carries weight differently and 700 reads heavier than the design wants.

**Nunito Sans** for body and for control labels. Buttons deliberately use the
body face, not the display serif: a serif at button size reads formal, and
controls should feel plain to press.

Sizes are `label 13px · body 16px · heading 22px · display clamp(1.6rem, 4.5vw,
2.4rem)`. Spacing is a 4px scale. Corners are generous: `8 / 14 / 20 / 28px`
and a pill for round things.

Both faces are downloaded at build time and served from the app's own domain —
no call to Google Fonts at runtime, which is what keeps the app reachable
everywhere. Any replacement has to be self-hostable the same way.

### Layout

- **Mobile** — fixed bottom navigation bar, content scrolls above it.
- **Desktop** — 240px left rail with the logo at the top; content column caps
  at 40rem so lines stay readable.
- Seven destinations: **Today · Check-in · Messages · Dates · Story · Write ·
  Settings.** On mobile the bar is icon-only (labels remain for screen
  readers); the desktop rail always shows labels.

### Screens and the states each needs

**Today** — the hero. One question a day.
- *Answering*: the question on a card, a textarea, "Submit answer".
- *Waiting*: your answer shown back, "Waiting for [name]", still editable
  until they answer.
- *Revealed*: both answers side by side, then an optional one-tap "Save this
  as a memory".
- *Offline*: a calm inline notice, never an error page.

**Check-in** — how you're arriving today.
- Six feeling words with an emoji each: Calm 🌿, Happy 🌞, Grateful 🕊️,
  Tired 🌙, Stretched 🌧️, Low 🌫️. Plus an optional one-line note.
- After submitting: your card, their card, or "[name] hasn't checked in yet
  today". Editable all day. No history graph, no trend, no average — this is
  weather, not a metric.

**Messages** — the two of you, nothing else.
- Alternating bubbles (yours accent-filled and right-aligned, theirs soft and
  left-aligned), timestamps, a composer pinned at the bottom.
- Empty: "It's quiet in here. Say something small. Small things count."

**Dates** — a shared list.
- Three groups: **Coming up** (dated, soonest first), **Ideas** (no date yet),
  **Done together**.
- A row can get a day ("Pick a day"), be marked "We did this", or be removed.

**Story** — the archive that compounds.
- Reverse-chronological memories: date, title, optional photo, description.
- Can also add a memory directly, with an optional photo.
- Empty: "Your story starts here."

**Write** — a private journal, owner-only. Never shared, never in Story.

**Settings** — theme (system/light/dark), export and import your data, the
relationship, sign out.

**Sign-in / Verify** — email address, then a six-digit code. Passwordless; no
social login, no passwords anywhere.

**Onboarding** — your name → create a space or join with an invite → a few
details → an invite link to send your partner.

### Components that exist

Button (primary / secondary / quiet, three sizes), Input, Textarea, Card,
Modal, Dialog, Toast, Navigation, EmptyState, LoadingState, ErrorMessage. All
bespoke — no component library. If you introduce a new pattern, say so, since
it has to be built from scratch.

### Empty, loading and error states

Every list needs all three, and they should feel like the rest of the app: a
soft symbol, a short warm line, and a way forward. Loading says "One moment…".
Errors are plain and blameless — say what happened and what to try, never
scold, never show a stack trace.

---

## Sending it back

Whatever's easiest — Figma link, exported PNGs, or a written spec. Most useful
per screen: light + dark, mobile + desktop, and a note on anything new that
isn't in the component list above. If you change palette values, mention it and
I'll re-run the contrast check before it ships.
