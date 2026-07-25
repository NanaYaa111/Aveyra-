# Volume 3 — Design System & UX Specification (recorded)

**Received:** 2026-07-25 · **Status:** recorded; one material reconciliation OPEN
(brand palette — see Q27). Covers **Part 1 Sections A–E** (Design Philosophy, Brand
Identity, Colour, Typography, Spacing & Layout) + the **Accessibility Contrast
Standard**, and **Part 2 Section F** (Buttons). Volume 3 defines *how Aveyra should
feel*; it must preserve every Volume 1–2 decision and the permanent prohibitions.

> Guardian summary: **Volume 3 overwhelmingly affirms what M1 already built** — calm,
> content-first, reflection-over-engagement, no dark patterns, WCAG 2.2 AA, warm
> ivory backgrounds, slate text, bespoke restrained components. The **only material
> conflict** is the *specific brand hues* in §C: Volume 3 names **Primary Blue +
> Soft Coral**, whereas the built-and-approved "First Light on the Path" system uses
> **Evergreen-primary + Dawn Gold**. Flagged as **Q27** — not silently repainted.

---

## Section A — Design Philosophy
Reflection over consumption · calm technology (tech recedes, the relationship is the
focus) · human-centred ("does this genuinely help two people understand each other?")
· privacy by design (always clear what's shared/private/who-sees) · emotional safety
(no shame/guilt/manipulation/comparison/competition) · accessibility first ·
consistency. **§11 Design Ethics — prohibited** (unless a future amendment allows):
infinite scroll for session-length, dark patterns, misleading consent, hidden
costs, artificial urgency, **engagement streaks**, variable-reward dependency loops,
intrusive ads, selling data, commercial behavioural profiling. Simplicity test:
every screen answers *where am I / what can I do / what next*. **Fully consistent
with our Part 2 §1.2 prohibitions and Q23.**

## Section B — Brand Identity
Aveyra = a private relationship companion (NOT social network, dating, productivity,
messaging replacement, or AI relationship coach). Personality: compassionate, calm,
trustworthy, thoughtful, respectful, gentle, dependable, optimistic. Brand promise:
respect privacy, protect memories, encourage authentic communication, never
manipulate for engagement, relationships-before-algorithms, trust-above-commercial.
Voice: warm, clear, respectful, honest, calm, empathetic. Tone modes: celebratory
(milestones), reflective (Timeline/Memories/Journal), supportive (errors), informative
(onboarding/settings). **Matches our brand notes + user-research chapter.**

## Section C — Colour System  🔴 *(hue conflict — Q27)*
Emotional roles: **Trust → primary**, **Warmth → memories/highlights**, **Growth →
success/milestones**, **Reflection → warm neutrals**, **Celebration → muted gold**.
Named palette: **Primary Blue** (buttons/nav/links), **Soft Coral** (emotional
highlights, shared memories), **Sage Green** (success, milestones), **Warm Ivory**
(backgrounds), **Deep Slate** (text). Semantics: success = calm green, warning =
warm amber, error = soft red, info = calm blue. Light theme avoids large pure-white;
dark theme uses deep charcoal/slate, never pure black. **Colour is never the sole
signal.** Emotional consistency per feature (Timeline nostalgic, Journal quiet, etc.).

**Built vs spec:**
| Role | Volume 3 §C | Built ("First Light") | Match? |
|---|---|---|---|
| Background | Warm Ivory | Paper `#f7f5ef` | ✅ |
| Text | Deep Slate | `#1f2521` | ✅ |
| **Primary/accent** | **Primary Blue** | **Evergreen `#2e6b5e`** | ❌ (Q27) |
| Warmth accent | **Soft Coral** | **Dawn Gold `#b9822f`** | ❌ (Q27) |
| Success | Sage Green | green `#3f7d54` | ✅ (role) |
| Warning | warm amber | `#a8712c` | ✅ |
| Error | soft red | `#a84f3f` | ✅ |
| Dark theme | charcoal/slate, not black | `#101815` slate | ✅ |
| Colour-never-alone | required | honoured | ✅ |

## Accessibility Contrast Standard (drop-in rule) ✅ *(adopt as system standard)*
- **Normal text ≥ 4.5:1** against its background.
- **Large text/headings ≥ 3:1**.
- **Non-text UI that conveys meaning** (input borders, focus rings, meaningful
  icons, structural dividers, status chips) **≥ 3:1** against adjacent colour.
- Interactive/button text ≥ 4.5:1; disabled/decorative may be lower only when not
  required for understanding.
- **Colour is never the only mechanism**; every state pairs colour + icon + text.
- Every light/dark token pair must be tested to these thresholds.
- Soft accent hues that fail small-text contrast are **backgrounds/fills/decoration
  only**, never essential labels or body copy.

*Built status:* we target WCAG 2.2 AA and `--text-mute` is already tuned to 4.5:1 on
Paper. **Audit item:** verify **non-text 3:1** for input borders + focus in both
themes (focus ring = accent, high-contrast ✓; decorative card borders are soft and
may sit below 3:1 — acceptable as decoration, but **input/field borders should hit
3:1**). Tracked for the token pass.

## Section D — Typography ✅ *(align opportunistically)*
Clean modern sans-serif — **Inter** (or platform SF Pro / Roboto). Full scale:
Display · H1–H4 · Body Large/Standard/Small · Caption · Labels · Button · Overline ·
Helper. Hierarchy via size/weight/spacing (not colour). Comfortable line spacing,
moderate line length, generous whitespace for long-form Journal reading; premium-
notebook writing feel. Responsive + OS dynamic-text scaling (no clipping/overlap),
RTL-ready, Unicode. Emphasis: bold/italic only; underline = links.
*Built status:* we ship a **smaller token scale** (`--text-display/heading/body/
label`) with system fonts. **Divergence (minor):** adopt Inter + expand the scale
(add Body Large/Small, Caption, Overline, Helper) in the token pass. No conflict —
an extension.

## Section E — Spacing & Layout ✅ *(consistent)*
Content-first, whitespace-as-structure, base spacing unit + tokens (XS→Section),
responsive grid (mobile single-column → tablet → desktop max readable width),
consistent margins/padding/containers, left-aligned body, **safe areas** (notches/
gesture bars/status bars), comfortable touch targets with spacing between controls,
destructive separated from non-destructive. **Matches our Tailwind token layout,
`max-app` width, `pb-safe`, and 44px targets.**

## Part 2 Section F — Buttons  🟠 *(taxonomy gaps)*
Five categories: **Primary** (one per screen section), **Secondary**, **Tertiary/
Text**, **Ghost** (in cards/overlays), **Destructive** (semantic colour, never the
default, confirmation required). Variants: filled/outlined/text/icon+text/icon-only.
Sizes **Small / Medium (default) / Large**; **≥ 44×44** touch target. States:
default/hover/focus/pressed/**disabled**/**loading** (prevents duplicate submit,
preserves dimensions)/optional success. Labels start with an action verb, sentence
case, concise ("Save Memory", not "OK/Submit"). Confirmation required for
delete/account/leave/logout; routine actions execute immediately. Motion 100–200ms,
respects reduced-motion. Analytics id only if operational telemetry is enabled (Q17).
*Built status:* our `Button` has **4 variants** (primary/secondary/quiet/danger) and
**2 sizes** (md/sm), disabled state, and busy-via-disabled. **Divergences (minor):**
add a **Large** size, distinguish **Ghost** from `quiet`, add an explicit **loading**
state (spinner + fixed dimensions + no double-submit). Confirmation-before-destroy is
already the pattern (Dialog). Tracked for the component pass.

---

## GUARDIAN CONFLICT REGISTER

### Q27 — Brand palette: Volume 3 "Blue + Coral" vs built "Evergreen + Gold"  🔴 OPEN
Volume 3 §C names **Primary Blue** (trust) + **Soft Coral** (warmth), reserving green
for **success only**. The built, approved, tested **"First Light on the Path"** system
uses **Evergreen** as the primary accent + **Dawn Gold** as the warmth accent, with a
separate green for success. The *emotional intent, ivory background, slate text, and
semantic warning/error all match* — only the **primary hue (blue vs green)** and the
**warmth accent (coral vs gold)** differ.

Trade-offs:
- **Keep Evergreen (First Light):** already built/tested/shipped; green reads calm,
  natural, "the journey/growth" — on-brand. *Cost:* primary and success are both
  green (needs a clear tonal separation so "success" isn't confused with "primary").
- **Adopt Volume 3 (Blue + Coral):** cleanly separates trust-primary (blue) from
  growth-success (green); coral adds explicit warmth. It's a **token re-skin** —
  contained because everything is CSS-variable tokens (change `globals.css`, no
  component rewrites) — but it changes the whole app's look and needs a fresh
  contrast pass in both themes.

**This is a brand-identity decision — the author's call.** Not repainted unilaterally;
the app stays on First Light until decided. Everything else in Volume 3 is adopted as
the system standard (contrast thresholds now; type-scale + button-taxonomy gaps in a
token/component pass).

### Non-conflicts (adopted / affirmed)
Philosophy, ethics/prohibitions, brand voice/tone, spacing/layout, safe areas, WCAG
2.2 AA, colour-never-alone, content-first, no-streaks/no-dark-patterns — all
consistent with Volumes 1–2 and the built app.
