# UI Redesign Guide — 10-Feature Navigation

**Scope:** Aveyra Flow with all 10 feature areas embedded in a unified navigation model.
**Foundation:** Volume 3 Design System + Brand Identity + Constitution emotional-safety rules.

---

## Navigation Structure

### The 10 Features (Updated Information Architecture)

| # | Feature (UI Label) | Canonical Name | Purpose | Type |
|---|---|---|---|---|
| 1 | **Today** | Home Dashboard | Daily question + overview + quick actions | Core |
| 2 | **Check-in** | Emotional Wellness | Mood check-ins; optional notes | Embedded |
| 3 | **Messages** | Private Messaging | Async messaging between partners | Embedded |
| 4 | **Dates** | Date Planner | Shared date ideas; status (coming up/done/ideas) | Embedded |
| 5 | **Notes** | Three note kinds | Weighing/Lovely/Idea; sent to partner | Embedded |
| 6 | **Scripture** | Spiritual Ritual | Choose verse → reveal → respond flow | Embedded |
| 7 | **Story** | Memory Vault | Shared timeline; memories + photos | Core |
| 8 | **Vault** | View-once Media | Encrypted sensitive images/videos; disappear after view | Embedded |
| 9 | **Write** | Private Journal | Personal reflection; never shared | Core |
| 10 | **Settings** | Account + Relationship | Profile, privacy, auth, help | Core |

**Architecture decision:** All 10 are available; the UI reorganizes them within the four core destinations or as persistent bottom/side navigation. The constitution's "no fifth destination" means no 10 separate routes—features embed within the navigation structure you design.

---

## Brand Identity (Resolved Q27 — 2026-08-03)

### Logo
- **Mark:** Serif **A** with two paths converging at an apex; warm point of light between them
- **Wordmark:** lowercase "aveyra" in Fraunces display serif, slightly letter-spaced
- **App icon:** Mark on rose-gold-to-plum gradient field, rounded square

### Color Palette — *Roses & Plums*

**Resolved palette (supersedes earlier Evergreen + Gold):**

| Token | Light | Dark | Role |
|---|---|---|---|
| Background | Blush `#faf1ee` | Plum-black `#1a1016` | Page |
| Text | Deep plum `#2c1f29` | Lifted rose `#e59ab0` | Primary text |
| Accent (Primary) | Berry-rose `#a83f5b` | Lifted rose `#e59ab0` | Actions, links, focus |
| Accent strong | Strong rose `#8c2f49` | — | Hover/pressed |
| Bronze | Rose-bronze `#b06a3f` | — | Secondary warmth |
| Success | Sage green | — | System only |
| Warning | Warm amber | — | System only |
| Error | Soft red | — | System only |

**Rules:**
- Berry-rose acts; gold light (milestone moments only) celebrates
- Status colors (success/warning/error) describe the *system* only, never the relationship
- No color is sole signal — pair with icon + text
- All text ≥4.5:1 contrast in both themes (verified)
- Dark mode is "plums at night": deep plum-black, lifted rose text, warmth maintained

---

## Typography

| Role | Font | Fallback | Notes |
|---|---|---|---|
| **Display** | Fraunces (serif) | Iowan Old Style, Palatino, Georgia | Questions, titles, wordmark; the voice of the journal |
| **Body/UI** | Inter (sans) | System sans (-apple-system, Segoe UI, Roboto) | Interface, answers, controls; the voice of the tool |

**Scale:**
- Label: 13px
- Body: 16px (line-height 1.6)
- Heading: 22px
- Display: clamp(1.6rem, 4.5vw, 2rem)
- All text scales to 200% without loss
- Measure: 60–75 characters for comfortable reading

**Philosophy:** Serif appears where Aveyra speaks with feeling (the question, a milestone). Sans is the tool's voice. The contrast is the interface's emotional register.

---

## Spacing & Layout

**Base unit:** 4px scale

| Space | Value | Use |
|---|---|---|
| `--space-1` | 4px | Tight spacing within dense layouts |
| `--space-2` | 8px | Element-to-element spacing |
| `--space-3` | 12px | Section gutters |
| `--space-4` | 16px | Primary padding, margins |
| `--space-5` | 24px | Large sections |
| `--space-6` | 32px | Between major sections |
| `--space-7` | 48px | Large vertical rhythm |
| `--space-8` | 64px | Heroic spacing |

**Layout:**
- Mobile-first, single column
- `max-app-width` on tablet/desktop (readable width)
- Generous vertical rhythm; whitespace is a feature
- Safe areas honored (notches, gesture bars)
- 44×44px minimum touch targets

---

## Components

### Cards
- `surface` background + hairline `border` + soft shadow (`shadow-sm`)
- Content-first; no decorative headers
- Media-forward (when photo exists) vs text-forward (when not)
- Responsive: single-column mobile → multi-column tablet

### Buttons
- **Pill shape** (rounded-full); 44px minimum height
- **One primary (rose-accent) per screen section**; others quiet/secondary
- States: default / hover (gentle scale 0.98) / focus / pressed / disabled / loading
- Labels: action verb + object, sentence case ("Save memory", not "OK")
- Variants: primary / secondary / quiet / danger (destructive)
- Confirmation required for delete/account/leave actions

### Inputs
- Label always visible (above field), never placeholder-as-label
- Bordered fields on `bg` or `surface`
- Focus ring: rose-accent, 3:1 contrast minimum
- Errors: inline, kind, specific ("This field can't be empty")
- Autosave support for writing inputs (journal, daily answers)

### Feedback
- **Empty states:** warm invitation, never "No data"
- **Success:** quiet toast/inline; routine successes don't interrupt
- **Errors:** calm, actionable, no blame/codes
- **Loading:** skeleton placeholders mirroring final layout (not spinners)
- **Offline/pending:** read as normal, not broken

### Dialogs & Modals
- **Confirmation only for destructive/irreversible** (delete, leave)
- **Never confirm routine reversible actions**
- Cancel ≥ primary prominence; destructive never default-focused
- No guilt/urgency copy; focus-trapped, ESC/backdrop dismissible
- 100–200ms transition

---

## Motion & Animation

**Duration scale:**
- Fast: 100ms
- Base: 150–200ms
- Reveal: up to 500ms (the one exception)
- All other: instant

**Easing:** soft ease `cubic-bezier(0.2, 0.7, 0.2, 1)`

**Budget (Constitution Part 2 §8):** Exactly three places get motion:
1. **The reveal** (emotional center) — unhurried, gold light, announced
2. **Page transitions** (soft, directional)
3. **Save settle** (brief fade)

**Everything else: instant.**

**Reduced motion:** First-class support. Collapse animations to opacity/instant; meaning never lives in the animation. Applied immediately mid-session.

**Rule:** User content (photos, entries) never animates. Only the chrome framing them moves.

---

## Voice & Tone

**Voice (constant — never changes):**
- Warm, not sentimental
- Plain, not clinical
- Quiet, not chatty
- **Honest, not reassuring-by-default** (say plainly when something can't be recovered)

**Tone (shifts by context):**
- Routine: straightforward
- Empty: inviting (one action)
- Error: calm + actionable
- Destructive: honest about consequences + export path
- Milestone: celebratory (but measured)
- Sensitive: fewer words

**Rules:**
- Address users as "you"
- **Aveyra never speaks in first person or says "we"** (it is not a participant)
- Sentence case throughout (incl. buttons/titles)
- Front-load meaning
- One idea per sentence
- **Ban:** system words (sync/cache/query), marketing words (amazing/seamless), presumptive emotional language
- **Never interpret/score/evaluate the relationship**
- No comparison; never remark on inactivity/absence
- Strings externalised (no concatenation); tolerate 30–50% expansion

**Copy violations to fix:**
- ~~"and **we'll** send a sign-in code"~~ → "A sign-in code is on its way"
- ~~"**We sent** a 6-digit code"~~ → "A 6-digit code was sent to…"

---

## Emotional Experience Targets

| Surface | Feel | Design Cue |
|---|---|---|
| **Today** | Curious · Comfortable · Thoughtful | Display serif question, alone on paper; answering feels like writing in a book |
| **Story** | Nostalgia · Pride · Growth · Perspective | Vertical timeline (oldest anchored at start date); reading energy, not scrolling-feed |
| **Write** | Safe · Honest · Calm · Unjudged | Quietest room: near-empty paper, autosave, no sharing chrome. The writer's own. |
| **Shared spaces** | Growing together | Frame the couple as *walking a path*, never *maintaining performance*. No activity signals, no absence counters, no "your partner hasn't…" |

---

## Constitutional Constraints (Permanent)

**§1.2 Emotional Design — BINDING:**
- ❌ No XP, levels, ranks
- ❌ No consecutive-day streaks or loss framing
- ❌ No scores, grades, ratings of the relationship
- ❌ No leaderboards or comparison
- ❌ No features locked behind earned progress
- ❌ **Nothing that renders one partner as a deficit to the other**

**§2.3 — Nothing may show absence/waiting/deficit:**
- ❌ "Your partner is waiting"
- ❌ "They haven't answered in 6 days"
- ❌ Absence counters
- ❌ Comparison
- ✅ "An open state" (neutral, not a failure)

**§4.2 — Navigation:**
- ✅ Four core destinations (Today · Story · Write · Settings)
- ✅ Additional features embed within or alongside
- ✅ Position/order never change
- ✅ Always a way back

**§6–8 — Accessibility:**
- ✅ WCAG 2.2 AA (4.5:1 body, 3:1 large text)
- ✅ Full keyboard operability, visible focus (≥3:1)
- ✅ Screen reader: landmarks, live regions for reveals, semantic HTML
- ✅ Touch targets ≥44×44px
- ✅ Reduced motion honored everywhere
- ✅ Colour never sole signal

---

## File Locations

- **Design Tokens:** `/app/globals.css` (CSS custom properties)
- **Tailwind Config:** `/tailwind.config.ts` (token utilities)
- **Typography:** `--font-display` (Fraunces) / `--font-body` (Inter)
- **Logo & Icons:** `/components/ui/Logo.tsx`, icon components
- **Primitives:** `/components/ui/` (Button, Input, Card, Modal, Toast, etc.)
- **Brand Guide:** `/docs/brand/aveyra-brand-identity.md`
- **Full Design System:** `/docs/constitution/volume-3-part-1-design-system.md`

---

## Key Design Decisions for the 10-Feature UI

1. **Navigation model:** Choose a structure that keeps the 10 features coherent. Options:
   - Bottom bar (5 primary + overflow menu) + top sheet/modal for Check-in, Messages, etc.
   - Side rail on desktop, bottom bar on mobile, with grouping (e.g. "Rituals" → Check-in, Scripture, Dates)
   - Flat 10-item navigation with smart grouping/sections

2. **Feature prioritization:** Today, Story, Write, Settings are core. The 6 embedded features (Check-in, Messages, Dates, Notes, Scripture, Vault) should feel like natural extensions of the core, not afterthoughts.

3. **State consistency:** The same emotional target should carry through all surfaces. A moment on Today should *feel* like a moment on Story.

4. **Offline/pending language:** Sync language is now valid (web-first). Use "Saved locally. Will sync when connected." where appropriate.

5. **Copy audits:** Fix the "we" language in sign-in/verify pages.

---

**Ready to redesign. The foundation is solid; the palette, typography, and emotional targets are locked. Have at it.**
