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

## Part 2 Sections G–I (received 2026-07-25)

### Section G — Form Controls  🟠 *(two divergences)*
Control set: text field (label-above, never placeholder-as-label), **writing-focused
text area** (auto-grows, generous line height, gentle limit only near the cap),
**OTP input**, dropdown/select (native preferred), switch, checkbox, radio, **date
picker** (calendar + typed, locale-aware). Validation **inline, kind, specific**
("This field can't be empty", never "Error!!"), color+icon+message (never colour
alone), quiet success. States: default/focus/filled/error/disabled/read-only/loading.
**§7 Autosave:** writing inputs (journal, daily answers) **autosave locally as you
type** — never lose a half-written reflection. WCAG 2.2 AA, label always
programmatic. "Do not require the OTP flow to be more than: receive → enter/paste →
done."
*Built vs spec:* our `Input`/`Textarea` match (label-above, error wiring, focus ring).
**Divergences tracked:** (1) **OTP** — Volume 3 wants **segmented single-digit
boxes**; we ship a **single one-time-code field** (a deliberate autofill/paste/
screen-reader choice from the approved auth design). Reconcile in the component pass
or keep-as-is — flag, minor. (2) **Autosave-as-you-type** for Today draft + Write —
not yet (we save on submit; drafts survive within a session but a tab-close loses an
unsubmitted draft). **Enhancement to build.** Also: `Textarea` isn't auto-grow yet;
Switch/Checkbox/Radio/Select/DatePicker aren't all built (add as features need them).

### Section H — Navigation & Information Architecture  🔴 *(scope + naming — Q28)*
Top-level areas (Document 0 §3.1): **Home/Today · Memory Vault · Journal · Date
Planner · Messaging · Settings**; **Emotional Wellness surfaces contextually** within
Home/Today + Journal (not its own destination). Mobile = persistent **bottom bar, ≤5
destinations**; tablet/desktop = side rail with labels; same set/order cross-platform.
Secondary nav = tabs/chips within the content area. Back nav never loses unsaved input
(ties to §G autosave). Wayfinding: titles always visible; active state marked by
**more than colour** (weight/fill/position). Single global **Search** over local
data, offline-capable. Fully keyboard/SR operable; landmarks exposed.
*Built vs spec:*
- **Scope:** we ship a **four-nav (Today · Story · Write · Settings)**; Volume 3's
  target is the **six-area** IA. This is the **Q22 roadmap** — the nav grows to add
  **Date Planner + Messaging** as those features land (each a gated increment). Not a
  new conflict; it's the embedded-product direction already agreed.
- **Naming → Q28 (NEW):** Volume 3 / Document 0 call them **"Memory Vault"** and
  **"Journal"**; the built nav (Volume 2 Q13) uses the warmer **"Story"** and
  **"Write."** Document 0 §9 demands exact terminology; Volume 2 chose album/journal
  warmth. **Author's call** — flagged below.
- Doc-internal tension noted: it lists **6** areas but caps the bottom bar at **5**
  (Settings likely moves to a header/profile, or overflow) — to resolve when we do
  the IA-growth increment.
- **Search** is specced but not yet built.

### Section I — Cards & Content Containers  ✅ *(consistent; gaps to build)*
Content leads, container recedes; recognisable-at-a-glance by icon+layout (not
colour); graceful with missing content. Card types: **Memory** (media-forward when a
photo exists, text-forward when not), **Journal Entry** (excerpt + private/shared
indicator), **Daily Question** (highest prominence on Today; answered/not state
without shame), **Date Plan** (upcoming vs past by layout+label), **Timeline** (nested
milestone→memories, no excessive nesting). Shared anatomy: container · optional media
· header (title/date) · body (excerpt) · optional footer (Ghost/Tertiary actions).
States incl. **skeleton loading** + **warm empty prompts** (never "no data").
Responsive single→multi-column with max readable width. Card-as-target vs per-action
targets kept unambiguous; media has alt text.
*Built vs spec:* our `Card` + `EmptyState` + the Story/Today/Write card usage match
the intent. **Gaps to build:** per-type cards (media-forward Memory card, Daily
Question prominence), **skeleton loading** placeholders, favourite/edit/delete
footers. No conflict — extensions.

### Section K — Iconography & Imagery  ✅ *(consistent; gaps to build)*
App icons are quiet and consistent; **user photos are the emotional focus** and get
room to breathe (never competed with by chrome). Standard action-icon set: Create
(+), Edit (pencil), Delete (trash + destructive styling), Favourite (heart), Search
(magnifier), Back (platform chevron). Icon size scale (compact/standard/large).
Original illustrations for onboarding/empty states; user photos carry alt text (a
caption may double as alt). *Built:* nav icons + Logo exist; **gaps:** the action
icons (create/edit/delete/favourite/search) and custom illustrations aren't built —
we use emoji in `EmptyState` today. Extensions, no conflict.

### Section L — Dialogs, Modals & Overlays  ✅ *(matches our Modal/Dialog + Toast)*
Least-interruptive rule: inline/toast/next-screen before a modal. **Confirmation
dialogs for destructive/irreversible only** (delete memory/journal, leave
relationship) — **never confirm routine reversible actions**. Dialog anatomy:
specific title ("Delete this memory?"), cancel + confirm with **cancel at least
equal prominence**, destructive confirm **never the default-focused button**, no
guilt/urgency copy (Doc 0 §6.2). Focus-trapped, ESC/backdrop dismissible, announced
to AT; toasts don't steal focus and auto-dismiss; bottom sheets swipe-to-dismiss;
100–200ms, reduced-motion. *Built:* `Modal` (with `useFocusTrap`), `Dialog`, `Toast`
already follow this. **Gaps:** bottom-sheet pattern + the "destructive-not-default-
focus" convention to formalise when we add delete flows.

### Section M — Feedback, Loading & Empty States  ✅ *(matches; skeleton gap)*
**Skeleton placeholders** that mirror final layout (not spinners) where layout is
predictable — hidden from screen readers while announcing "loading"; subtle animation
under reduced-motion. **Empty states as invitations, never "no data"**; every list/
area/search result has one; distinguish *filter-empty* ("clear the filter") from
*content-empty*. Quiet success (toast/inline; routine successes don't interrupt).
Save state unambiguous on writing surfaces; offline/sync-pending read as normal, not
broken; **no error discards content**; state changes announced. *Built:* `EmptyState`
(warm), `LoadingState`, `Toast`, `ErrorMessage` match the intent. **Gap:** real
**skeleton placeholders** (we show "One moment…" text) — build with the card work.

### Section N — Motion & Animation  ✅ *(matches our tokens + reduced-motion)*
Short transitions (**100–200ms** most; **<500ms** all) from a small **duration
scale**; motion direction matches IA. **Reduced motion is first-class** — an
equivalent path that preserves meaning (instant/cross-fade), applied immediately
mid-session, not just stripped animation. **User content never animates** (photos/
entries don't bounce/spin — only the chrome framing them moves); skeleton shimmer
becomes static under reduced-motion. *Built:* we use `duration-fast`/`ease-emphasis`
tokens and already honour `prefers-reduced-motion` in `globals.css`; content isn't
animated. **Minor gap:** formalise a named duration-scale token set. Consistent.

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
