# Aveyra — Brand Identity Guide

**Version 2.0 · Replaces all Weave-era branding.**
Every decision in this document traces back to one sentence:

> **"Discovering, remembering, and growing together."**

---

## 1. Brand Story

Two people set out from different places. Somewhere along the way, their paths
meet — and from that point on, the road is shared.

Aveyra is the name of that road. It is built from two ideas: **Avela** —
discovery, revelation, the opening of what was hidden — and **Veya** — the
journey, the path, the moving forward. A relationship is both at once: the
slow uncovering of another person, and the long walk beside them.

Most technology about love is loud. It performs romance, counts affection,
and turns intimacy into content. Aveyra is the opposite object: a quiet,
private place — closer to a journal bound in good paper than to an app —
where two people keep what they discover about each other, and watch the
path they are walking grow longer behind them.

The brand, therefore, is not decorated with romance. It is built from the
materials of a journey kept well: paper, evening light, deep green, and a
single warm point of light where two paths meet.

## 2. Mission

Help two people understand each other more deeply, preserve what matters,
and grow together — privately, calmly, and on their own terms.

## 3. Vision

To be the most trusted companion a relationship can have: a place so private,
honest, and well-made that a couple would keep their most meaningful moments
in it for decades.

## 4. Brand Personality

| Aveyra is | Aveyra is never |
|---|---|
| Intimate — it speaks quietly, to two people | Childish, cute, or saccharine |
| Premium — crafted, restrained, precise | Expensive-feeling, exclusive, cold |
| Emotional — it honors real feeling | Overly romantic, performative |
| Modern but timeless — it will not date | Trendy, gradient-chasing |
| Private and trustworthy — structurally, not decoratively | Watching, counting, or scoring |
| Calm and warm | Urgent, gamified, demanding |

**Forbidden imagery:** hearts as iconography, kissing silhouettes, rings,
Cupid/arrow motifs, stock-photo romance, bright candy palettes, swipe-card
metaphors. If it could appear in a dating app, it does not appear in Aveyra.

---

## 5. Logo

### 5.1 The mark — *The Meeting Path*

Two strokes rise from opposite corners and meet at a single apex — an **A**
drawn as **two paths converging**. In the open space between them rests a
small warm point of light.

Three readings, all intentional, all true to the name:

1. **Two journeys becoming one** — the strokes are two people's paths,
   separate at the base, joined at the top. (Veya)
2. **Discovery** — the gold point is the moment of revelation; light found
   in the space two people make between them. (Avela)
3. **A kept moment** — the mark is also a mountain at dusk with a low sun:
   a memory of somewhere you went together. (Remembering)

The mark contains no letterform tricks and no hearts. At 16 px it reads as
a clean peak-and-light glyph; at 512 px the geometry is soft and deliberate
(rounded terminals, optically corrected apex).

### 5.2 Wordmark

**aveyra**, set lowercase in the display serif, letter-spaced slightly wide
(+2%). Lowercase because the brand speaks quietly; the serif because it
belongs to the world of books and journals, not dashboards.

### 5.3 Variants

| Variant | Composition |
|---|---|
| Primary logo | Mark + wordmark, horizontal |
| App icon | Mark on deep-evergreen gradient field, rounded square |
| Maskable icon | Same, geometry held inside the 80% safe zone |
| Favicon | Mark alone, monochrome-capable |
| Light-mode mark | Evergreen strokes, gold light, on paper |
| Dark-mode mark | Ivory strokes, gold light, on deep evergreen |
| Monochrome | Single-color strokes + dot; the dot may be knocked out |

**Clear space:** the height of the light-point on all sides.
**Minimum size:** 16 px (favicon geometry), 24 px (full-detail mark).

---

## 6. Color System — *First Light on the Path*

The palette is drawn from the brand story's three materials:

- **Journey → Evergreen.** Deep, stable green — the color of a long path,
  of trust and of growth. This replaces Weave's navy entirely.
- **Discovery → Dawn Gold.** A restrained, warm gold — first light, the
  moment of finding. Used sparingly, like light should be.
- **Remembering → Paper.** Warm ivory surfaces — the journal the whole
  product pretends to be. Never clinical white.

### 6.1 Core palette

| Token | Light | Dark | Role |
|---|---|---|---|
| `bg` | `#F7F5EF` | `#101815` | Page — warm paper / evergreen night |
| `bg.soft` | `#EEEAE0` | `#16201C` | Recessed areas |
| `surface` | `#FFFEF9` | `#1A2420` | Cards |
| `surface.raised` | `#FBF9F3` | `#223028` | Overlays, toasts |
| `border` | `#DED9CB` | `#31413A` | Hairlines |
| `text` | `#1F2521` | `#EDF0EA` | Primary text (green-black / warm ivory) |
| `text.soft` | `#555C55` | `#B9C2B8` | Secondary text |
| `text.mute` | `#646B63` | `#94A096` | Metadata — **≥ 4.5:1 verified** |
| `primary` (accent) | `#2E6B5E` | `#86C2AC` | Actions, links, focus — Evergreen |
| `primary.strong` | `#245548` | `#9ED3BF` | Hover/pressed |
| `primary.soft` | `#E3EDE8` | `rgba(134,194,172,.14)` | Selected fills |
| `gold` (highlight) | `#B9822F` | `#D9A45F` | The light-point; milestone moments only |
| `success` | `#3F7D54` | `#7CBB92` | System operations only |
| `warning` | `#A8712C` | `#D2A35F` | System operations only |
| `error` | `#A84F3F` | `#D98A76` | System operations only |

### 6.2 Usage rules

1. **Evergreen acts, gold celebrates.** All interactive elements use
   evergreen. Gold appears only at emotionally meaningful moments (the
   reveal, an anniversary in the Story) — never on buttons, never as chrome.
2. **Paper is the default.** Screens are ivory/evergreen-night expanses of
   type. Color arrives with meaning; a typical screen is nearly monochrome.
3. **Status colors describe the system, never the relationship**
   (Constitution Part 2 §3.4).
4. **No hardcoded values** — every color enters a component through a token.
5. **Contrast, enforced not promised:** body text ≥ 4.5:1, large text and UI
   ≥ 3:1, in **both** themes — verified automatically by axe in CI on every
   screen, and manually when tokens change. `text.mute` and gold-on-paper
   are the known risk pairs; gold is therefore decorative-only at small sizes.

### 6.3 Dark mode philosophy

Dark mode is not inverted paper — it is **the path at night**: the same
materials after sundown. Green-black instead of gray-black (hue carries the
brand even in darkness), text warmed toward ivory, the gold light slightly
brighter, as light is at night.

---

## 7. Typography

The product is read slowly and at length. Type does most of the brand's work.

| Role | Face | Fallback strategy |
|---|---|---|
| **Display** — the daily question, screen titles, the wordmark | **Fraunces** (SIL OFL; self-hosted, subset woff2) | Bookish system serifs: Iowan Old Style, Palatino, Georgia |
| **UI / body** — interface, entries, answers | **Inter** (SIL OFL; self-hosted, subset woff2) | System sans: -apple-system, Segoe UI, Roboto |

**Philosophy:** the serif is the *voice of the journal* — it appears where
Aveyra speaks with feeling (the question, a milestone). The sans is the
*voice of the tool* — labels, settings, controls. The contrast between them
is the interface's emotional register: when the serif appears, the moment
matters.

**Offline-first rule:** fonts are **self-hosted only** (bundled woff2,
`font-display: swap`) or system stacks. No font is ever fetched from a
third-party host — this is both an offline guarantee and a privacy one.
*Implementation note: the app currently ships the fallback system stacks
(zero network, zero bytes); adopting the self-hosted Fraunces/Inter files is
a sanctioned enhancement and changes no tokens.*

**Scale (unchanged, token-driven):** Label 13px · Body 16px/1.6 ·
Heading 22px · Display clamp(1.6rem–2.4rem). Body measure 60–75ch. All text
scales to 200% without loss.

---

## 8. Design Language

The experience target, in one line: **"opening a private journal of shared
memories."** Every physical property below serves that feeling.

- **Spacing** — 4pt scale (`4/8/12/16/24/32/48/64`). Generous vertical
  rhythm; whitespace is a feature. Single column, mobile-first.
- **Radius** — soft but not toy-like: `8 / 14 / 20 / 28 px`, pill for
  buttons. Cards feel like rounded paper, not bubbles.
- **Shadows** — warm-tinted, low-contrast, never harsh:
  `sm` a resting page, `md` a lifted card, `lg` a held object (modals).
  In dark mode, elevation comes mostly from surface lightness, not shadow.
- **Cards** — `surface` + hairline border + `sm` shadow. Content-first;
  no decorative headers.
- **Buttons** — pill-shaped, 44px minimum height. One evergreen primary per
  screen; everything else quiet. Press = gentle scale (0.98).
- **Inputs** — bordered fields on paper, evergreen focus ring, labels always
  visible, errors linked via `aria-describedby`.
- **Motion** — 150–300ms, soft ease (`cubic-bezier(.2,.7,.2,1)`). The motion
  budget is spent in exactly three places (Constitution Part 2 §8): the
  **reveal** (unhurried, the one exception to the duration cap), **page
  transitions** (soft, directional), and the **save settle**. Everything
  else is instant. `prefers-reduced-motion` collapses all of it to
  opacity/instant — meaning never lives in the animation.

## 9. Experience Direction

- **Today (Discovery)** — one question, set in the display serif, alone on
  paper. Answering feels like writing in a book, not filling a form. The
  pass-the-phone reveal is the product's one ceremonial moment: deliberate
  pace, gold light, announced to screen readers.
- **Story (Remembering)** — a vertical path of kept moments, oldest anchored
  at the relationship's start date. Reading, not scrolling-feed, energy.
  Milestones may carry the gold point; nothing counts, nothing scores.
- **Write (Growing, alone)** — the quietest room: near-empty paper, autosave,
  no sharing chrome. Legitimately the writer's own.
- **The shared space (Growing, together)** — Aveyra frames the couple as
  *walking a path*, never *maintaining a performance*. No activity signals,
  no absence counters, no "your partner hasn't…". Ever.

## 10. Taglines

1. **The journey you keep.**
2. **Discover each other. Keep everything.**
3. **Two paths. One story.**
4. **Where your story stays.**
5. **Still discovering each other.**
6. **Grow the story you share.**
7. **Every day, a little more of each other.**
8. **The quiet record of us.**
9. **Walk far. Remember everything.**
10. **Yours, together.**

Primary recommendation: **"The journey you keep."** — journey (Veya),
keeping (memory), and ownership (privacy) in four words.

## 11. Marketing Description

> **Aveyra** is a private home for your relationship. One thoughtful
> question a day opens conversations you didn't know you were missing; a
> shared timeline keeps the moments worth keeping; a private journal gives
> each of you room to think. Everything lives on your devices — no feeds, no
> streaks, no scores, and nothing to perform. Just the two of you,
> discovering, remembering, and growing together.

## 12. Developer Design Tokens

The single source of truth is `app/globals.css` (CSS custom properties),
mapped to utilities in `tailwind.config.ts`. Components may only consume
tokens. Canonical names:

```
color:  --color-bg / -bg-soft / -surface / -surface-raised / -border
        --color-text / -text-soft / -text-mute / -text-on-accent
        --color-accent / -accent-strong / -accent-soft   (Evergreen; primary)
        --color-gold                                     (Dawn Gold; highlight)
        --color-success / -warning / -error / -focus
type:   --font-display / --font-body
        --text-label / -body / -heading / -display
space:  --space-1 … --space-8         (4pt scale)
radius: --radius-sm / -md / -lg / -xl / -pill
shadow: --shadow-sm / -md / -lg
motion: --ease / --dur-fast / --dur-base
layout: --app-max-width
```

Both themes define every token; dark mode overrides via
`[data-theme='dark']` and `prefers-color-scheme`. Adding a component never
adds a color.

---

*This guide supersedes all Weave-era visual documentation. The Constitution's
design rules (Part 2) remain binding; this guide is their brand-level
expression.*
