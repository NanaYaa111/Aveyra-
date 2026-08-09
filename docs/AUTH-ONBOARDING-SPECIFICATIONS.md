# Auth & Onboarding Screens — Design Specifications

**Foundation:** Q27 Brand Identity (Roses & Plums) + Voice Rules + Constitutional Constraints + WCAG 2.2 AA

---

## Navigation & Flow Map

```
Landing Page
    ↓
Sign In (email entry)
    ↓
Verify (OTP confirmation)
    ↓
Onboarding (create space or join)
    ├→ Create: details → invite
    ├→ Join: enter code/link
    ↓
Today (home dashboard)
```

**Key rule:** These screens are exit-free until account is created. Users can navigate back within onboarding steps, but no "Leave" option until `Today`. Each step has a clear next action.

---

## 1. Landing Page

**Purpose:** Arrival screen before authentication. Introduces Aveyra's value proposition and invites sign-in. Sets emotional tone for the entire experience.

**Emotional target:** Curious · Welcoming · Trustworthy

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│          [Aveyra Logo]              │  48px top
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Hero Illustration: Two         │  Responsive image
│      paths meeting at apex]         │  max 320px wide
│                                     │
├─────────────────────────────────────┤
│ "Discovering, remembering,          │  Display serif
│ and growing together"               │  clamp(1.6rem, 4.5vw, 2rem)
│                                     │  Center-aligned
├─────────────────────────────────────┤
│ "One thoughtful question a day      │  Body text (16px)
│ opens conversations you didn't      │  Soft plum (#555C55 / #B9C2B8)
│ know you were missing. A shared     │  60–75 char measure
│ timeline keeps the moments worth    │  Line-height 1.6
│ keeping. A private journal gives    │
│ each of you room to think.          │
│ Everything stays with you — no      │
│ feeds, no streaks, no scores."      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Sign In Button]                │  Primary (berry-rose)
│     Pill shape, 44px height         │  Full width
│     "Start your journey"            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Privacy Note — Optional]       │  Label text (13px)
│     "All private. Encrypted on      │  Text-mute, centered
│     your devices. No data sales,    │
│     ever."                          │
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Mark + wordmark; responsive (min 24px, max 64px on desktop) |
| **Hero illustration** | — | SVG or WebP; two paths meeting at light; responsive (scale to container, max 320px) |
| **Headline** | — | Fraunces display serif; "Discovering, remembering, and growing together" |
| **Body copy** | — | Inter body; 60–75 character measure; soft plum text |
| **Primary button** | default / hover / focus / pressed / disabled | Berry-rose bg; white text; scale 0.98 on hover; focus ring 3px evergreen |
| **Privacy note** | — | Optional; label size (13px); text-mute color; warm reassurance tone |

### Empty States
- **First arrival:** All elements present. No "empty" state on this screen.

### Loading States
- **Page load:** Display immediately. This is a static screen. No skeleton/loading state.

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile (< 640px) | Single column, full width | 16px horizontal padding; vertical rhythm normal |
| Tablet (640–1024px) | Centered content | max-app-width (readable); larger illustration (to 400px) |
| Desktop (> 1024px) | Centered card | Same as tablet; optional: two-column (60/40) with copy on left, illustration on right |

### Copy Rules

✅ **Do:**
- "Start your journey" — action-forward, warm
- "All private. Encrypted on your devices. No data sales, ever." — honest, concise, active voice
- Use "you" throughout
- Address value, not features ("conversations you didn't know you were missing")

❌ **Don't:**
- "Join us" — avoid "us" (Aveyra is not a participant)
- "Sign up now" — urgency language
- "We're here to help" — "we" is forbidden
- Marketing claims ("seamless", "revolutionary", "amazing")

### Constitutional Constraints
- ✅ Honest framing (no oversold romance)
- ✅ Privacy-first messaging
- ✅ Calm, not urgent
- ❌ No performance language ("keep the spark", "strengthen your bond") — let *them* decide value

### Accessibility
- Logo: `aria-label="Aveyra"`
- Headline: `<h1 id="landing-heading">`
- Button: `aria-label="Sign in to Aveyra"` (if icon-only variant)
- Color contrast: 4.5:1 minimum (verified)
- Focus: visible 3px ring, ≥3:1 contrast
- Motion: reduce to opacity only; no animation on image or text

---

## 2. Sign In Page

**Purpose:** Email entry to initiate passwordless OTP flow. Simple, focused, reassuring.

**Emotional target:** Clear · Calm · Trustworthy

### Layout

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│                                     │
├─────────────────────────────────────┤
│ "Sign in to your space"             │  Display serif
│                                     │  Heading style
│                                     │
│ "We'll send a sign-in code to       │  Body text
│ the email you provide."             │  Soft plum
│                                     │
├─────────────────────────────────────┤
│ [Email Input Field]                 │  Focus ring on input
│ label: "Email"                      │
│ placeholder: "name@example.com"     │
│ type: email                         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Continue Button]               │  Primary; disabled if empty
│     Pill shape, 44px height         │  Full width
│     "Send code"                     │
│     Loading state: "Sending…"       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [Error message — conditional]      │  Text-error, label size
│  "Please enter a valid email"       │  Inline, below input
│                                     │
├─────────────────────────────────────┤
│                                     │
│  "Back to start"                    │  Quiet button
│  (Links to landing page)            │  Gray text, no background
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Small (32–48px) |
| **Heading** | — | Fraunces; "Sign in to your space" or "Let's get started" |
| **Subheading** | — | Body soft plum; reassuring, plain language |
| **Email input** | empty / focus / filled / error | Label above; evergreen focus ring (3px); placeholder soft; error message below linked via `aria-describedby` |
| **Continue button** | default / hover / focus / disabled / loading | Primary berry-rose; disabled if email empty; loading: "Sending…" + optional spinner (50ms fade-in if load > 300ms) |
| **Error message** | — | Text-error color; appears inline below input; linked to input `aria-describedby` |
| **Back link** | — | Text button (quiet variant); "Back to start" or "Not ready?" |

### Empty States
- **No history:** This is a fresh sign-in. No "previous email" suggestion unless explicitly supporting that feature.

### Loading States
- **After button click:** Button shows "Sending…"; input disabled; no spinner overlay
- **Slow network (> 300ms):** Optional: minimal spinner or pulse on button
- **Success:** Brief success message "Check your email" (optional, if UX allows wait); auto-redirect to verify page on success

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile | Full width | 16px padding; natural spacing |
| Tablet/Desktop | Centered | max-app-width; form max 400px |

### Copy Rules

✅ **Do:**
- "Send code" — imperative, clear
- "A sign-in code is on its way" — passive voice, warm
- "Check your email" — direct
- "Not ready yet?" — acknowledge hesitation (warm, not pushy)

❌ **Don't (Fix from current):**
- ~~"We'll send a sign-in code"~~ → "A sign-in code is on its way"
- ~~"We sent you a link"~~ → "A link was sent to your email"
- "Create an account" — say "sign in" (this is passwordless, not traditional signup)
- Urgency: "Quick sign-in!", "Fast setup"

### Constitutional Constraints
- ✅ No urgency framing
- ✅ Passwordless, no password vulnerability language
- ✅ Honest: "This might take a moment" (if applicable)

### Accessibility
- Main heading: `<h1>`
- Form: proper `<form>` semantics; `<label for="email">Email</label>`
- Input: `type="email"` (native browser validation)
- Error: linked via `aria-describedby="email-error"`
- Button: `aria-busy="true"` during submit
- Focus: visible on all interactive elements
- Reduced motion: collapse fade-in spinner to instant or opacity-only

---

## 3. Verify Page (OTP Entry)

**Purpose:** Confirm ownership of email by entering OTP code. Second factor in passwordless flow.

**Emotional target:** Secure · Clear · Brief

### Layout

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│                                     │
├─────────────────────────────────────┤
│ "Confirm your email"                │  Display serif
│ (or "Enter the code")               │  Heading style
│                                     │
│ "A 6-digit code was sent to:"       │  Body text
│ name@example.com                    │  Soft plum; truncated if long
│                                     │
├─────────────────────────────────────┤
│ [6-digit code input]                │  Monospace font
│ ● ● ● ● ● ●                        │  Pill-shaped, wide spacing
│ (or traditional text field)         │  Auto-focus first digit
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Confirm Button]                │  Primary; disabled if incomplete
│     Pill shape, 44px height         │  Full width
│     "Verify code"                   │  or "Confirm"
│     Loading state: "Verifying…"     │
│                                     │
├─────────────────────────────────────┤
│ [Error message — conditional]       │  Text-error, label size
│ "Code incorrect or expired.         │  Inline below input
│  Resend a new one."                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ "Didn't get the code?"              │  Label size; soft plum
│ [Resend button]                     │  Secondary variant; cooldown timer
│ (Cooldown: 30s, then "Resend")      │  or "Resend in 28s"
│                                     │
├─────────────────────────────────────┤
│                                     │
│ "Use a different email"             │  Quiet button; back to sign-in
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Small (32–48px) |
| **Heading** | — | Fraunces; "Confirm your email" or "Enter the code" |
| **Email display** | — | Body soft; show masked email (e.g., "n***@example.com" or full, user choice); 60–75 char measure |
| **Code input** | empty / focused / filled / error | 6 digit inputs (auto-tab to next); monospace font; high contrast; pill container; focus ring on each field |
| **Confirm button** | default / hover / disabled / loading | Primary berry-rose; disabled until 6 digits entered; "Verify code" or "Confirm"; loading state "Verifying…" |
| **Error message** | — | Text-error; appears inline below input; linked via `aria-describedby` |
| **Resend button** | default / loading / cooldown | Secondary variant; text "Resend code"; disabled during 30s cooldown; show countdown "Resend in 28s"; resets to clickable after cooldown |
| **Different email** | — | Quiet button; "Use a different email" or "Wrong email?"; routes back to sign-in |

### Empty States
- **No error:** Just the input prompt. No "waiting" state text.

### Loading States
- **After button click:** Button shows "Verifying…"; input disabled; no overlay
- **Success:** Auto-route to onboarding on successful verification (no confirmation screen)
- **Failure:** Error message appears; input re-enabled; user can retry or resend

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile | Full width | 16px padding; code input size adjusted for thumb-friendly tapping |
| Tablet/Desktop | Centered | max-app-width; form max 400px |

### Copy Rules

✅ **Do:**
- "A 6-digit code was sent to…" — passive voice
- "Code incorrect or expired. Resend a new one." — actionable, calm
- "Resend in 28s" — clear countdown
- "Use a different email" — neutral acknowledgment of change

❌ **Don't (Fix from current):**
- ~~"We sent a 6-digit code"~~ → "A 6-digit code was sent to…"
- ~~"Check your inbox"~~ → implies user hasn't done so; skip if OTP arrived
- "Verify immediately" — no urgency
- "Code expired. Tough luck." — blaming tone

### Constitutional Constraints
- ✅ No pressure ("Act fast!", urgency framing)
- ✅ Calm, patient tone
- ✅ Multiple resend options (no dead-end)

### Accessibility
- Main heading: `<h1>`
- Code inputs: individual `<input type="text" inputMode="numeric" maxlength="1" />` elements, or single `type="text"` with auto-segmentation
- Tab order: auto-advance to next digit on input
- Error: linked via `aria-describedby="code-error"`
- Resend button: `aria-live="polite"` region for cooldown countdown
- Focus: visible 3px ring on each input digit
- Reduced motion: collapse spinner/pulse to instant

---

## 4. Onboarding — Step 1: Your Name

**Purpose:** Collect user's name. First relationship-specific data. Warm, personal entry point.

**Emotional target:** Welcome · Personal · Ready

### Layout

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│     [Step Dots: 1 of 3]             │  Indicator (filled/empty)
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Couple Illustration]           │  Responsive SVG
│     (Two figures meeting)           │  max 200px
│                                     │
├─────────────────────────────────────┤
│ "Let's set up your space"           │  Display serif
│                                     │
│ "Aveyra Flow is a private home      │  Body text
│ for the two of you. First — what    │  Soft plum
│ should we call you?"                │
│                                     │
├─────────────────────────────────────┤
│ [Your name input]                   │  Focus ring
│ label: "Your name"                  │
│ placeholder: "e.g. Alex"            │
│ type: text                          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Continue Button]               │  Primary; disabled if empty
│     "Continue"                      │
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Small (32–48px) |
| **Step dots** | — | 3 dots; first filled (evergreen); others empty (border); no animation |
| **Illustration** | — | SVG couple meeting; responsive; max 200px |
| **Heading** | — | Fraunces; "Let's set up your space" or "Welcome to Aveyra" |
| **Body copy** | — | 60–75 char measure; soft plum; warm tone |
| **Name input** | empty / focus / filled | Label above; evergreen focus ring; placeholder example; autofocus |
| **Continue button** | default / disabled | Primary berry-rose; disabled if input empty; "Continue" |

### Empty States
- **First load:** All fields empty. Placeholder examples provided ("e.g. Alex").

### Loading States
- **No async loading on this step.** Validation is instant (non-empty).

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile | Single column | 16px padding; illustration medium (150px) |
| Tablet/Desktop | Centered | Form max 400px; illustration can be larger (250px) |

### Copy Rules

✅ **Do:**
- "Let's set up your space" — warm, inclusive, acknowledges partnership
- "What should we call you?" — personal, uses "we" in context of *partnership*, not app
- "e.g. Alex" — example, not placeholder
- Simple, direct

❌ **Don't:**
- "Create your Aveyra account" — account-speak; this is about relationship
- "Name yourself" — awkward
- "Set your profile" — admin language
- Conditional speech: "If you prefer nicknames…" — keep simple

### Constitutional Constraints
- ✅ Personal framing (relationship, not system)
- ✅ "We" is *you and your partner*, not the app

### Accessibility
- Heading: `<h1 id="onboarding-heading">`
- Label: `<label for="your-name">Your name</label>`
- Input: `type="text"` + autofocus
- Focus: visible 3px ring
- Step indicator: `role="img" aria-label="Step 1 of 3"`

---

## 5. Onboarding — Step 2: Create or Join

**Purpose:** User decides whether to initiate new space or join existing one. No pressure.

**Emotional target:** Choice · Ownership · Together

### Layout

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│     [Step Dots: 2 of 3]             │
│                                     │
├─────────────────────────────────────┤
│ "Are you starting, or joining?"     │  Display serif
│                                     │
│ "One of you creates your shared     │  Body text
│ space; the other joins with an      │  Soft plum
│ invite."                            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Primary Button]                │  Berry-rose
│     "Start our space"               │  Full width, 44px
│                                     │
│     [Secondary Button]              │  Evergreen outline
│     "Join my partner"               │  Full width, 44px
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Small (32–48px) |
| **Step dots** | — | 3 dots; second filled; others empty |
| **Heading** | — | Fraunces; "Are you starting, or joining?" |
| **Body copy** | — | Soft plum; explains the choice plainly |
| **Start button** | default / hover / focus | Primary berry-rose; full width; "Start our space"; routes to Step 3 (details) |
| **Join button** | default / hover / focus | Secondary (evergreen outline); full width; "Join my partner"; routes to alternate flow (invite code entry) |

### Empty States
- **No empty state.** Both options always available.

### Loading States
- **No loading on this screen.** Navigation is instant.

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile | Single column | 16px padding; buttons full width; 44px height |
| Tablet/Desktop | Centered | max-app-width; buttons can be side-by-side or stacked; maintain 44px height |

### Copy Rules

✅ **Do:**
- "Start our space" — ownership, partnership
- "Join my partner" — personal, direct
- "One of you creates…" — neutral, no pressure

❌ **Don't:**
- "Create an account" — not the framing
- "Link with a partner" — jargony
- "Only one person needs to do this" — implies imbalance

### Constitutional Constraints
- ✅ No implication of hierarchy (who goes first doesn't matter)
- ✅ Neutral framing (both paths are equal)

### Accessibility
- Heading: `<h1>`
- Buttons: clear labels; no nested text
- Focus: visible 3px ring on both
- Touch targets: ≥44×44px

---

## 6. Onboarding — Step 3a: Create Space (Details)

**Purpose:** Collect partner name and relationship start date. Optional; can be added later in Settings.

**Emotional target:** Tender · Reflective · Unhurried

### Layout

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│     [Step Dots: 3 of 3]             │
│                                     │
├─────────────────────────────────────┤
│ "A few gentle details"              │  Display serif
│                                     │
│ "All optional — you can add these   │  Body text
│ later in Settings."                 │  Soft plum
│                                     │
├─────────────────────────────────────┤
│ [Partner's name input]              │  Focus ring
│ label: "Your partner's name"        │
│ placeholder: "e.g. Sam"             │
│                                     │
│ [Start date input]                  │  Date picker
│ label: "When did your story begin?" │
│ type: date                          │
│ hint: "Used to mark anniversaries   │
│ — never a countdown or a score."    │
│                                     │
├─────────────────────────────────────┤
│ [Error message — conditional]       │  Text-error
│ "Something went wrong."             │  If API fails
│                                     │
├─────────────────────────────────────┤
│     [Create Button]                 │  Primary; loading state
│     "Create our space"              │  Full width
│     Loading: "Creating your space…" │
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Small (32–48px) |
| **Step dots** | — | 3 dots; all filled |
| **Heading** | — | Fraunces; "A few gentle details" |
| **Body copy** | — | Soft plum; reassures optional nature |
| **Partner name input** | empty / focus / filled | Label above; evergreen focus ring; placeholder example |
| **Start date input** | empty / focus / filled | Label above; type="date" (native picker); hint text below explaining purpose |
| **Hint text** | — | Label size (13px); text-mute; clarifies this is for anniversaries, not gamification |
| **Create button** | default / hover / disabled / loading | Primary berry-rose; disabled during submit; "Create our space"; loading "Creating your space…" |
| **Error message** | — | Text-error; appears below inputs; linked via `aria-describedby` |

### Empty States
- **Both fields optional.** User can submit empty and add later.
- Copy: "You can add your partner's name and start date later in Settings."

### Loading States
- **After button click:** Button shows "Creating your space…"; inputs disabled; no overlay
- **Success:** Auto-route to Step 4 (invite) after successful space creation

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile | Single column | 16px padding; inputs full width |
| Tablet/Desktop | Centered | max-app-width; form max 400px |

### Copy Rules

✅ **Do:**
- "A few gentle details" — warm, unhurried
- "Used to mark anniversaries — never a countdown or a score." — clear about purpose; preempts gamification concerns
- "You can add these later in Settings." — reduces friction

❌ **Don't:**
- "Complete your profile" — not a profile form
- "Set up your relationship" — setup language; doesn't fit Aveyra's tone
- "Celebrate milestones with automatic reminders" — gamification-adjacent
- "Remember the exact date" — pressure

### Constitutional Constraints
- ✅ Explicitly states purpose (anniversary marking, not gamification)
- ✅ No scorer/evaluator role ("we'll track your journey")
- ✅ Optional; doesn't gate features

### Accessibility
- Heading: `<h1>`
- Labels: `<label for="partner-name">` and `<label for="start-date">`
- Start date input: `type="date"` + native OS picker
- Hint: linked via `aria-describedby="start-date-hint"`
- Error: linked via `aria-describedby="form-error"`
- Focus: visible 3px ring on all inputs
- Reduced motion: collapse any fade-in to instant

---

## 7. Onboarding — Step 3b: Join Space (Invite Code)

**Purpose:** Enter invite code or paste link from partner to join existing space. Alternate to Step 3a.

**Emotional target:** Connected · Simple · Reassured

### Layout

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│                                     │
├─────────────────────────────────────┤
│ "Join your partner's space"         │  Display serif
│                                     │
│ "Paste the invite link or enter     │  Body text
│ the code they shared with you."     │  Soft plum
│                                     │
├─────────────────────────────────────┤
│ [Invite code or link input]         │  Focus ring
│ label: "Invite link or code"        │
│ placeholder: "Paste link or code"   │
│ type: text                          │
│                                     │
├─────────────────────────────────────┤
│ [Error message — conditional]       │  Text-error
│ "Code not found or expired.         │  Inline below input
│  Ask your partner to resend."       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [Continue Button]               │  Primary; disabled if empty
│     "Connect"                       │  or "Join"
│     Loading: "Connecting…"          │  Full width
│                                     │
├─────────────────────────────────────┤
│     [Back Button]                   │  Quiet; secondary variant
│     "Back"                          │  Routes to Step 2
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Small (32–48px) |
| **Heading** | — | Fraunces; "Join your partner's space" |
| **Body copy** | — | Soft plum; explains code/link options |
| **Invite input** | empty / focus / filled / error | Label above; monospace font (for code readability); evergreen focus ring; placeholder shows both options; autofocus |
| **Error message** | — | Text-error; appears inline below input; explains what went wrong (not found/expired) and next step (resend) |
| **Continue button** | default / disabled / loading | Primary berry-rose; disabled if input empty; "Connect" or "Join"; loading "Connecting…" |
| **Back button** | — | Quiet variant (gray text, no bg); routes to Step 2 |

### Empty States
- **No history:** Show placeholder example; no "recently used" codes.

### Loading States
- **After button click:** Button shows "Connecting…"; input disabled; no overlay
- **Success:** Auto-route to Step 4 (invite/linked state) on successful join
- **Failure:** Error message; input re-enabled; user can retry or go back

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile | Single column | 16px padding; input optimized for paste |
| Tablet/Desktop | Centered | max-app-width; form max 400px |

### Copy Rules

✅ **Do:**
- "Join your partner's space" — warm, partnership framing
- "Paste the invite link or enter the code they shared with you." — flexible, clear options
- "Code not found or expired. Ask your partner to resend." — actionable, calm
- "Connect" or "Join" — clear intent

❌ **Don't:**
- "Link with partner" — jargony
- "Authenticate with code" — technical language
- "Invalid code. Try again." — blaming tone
- "You're not authorized" — system error language

### Constitutional Constraints
- ✅ Graceful error handling (no harsh messages)
- ✅ Clear next step (resend, don't blame)
- ✅ No implication of hierarchy or inequality

### Accessibility
- Heading: `<h1>`
- Label: `<label for="invite-code">Invite link or code</label>`
- Input: `type="text"`; autofocus; monospace font for readability
- Error: linked via `aria-describedby="invite-error"`
- Back button: clear label; accessible
- Focus: visible 3px ring on input and buttons
- Reduced motion: no animation on errors

---

## 8. Onboarding — Step 4: Invite or Connected State

**Purpose:** Show invite code to share with partner, OR confirm partner is linked. Final onboarding step before entering app.

**Emotional target:** Celebration (gentle) · Anticipation · Belonging

### Layout

**Variant A: Awaiting Partner (Single-device state)**

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│                                     │
├─────────────────────────────────────┤
│ "Invite your partner"               │  Display serif
│                                     │
├─────────────────────────────────────┤
│ ┌───────────────────────────────────┐│  Card tone: lavender
│ │                                   ││  Border + soft shadow
│ │   [Connected Illustration]        ││  SVG: two figures + light
│ │                                   ││
│ │  "Share this code with your       ││  Body text, center
│ │   partner:"                       ││  Label size
│ │                                   ││
│ │  A3K9M2P                          ││  Display serif, monospace
│ │  (6-char alphanumeric)            ││  Tracking-wide
│ │                                   ││
│ │  [Copy button]                    ││  Secondary; "Copy invite link"
│ │                                   ││  or "Link copied ✓" after copy
│ │                                   ││
│ └───────────────────────────────────┘│
│                                     │
│ "Once they join on their device,   │  Body text; aria-live
│ you'll be connected. You can start  │  region: role="status"
│ now — your partner will catch up    │  Polite tone; managing expectation
│ when they join."                    │
│                                     │
├─────────────────────────────────────┤
│     [Continue to Aveyra Flow]       │  Primary button
│     "Continue to Aveyra Flow"       │  Full width
│     Loading: "Taking you in…"       │
│                                     │
└─────────────────────────────────────┘
```

**Variant B: Partner Linked (Two-device state)**

```
┌─────────────────────────────────────┐
│         [Aveyra Logo]               │  32px top
│                                     │
├─────────────────────────────────────┤
│ "You're connected"                  │  Display serif
│                                     │
├─────────────────────────────────────┤
│ ┌───────────────────────────────────┐│  Card tone: success/tinted
│ │                                   ││  Border + soft shadow
│ │   [Connected Illustration]        ││  SVG: two figures joined
│ │                                   ││
│ │   ✓ (or checkmark icon)           ││  Evergreen or success color
│ │                                   ││
│ └───────────────────────────────────┘│
│                                     │
│ "Your partner has joined.          │  Body text; aria-live
│ Everything you keep here is just    │  region: role="status"
│ for the two of you."                │  Celebratory but measured
│                                     │
├─────────────────────────────────────┤
│     [Continue to Aveyra Flow]       │  Primary button
│     "Continue to Aveyra Flow"       │  Full width
│     Loading: "Taking you in…"       │
│                                     │
└─────────────────────────────────────┘
```

### Components

| Element | State | Content / Behavior |
|---------|-------|-------------------|
| **Logo** | — | Small (32–48px) |
| **Heading** | — | Fraunces; "Invite your partner" (single) or "You're connected" (linked) |
| **Card (awaiting)** | — | Lavender tone; border + soft shadow; centered illustration; code in display serif monospace |
| **Card (linked)** | — | Success/tinted tone; checkmark icon or celebratory illustration |
| **Code display (awaiting)** | — | 6-char alphanumeric; display serif; tracking-wide (letter-spaced); copy button shows "Copy invite link" then "Copied ✓" for 2 seconds |
| **Copy button (awaiting)** | default / hover / focus / success | Secondary variant; "Copy invite link"; on success, text changes to "Copied ✓" (no icon change needed) |
| **Status message** | — | Role="status" aria-live="polite"; explains next step (waiting for partner or now connected); warm, patient tone |
| **Continue button** | default / loading | Primary berry-rose; "Continue to Aveyra Flow"; on click, "Taking you in…"; auto-routes to `/today` on success |

### Empty States
- **No empty state on this screen.** Code is always present (awaiting) or partner linked (connected).

### Loading States
- **Continue button:** Shows "Taking you in…" during submit; button disabled; no overlay
- **Success:** Auto-route to `/today`

### Responsive Behavior

| Breakpoint | Layout | Changes |
|---|---|---|
| Mobile | Single column | 16px padding; card full width; code size adjustable |
| Tablet/Desktop | Centered | max-app-width; card max 450px; code can be larger |

### Copy Rules

**Awaiting partner:**

✅ **Do:**
- "Share this code with your partner" — clear action
- "Once they join on their device, you'll be connected." — manages expectation
- "You can start now — your partner will catch up when they join." — encourages action; no waiting pressure

❌ **Don't:**
- "Waiting for your partner…" — frames as absence
- "Still waiting?" — impatient tone
- "Your partner hasn't joined yet." — deficit framing (Constitutional §2.3)

**Partner linked:**

✅ **Do:**
- "You're connected" — simple celebration
- "Everything you keep here is just for the two of you." — privacy reassurance
- Warm but measured (not over-celebratory)

❌ **Don't:**
- "You're linked!" — emoji-heavy or exclamatory
- "Welcome to your relationship dashboard" — clinical
- "Your partner is here!" — frames partner as feature

### Constitutional Constraints
- ✅ No deficit framing ("Your partner hasn't joined yet")
- ✅ No absence counters ("Waiting since…")
- ✅ Measured celebration (linked is good, but not momentous)
- ✅ No implication of hierarchy or obligation

### Accessibility
- Heading: `<h1>`
- Code display: `data-testid="invite-code"` (for testing); not a button; use `<p>` or `<span>`
- Copy button: `aria-label="Copy invite link to clipboard"` or clear label
- Status message: `role="status" aria-live="polite"` + `aria-label="Step 4 of 4"`
- Continue button: `aria-busy="true"` during submit
- Focus: visible 3px ring on copy button and continue button
- Reduced motion: collapse button state change to instant; no animation on illustration

---

## 9. General Auth/Onboarding Guidelines

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column; 16px horizontal padding; full-width inputs/buttons |
| Tablet | 640–1024px | Centered content; max-app-width ~600px; balanced whitespace |
| Desktop | > 1024px | Centered card; max-app-width ~600px; optional two-column layouts (hero + form) |

### Loading & Error States

**Loading:**
- Buttons: show text label change (e.g., "Sending…", "Connecting…")
- Spinners: only if load > 300ms; minimal 50ms fade-in
- Never disable entire form; only disable submit button

**Error:**
- Inline, below the input field
- Linked via `aria-describedby`
- Text-error color (#A84F3F light, #D98A76 dark)
- Actionable: "Code incorrect or expired. Resend a new one."
- Never blame user ("You entered it wrong")

**Success:**
- Quiet toast or inline message (no bells/celebration)
- Optional: auto-route on success (e.g., verify → onboarding)
- If waiting screen, show status message with aria-live="polite"

### Accessibility (WCAG 2.2 AA)

**Color & Contrast:**
- All text ≥4.5:1 on body text; ≥3:1 on UI elements
- Never color alone for signal; pair with icon + text
- Error text: text-error (#A84F3F / #D98A76) verified at 4.5:1

**Keyboard & Focus:**
- All interactive elements: visible 3px focus ring (evergreen or focus color)
- Focus ring contrast ≥3:1 against background
- Tab order: logical (left-to-right, top-to-bottom)
- No keyboard traps
- ESC dismisses modals/dialogs

**Screen Reader:**
- Landmarks: `<main>` wrapping auth forms
- Headings: proper `<h1>` → `<h2>` hierarchy
- Form labels: `<label for="id">` linked to inputs
- Errors: `aria-describedby="error-id"` on input
- Live regions: `aria-live="polite"` + `role="status"` for step indicators, status messages, cooldown timers
- Images/icons: `alt` text or `aria-label`
- Lists of steps: `<ol>` + `<li>` if semantic; otherwise `role="img" aria-label="Step 1 of 3"`

**Mobile & Touch:**
- Touch targets: ≥44×44px (buttons, inputs, clickable areas)
- Spacing: ≥8px between touch targets (avoid fat-finger errors)
- Input size: readable text on small screens (≥16px base)

**Reduced Motion:**
- `prefers-reduced-motion: reduce` collapses all transitions/animations
- Buttons: remove scale on hover (keep color change only)
- Loaders: fade-in/out instead of spin or pulse
- Meaning never lives in motion (all content accessible without animation)

### Motion & Animation Budget

**Duration:**
- Fast: 100ms
- Base: 150–200ms
- Reveal: up to 500ms (not used in auth flows)

**Easing:** soft ease `cubic-bezier(0.2, 0.7, 0.2, 1)`

**Auth/Onboarding motion:**
- ✅ Page transitions: soft fade/slide (150–200ms) when routing between steps
- ✅ Button hover: gentle scale (0.98) on primary buttons (100ms)
- ✅ Focus: instant; ring appears immediately
- ❌ Everything else: instant (no spinners, no pulsing borders, no fade-in text)

**Exception:** If user configures `prefers-reduced-motion: reduce`, all animation collapses to instant or opacity-only (no movement).

### Voice & Tone Rules

**Throughout all auth/onboarding screens:**

| Context | Tone | Example |
|---------|------|---------|
| **Friendly intro** | Warm, inviting, calm | "Discovering, remembering, and growing together." |
| **Instructions** | Plain, direct, unhurried | "A 6-digit code was sent to…" |
| **Errors** | Honest, actionable, no blame | "Code incorrect or expired. Resend a new one." |
| **Optional fields** | Reassuring, flexible | "All optional — you can add these later in Settings." |
| **Celebration** | Measured, warm, brief | "You're connected." (not "Yay! You're hooked up!") |
| **Next steps** | Encouraging, no pressure | "You can start now — your partner will catch up when they join." |

**Permanent rules:**
- ✅ Address user as "you"
- ✅ **Aveyra never says "we"** (exception: "we" in context of the couple, not the app)
- ✅ Passive voice for system actions ("A code was sent…" not "We sent…")
- ✅ Sentence case everywhere (incl. buttons)
- ✅ Front-load meaning
- ✅ One idea per sentence
- ❌ No system jargon (sync, cache, query, authenticate)
- ❌ No marketing words (amazing, seamless, revolutionary)
- ❌ No presumptive emotional language ("Strengthen your bond!")
- ❌ No deficit/absence language ("Your partner hasn't…")

### Security & Privacy Messaging

**Establish trust early:**
- Landing page: "All private. Encrypted on your devices. No data sales, ever."
- Verify page: Consider adding privacy note if needed: "We never see your codes. Encryption starts here."
- Onboarding: Optional reassurance on settings step.

**Avoid:**
- Overpromising ("Completely unhackable")
- Technical jargon ("AES-256 encryption")
- Fear language ("Protect from hackers")
- Selling privacy as feature ("Only we do this!")

---

## 10. Color, Typography, Motion Tokens

### Color Tokens (Q27 Resolved: Roses & Plums)

**Light mode:**
- `--color-bg: #faf1ee` (Blush background)
- `--color-surface: #fffef9` (Surface white)
- `--color-text: #2c1f29` (Deep plum)
- `--color-text-soft: #555c55` (Soft plum)
- `--color-text-mute: #646b63` (Muted text; 4.5:1)
- `--color-accent: #a83f5b` (Berry-rose; primary actions)
- `--color-accent-soft: #e8d5db` (Rose-accent soft fill)
- `--color-border: #ded9cb` (Hairline)
- `--color-error: #a84f3f` (Soft red)

**Dark mode:**
- `--color-bg: #1a1016` (Plum-black)
- `--color-surface: #1a2420` (Dark surface)
- `--color-text: #e59ab0` (Lifted rose)
- `--color-text-soft: #b9c2b8` (Soft lifted)
- `--color-text-mute: #94a096` (Muted; 4.5:1)
- `--color-accent: #e59ab0` (Lifted rose; actions)
- `--color-accent-soft: rgba(229, 154, 176, 0.14)` (Rose soft fill)
- `--color-border: #31413a` (Hairline)
- `--color-error: #d98a76` (Soft red)

### Typography Tokens

- `--font-display: Fraunces, serif` (Titles, headings, questions)
- `--font-body: Inter, sans-serif` (Body, UI, labels)
- `--text-label: 13px, font-weight 400, line-height 1.4` (Labels, hints)
- `--text-body: 16px, font-weight 400, line-height 1.6` (Body text)
- `--text-heading: 22px, font-weight 600, line-height 1.4` (Headings)
- `--text-display: clamp(1.6rem, 4.5vw, 2rem)` (Large display serif)

### Spacing Tokens (4px base scale)

- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-5: 24px`
- `--space-6: 32px`

### Motion Tokens

- `--dur-fast: 100ms`
- `--dur-base: 150ms`
- `--ease: cubic-bezier(0.2, 0.7, 0.2, 1)`

---

## 11. Dev Stub & Testing Notes

### Dev-Only Features (when `!isSupabaseConfigured()`)

- **Verify page:** Show dev OTP code in a card (`tone="coral"`)
  - Example: "Dev mode: Your code is 123456"
  - Allow manual entry or direct advancement

- **Onboarding page:** Show "Simulate partner joined" button on invite step
  - Allows preview of linked state without second device
  - Card tone="coral"; quiet button; label explains dev-only

### Testing Checklist

- [ ] Email validation (sign-in accepts valid emails only)
- [ ] OTP verification (6-digit entry, resend cooldown, expiry)
- [ ] Invite code generation and validation
- [ ] Step navigation (forward + back buttons work)
- [ ] Error handling (invalid email, wrong code, expired code)
- [ ] Loading states (buttons show text, disabled during submit)
- [ ] Accessibility (focus ring visible, keyboard nav, screen reader)
- [ ] Responsive (mobile, tablet, desktop layouts)
- [ ] Motion (reduced-motion honored)
- [ ] Color contrast (4.5:1 verified in light + dark modes)
- [ ] Copy review (no "we", no urgency, warm tone)

---

**Ready to design and build the auth/onboarding UI.** Foundation is locked: Q27 palette, typography rules, voice/tone standards, constitutional constraints, and accessibility requirements all provided.

