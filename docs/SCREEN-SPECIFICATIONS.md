# Screen Specifications — All 10 Aveyra Features

**Version 1.0 · Detailed UI layout, components, states, and content for every screen.**

Follows the design system (`/docs/UI-REDESIGN-GUIDE.md`). All copy adheres to Constitution Part 2 §5 (no "we", plain language, honest tone).

---

## Table of Contents

1. [Today](#1-today-home-dashboard)
2. [Check-in](#2-check-in-emotional-wellness)
3. [Messages](#3-messages-private-messaging)
4. [Dates](#4-dates-date-planner)
5. [Notes](#5-notes-three-note-kinds)
6. [Scripture](#6-scripture-spiritual-ritual)
7. [Story](#7-story-memory-vault)
8. [Vault](#8-vault-view-once-media)
9. [Write](#9-write-private-journal)
10. [Settings](#10-settings-account--relationship)

---

## 1. Today — Home Dashboard

**Purpose:** Daily question + overview + quick access to all features.

**Layout (mobile):**
```
┌─────────────────────┐
│  [Aveyra] Settings  │  ← Header (sticky)
├─────────────────────┤
│                     │
│  "Good morning,     │  ← Greeting (time-aware)
│   [Name]"           │
│                     │
├─────────────────────┤
│                     │
│  TODAY'S QUESTION   │  ← Display serif, center
│  (in Fraunces)      │
│                     │
│  "What's one...?"   │
│                     │
│  [Your answer]      │  ← If not answered: empty state CTA
│  (or empty)         │
│                     │
│  [Reveal when both] │  ← If both answered: button
│                     │
├─────────────────────┤
│                     │
│  RECENT SHARED      │  ← Chronological
│  ACTIVITY           │
│                     │
│  • Answered Q       │  ← Card format
│  • Saved memory     │
│  • Partner's note   │
│                     │
├─────────────────────┤
│  QUICK ACTIONS      │  ← Four equally-spaced buttons
│  (grid 2x2)         │
│                     │
│  [Add Memory]       │
│  [Write]            │
│  [Check-in]         │
│  [Browse Questions] │
│                     │
├─────────────────────┤
│  Relationship       │  ← Small badge/stat card (no streaks)
│  Started [date]     │
│  [# answers] Total  │
│  [# memories] Kept  │
├─────────────────────┤
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Logo + Settings link | Static | "Aveyra" logo, settings gear icon |
| Greeting | Text (body serif style) | Dynamic | Time-aware ("Good morning", "Good afternoon", "Good evening", [Name]) |
| Daily Question | Heading (display serif) + Textarea | Answered / Empty | Question text (display serif); user's answer (if answered); or empty-state CTA "Answer today's question" |
| Question reveal | Button (primary rose-accent) | Waiting / Ready / Revealed | "Waiting for [partner name]" (disabled) → "See their answer" (enabled) → "Their answer:" + text (after click) |
| Recent activity | Card list | Scrollable | Each card: icon + action type + timestamp (e.g., "You answered at 9:42am") |
| Quick actions | Button grid (2x2) | Default | Four primary buttons (rose-accent) linking to: Add Memory, Write, Check-in, Browse Questions |
| Relationship badge | Card (surface + border) | Static | "Your journey" heading + "Started [date]" + "[#] answers" + "[#] memories" (no streaks, no scores) |

### Empty States

**No question yet:**
- Icon: 📅
- Title: "Come back tomorrow"
- Body: "A new question arrives each day."
- CTA: Browse past questions → `/story` or search

**Haven't answered today:**
- Icon: ✍️
- Title: "Today's question is waiting"
- Body: "A thoughtful question for just the two of you."
- CTA: "Answer" (focus on textarea)

**Partner hasn't answered:**
- Icon: 🤝
- Title: "Waiting for [partner name]"
- Body: "Once you both answer, you can reveal their response."
- CTA: None (disabled state, no "they haven't…" messaging)

**Relationship not set up:**
- Redirect to `/onboarding`

### Loading State

- Skeleton card for question area
- Skeleton for recent activity list
- Skeleton for relationship badge
- No spinner; subtle animation

### Responsive

- Mobile: single column, full-width cards
- Tablet (768px+): question area larger, activity sidebar on right (optional)
- Desktop (1024px+): two-column layout with left column (question + recent) and right sidebar (quick actions + badge)

### Copy Rules

- Greeting: "Good morning, [name]" (never "Hello")
- Question reveal: "See their answer" (not "Reveal")
- Empty state: never "You haven't answered" (never deficit framing)
- Quick action buttons: verb+object ("Add Memory", "Write", "Check-in", "Browse Questions")

---

## 2. Check-in — Emotional Wellness

**Purpose:** Quick mood check-in; optional notes.

**Layout (mobile):**
```
┌─────────────────────┐
│  < [Back]           │  ← Collapse to Today
├─────────────────────┤
│                     │
│  How are you        │  ← Display serif heading
│  feeling right now? │
│                     │
├─────────────────────┤
│                     │
│  [😊] [😌] [😕]     │  ← Feeling buttons (emoji + label)
│  Happy  Calm  Stressed
│                     │
│  [😴] [😢] [😤]     │
│  Tired  Sad  Frustrated
│                     │
├─────────────────────┤
│                     │
│  Optional: Add a    │  ← Text (soft color)
│  quick note         │
│                     │
│  [Textarea]         │  ← Autosave as you type
│  "What's on your... │
│  (max 280 chars)    │
│                     │
├─────────────────────┤
│  [Share with        │  ← Primary button (rose-accent)
│  [partner name]]    │
│  OR                 │
│  [Just for me]      │  ← Quiet button
│                     │
├─────────────────────┤
│  ✓ Shared           │  ← After submit, shown briefly
│  Your check-in...   │
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Back" or back chevron |
| Prompt | Heading (display serif) | Static | "How are you feeling right now?" |
| Feeling buttons | Button grid (2x3) | Default / Selected | 6 moods: Happy, Calm, Stressed, Tired, Sad, Frustrated. Selected = rose-accent fill + checkmark |
| Note textarea | Textarea | Autosave / Empty / Filled | Placeholder: "What's on your mind?" (optional) · Autosaves locally as you type · Shows char count on hover (max 280) |
| Share action | Two buttons (stacked) | Default | Primary: "Share with [partner name]" (only if note present or mood selected) · Quiet: "Just for me" |
| Confirmation | Toast + inline message | Success | "Your check-in shared with [partner name]" · Auto-dismiss after 3s · OR show their last check-in if they also checked in today |

### Empty States

**Choosing mood:**
- Show all 6 moods clearly
- Tap to select

**Optional note:**
- Placeholder text guides without mandating

**No previous check-in:**
- First time? Show friendly message: "You haven't checked in yet today."

### Loading State

- Button disabled while submitting
- Textarea locked briefly

### Responsive

- Mobile: full-width, moods stack 2x3
- Tablet: moods in single row (6 across) or 3x2 if space allows
- Desktop: centered card, max-width 500px

### Copy Rules

- Prompt: "How are you feeling right now?" (never "Tell us your mood")
- Moods: Simple, one-word labels (Happy, Calm, Stressed, etc.)
- CTA: "Share with [partner name]" (not "Send" or "Tell them")
- Confirmation: "Your check-in shared" (not "Sent successfully")

---

## 3. Messages — Private Messaging

**Purpose:** Async messaging between partners.

**Layout (mobile):**
```
┌─────────────────────┐
│  < [Back]  Messages │  ← Collapse to Today
├─────────────────────┤
│                     │
│  [Thread timeline]  │
│  Newest at bottom   │
│                     │
│  ┌─────────────┐    │
│  │ Yesterday   │    │  ← Date separator
│  │ 3:45 PM     │    │
│  │ You: "Hey"  │    │  ← Message bubble (tinted bg)
│  └─────────────┘    │
│                     │
│  ┌─────────────┐    │
│  │ [Partner]:  │    │  ← Opposite side, different color
│  │ "Hi! How    │    │
│  │ are you?"   │    │
│  │ 4:22 PM     │    │
│  └─────────────┘    │
│                     │
├─────────────────────┤
│  QUICK PINGS        │  ← Row of emoji/text options
│  [👋] [💕] [🤔]     │
│  [😄] [✨] [🙏]     │
│                     │
├─────────────────────┤
│  [Composer]         │
│  "Type a message..."│  ← Textarea + send button
│  [Send button]      │
│                     │
├─────────────────────┤
│  It's quiet in here │  ← Empty state
│  Send the first     │
│  message.           │
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Messages" |
| Thread | Message list (scrollable) | Newest at bottom | Each message: sender name · text · timestamp · (no read receipts, no "typing" indicator) |
| Message bubble | Card (sender on left, partner on right) | You / Partner | Different colors: you = soft rose tint; partner = soft blue tint; or subtle differences |
| Date separator | Thin line + date | Grouped by date | "Yesterday" / "Dec 5" / etc. |
| Quick pings | Button grid (emoji + label) | Tappable | 6 common pings (wave, heart, thinking, smile, sparkle, thanks) · Single-tap send · No confirmation |
| Composer | Textarea + Send button | Default / Sending / Sent | Textarea grows as you type (max ~3 lines) · Send button (rose-accent) · Disabled if empty |
| Empty state | Card center-screen | Waiting | "It's quiet in here. Send the first message." |

### Empty States

**No messages yet:**
- Icon: 💬
- Title: "It's quiet in here"
- Body: "Start a conversation anytime."
- CTA: Focus on composer

**Partner hasn't replied:**
- No "waiting" message (never deficit framing)
- Composer ready for next message

### Loading State

- Send button shows "Sending…" briefly
- Message appears in thread immediately (optimistic update)

### Responsive

- Mobile: full-width thread, composer at bottom
- Tablet/Desktop: centered column, max-width 600px

### Copy Rules

- Composer placeholder: "Type a message…" (not "Send a message to…")
- Empty state: "It's quiet in here" (not "No messages")
- Never: "They haven't replied" or timestamps on pings (just emoji + instant send)

---

## 4. Dates — Date Planner

**Purpose:** Shared date ideas; track status (coming up / ideas / done).

**Layout (mobile):**
```
┌─────────────────────┐
│  < [Back]           │
├─────────────────────┤
│  Dates              │  ← Display serif heading
│  Things to do       │
│  together.          │
│                     │
├─────────────────────┤
│                     │
│  ADD A DATE         │  ← Form card
│  [Title input]      │
│  [Date picker]      │
│  [+ Add button]     │
│                     │
├─────────────────────┤
│                     │
│  COMING UP          │  ← Section heading (bronze text)
│  (2 dates)          │
│                     │
│  [☐] Coffee this... │  ← Checkbox + date
│      Jan 12         │  ← Light text (muted color)
│      [✓] [delete]   │  ← Action buttons (hover/reveal)
│                     │
│  [☐] Dinner date    │
│      Jan 15         │
│      [✓] [delete]   │
│                     │
├─────────────────────┤
│                     │
│  IDEAS              │  ← No date set
│  (3 ideas)          │
│                     │
│  [☐] Take a walk    │
│      [✓] [delete]   │
│                     │
│  [☐] Movie night    │
│      [✓] [delete]   │
│                     │
│  [☐] Hike           │
│      [✓] [delete]   │
│                     │
├─────────────────────┤
│                     │
│  DONE TOGETHER      │  ← Completed dates
│  (7 completed)      │
│                     │
│  [✓] Brunch        │  ← Strikethrough text
│      Jan 8          │
│      [delete]       │
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Back" |
| Heading | Display serif | Static | "Dates" + subtitle "Things to do together." |
| Add form | Input + date picker + button | Default | Title input (placeholder: "A walk, a film...") · Date input (optional) · Button: "[+] Add" (disabled if title empty) |
| Coming up section | Heading + card list | Grouped by date | "COMING UP" (bronze text) · Each row: checkbox + title + date (muted text) · Hover/reveal: check button (mark done) + delete button |
| Ideas section | Heading + card list | No dates | "IDEAS" (bronze text) · Each row: checkbox + title · Hover/reveal: check button + delete button |
| Done section | Heading + card list | Completed | "DONE TOGETHER" (bronze text) · Each row: checkbox (checked) + title (strikethrough) + date (muted) · Hover/reveal: delete button only |
| Checkbox | Interactive | Unchecked / Checked | Tap to toggle between Ideas/Done · Animated transition |
| Date display | Text (muted color) | Optional | Show date only if set; "No date" for ideas |

### Empty States

**All sections empty:**
- Icon: 🌿
- Title: "No plans yet"
- Body: "Start with one small idea. It doesn't need a date."
- CTA: Focus on title input

**Ideas empty (but coming up / done exist):**
- Hide the Ideas section entirely

### Loading State

- Submit button disabled while adding
- Optimistic update: new item appears immediately

### Responsive

- Mobile: full-width cards, checkbox + title inline, actions below/reveal
- Tablet: two-column layout (Coming up left, Ideas right)
- Desktop: three columns (Coming up, Ideas, Done) side-by-side

### Copy Rules

- Heading: "Dates" (not "Our dates" or "Planned dates")
- Form placeholder: "A walk, a film, that little restaurant…"
- Sections: "COMING UP", "IDEAS", "DONE TOGETHER" (never "PENDING", "COMPLETED")
- Check button: "We did this" (on hover)
- CTA: "Start with one small idea. It doesn't need a date."

---

## 5. Notes — Three Note Kinds

**Purpose:** Send typed notes to partner; categorize by kind.

**Layout (mobile):**

### View: Choose note kind (not writing)

```
┌─────────────────────┐
│  < [Back]           │
├─────────────────────┤
│  Notes              │  ← Display serif heading
│  Say the thing...   │
│                     │
├─────────────────────┤
│                     │
│  [NOTE KIND CARD]   │  ← Three equal-width buttons
│  😔 Weighing        │
│  Something's        │
│  bothering me       │
│                     │
│  [NOTE KIND CARD]   │
│  💕 Lovely          │
│  Something nice     │
│  I want to say      │
│                     │
│  [NOTE KIND CARD]   │
│  💡 Idea            │
│  An idea to try     │
│  together           │
│                     │
├─────────────────────┤
│  [PREVIOUS NOTES]   │  ← Chronological, newest first
│                     │
│  💕 [Lovely]        │  ← Card: emoji + kind label
│      From: You      │
│      Jan 8          │  ← Gray text
│      "I love how    │  ← Excerpt
│      you..."        │
│      [Read] [Ack]   │  ← Actions
│                     │
│  😔 [Weighing]      │
│      From: Partner  │
│      Jan 6          │
│      "I've been     │  ← If from partner: show "Read ✓" if ack'd
│      thinking..."   │
│      [Read] [✓Ack]  │
│                     │
│  (more notes...)    │
│                     │
└─────────────────────┘
```

### View: Writing a note

```
┌─────────────────────┐
│  < [Back]           │  ← Exit = cancel (unsaved drafts saved locally)
├─────────────────────┤
│                     │
│  💕 Lovely          │  ← Emoji + kind label (info card)
│  Something nice     │
│  I want to say      │
│                     │
│  [Textarea]         │  ← Focus on load
│  "You know how..."  │  ← Autosave as you type
│  (max 500 chars)    │
│                     │
│  [Send to partner]  │  ← Primary button (rose-accent)
│  [Cancel]           │  ← Quiet button
│                     │
│  Unsaved changes... │  ← Optional: show if navigating away
│                     │
├─────────────────────┤
│  Error message      │  ← If submit fails
│  (if any)           │
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Back" |
| Heading | Display serif | Static | "Notes" + subtitle "Say the thing, and say what kind it is…" |
| Note kind selector | Button card grid (3 equal) | Tap to write | Each card: emoji + title + description · "😔 Weighing / Something's bothering me" · "💕 Lovely / Something nice I want to say" · "💡 Idea / An idea to try together" |
| Textarea (writing mode) | Textarea | Autosave / Empty / Filled | Placeholder: depends on kind ("Tell them what's weighing on you…") · Autosaves locally · Shows char count (max 500) |
| Send action | Button | Default / Sending | Primary: "Send to [partner name]" (disabled if empty) · Quiet cancel button |
| Note card (history) | Card | You wrote / Partner wrote / Acknowledged | Emoji + kind label · "From: You" or "From: [partner name]" · Date (muted text) · Excerpt (italic) · Actions: [Read] and [✓ Acknowledge] (if from partner and not yet ack'd) |
| Acknowledgement | Inline text or button | Acknowledged | "Read ✓" or similar (if from partner and you've read) · Button to ack if not yet done |

### Empty States

**No notes yet:**
- Icon: 🤍
- Title: "Nothing here yet"
- Body: "Whatever needs saying can start here."
- CTA: Tap a note kind to start

**Just started:**
- Focus on textarea
- Placeholder guides tone

### Loading State

- Send button shows "Sending…"
- Note appears in history immediately (optimistic)

### Responsive

- Mobile: full-width note cards, stack vertically
- Tablet: two-column layout (write form left, history right)
- Desktop: centered two-pane, max-width 900px

### Copy Rules

- Heading: "Notes" + "Say the thing, and say what kind it is — so it never arrives as a surprise."
- Kind titles: "Weighing", "Lovely", "Idea" (simple, warm)
- Kind descriptions: short, inviting (not instructing)
- Placeholder (Weighing): "Tell them what's weighing on you…"
- Placeholder (Lovely): "What did you love about today?"
- Placeholder (Idea): "What could we try?"
- CTA: "Send to [partner name]" (not "Send")
- History: "From: You" or "From: [partner name]" (never "they said")

---

## 6. Scripture — Spiritual Ritual

**Purpose:** One partner chooses a verse; the other responds.

**Layout (mobile):**

### State: Open (waiting to choose)

```
┌─────────────────────┐
│  < [Back]           │
├─────────────────────┤
│  Scripture          │  ← Display serif
│  Whoever gets here  │
│  first chooses...   │
│                     │
├─────────────────────┤
│  TODAY'S SUGGESTION │  ← Light info card
│  (John 3:16)        │
│  "For God so loved  │
│  the world..."      │
│                     │
│  [Choose a verse]   │  ← Quiet button (expand list)
│  [Why this one?]    │  ← Textarea (optional note)
│  "It reminds me..." │
│                     │
│  [Share this verse] │  ← Primary button
│                     │
├─────────────────────┤
│  Translation        │
│  [WEB] [KJV]        │  ← Two toggle buttons
│                     │
└─────────────────────┘
```

### State: Verse chosen, waiting for partner

```
┌─────────────────────┐
│                     │
│  YOU CHOSE          │  ← Heading (soft color)
│  John 3:16          │  ← Verse reference
│  "For God so loved  │  ← Verse text
│  the world..."      │
│                     │
│  "It reminds me of  │  ← Your note (if provided)
│  your kindness."    │
│                     │
├─────────────────────┤
│  Waiting to hear    │  ← Calm message (no deficit)
│  what [partner]     │
│  makes of it.       │
│                     │
└─────────────────────┘
```

### State: Partner has responded

```
┌─────────────────────┐
│                     │
│  YOU CHOSE          │  ← Top half (same as above)
│  John 3:16          │
│  "For God so loved  │
│  the world..."      │
│                     │
├─────────────────────┤
│                     │
│  [PARTNER NAME]     │  ← Heading (rose-accent)
│  RESPONDED          │
│  "This verse speaks │  ← Their response
│  to me of hope even │
│  in darkness..."    │
│                     │
│  [Save as memory]   │  ← Optional action
│  [Share again]      │  ← Quiet button
│                     │
└─────────────────────┘
```

### State: Responding to partner's verse

```
┌─────────────────────┐
│  [PARTNER NAME]     │  ← Top shows their choice
│  CHOSE              │
│  Romans 8:28        │
│  "We know that..."  │
│                     │
├─────────────────────┤
│                     │
│  What do you make   │  ← Heading
│  of it?             │
│                     │
│  [Textarea]         │  ← Your response (autosave)
│  "However it lands. │
│  There's no right   │
│  answer."           │
│  (max 500 chars)    │
│                     │
│  [Share response]   │  ← Primary button
│  [Clear]            │  ← Quiet button
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Back" |
| Heading | Display serif | Static | "Scripture" + "Whoever gets here first chooses today's verse. The other reads it and says what it stirred." |
| Suggestion card | Info card | Info | Today's suggestion (reference + text excerpt) |
| Verse picker | Expandable list / Button | Collapsed / Expanded | "Choose a verse" button opens scrollable list of stored verses; tap to select |
| Note textarea | Textarea | Optional | "Why this one, today?" (autosave, max 500 chars) |
| Share button | Button (primary rose) | Default / Sending | "Share this verse" (disabled if no verse selected) |
| Chosen verse display | Card | Static | Reference + full text + your note (if provided) |
| Waiting message | Calm text | Waiting | "Waiting to hear what [partner name] makes of it." (never "they haven't answered") |
| Response textarea | Textarea | Autosave / Filled | Placeholder: "However it lands. There's no right answer." (autosave, max 500) |
| Translation toggle | Two equal buttons | WEB / KJV | "WEB" and "KJV" toggle; your selection persists |

### Empty States

**No verse chosen yet:**
- Show suggestion
- Invite to choose or use suggestion

**Waiting for partner:**
- Calm message (no "waiting" pressure)
- Show chosen verse + your note

### Loading State

- Share button shows "Sharing…"
- Response appears immediately (optimistic)

### Responsive

- Mobile: full-width card layout
- Tablet/Desktop: centered column, max-width 600px

### Copy Rules

- Heading: "Scripture" + explanation sentence (from constitution)
- Suggestion card: "Today's suggestion"
- Choose button: "Choose a verse"
- Share button: "Share this verse" (not "Submit" or "Send")
- Waiting: "Waiting to hear what [partner name] makes of it." (never "they haven't answered")
- Response prompt: "What do you make of it?"
- Response placeholder: "However it lands. There's no right answer."
- Note prompt: "Why this one, today?"

---

## 7. Story — Memory Vault

**Purpose:** Shared timeline of memories, photos, and milestones.

**Layout (mobile):**
```
┌─────────────────────┐
│  < [Back]           │
├─────────────────────┤
│  Story              │  ← Display serif
│  Memories you've    │
│  saved together.    │
│                     │
├─────────────────────┤
│                     │
│  TIMELINE           │  ← Vertical thread (oldest at bottom)
│  (Newest at top)    │
│                     │
│  ┌─────────────┐    │
│  │ Jan 8, 2026 │    │  ← Date milestone
│  │ Anniversary │    │  ← Gold accent dot (if milestone)
│  └─────────────┘    │
│       │             │
│  ┌────▼─────────┐   │
│  │ [Photo]      │   │  ← Memory card
│  │              │   │
│  │ First coffee │   │  ← Title
│  │              │   │
│  │ The morning  │   │  ← Description excerpt
│  │ you knew...  │   │
│  │              │   │
│  │ Jan 7        │   │  ← Date
│  └──────────────┘   │
│       │             │
│  ┌────▼─────────┐   │
│  │ First        │   │
│  │ question     │   │  ← Auto-saved shared question
│  │ answered     │   │
│  │              │   │
│  │ Jan 1        │   │
│  └──────────────┘   │
│       │             │
│  ┌────▼─────────┐   │
│  │ Started our  │   │  ← Relationship start milestone
│  │ story        │   │
│  │ (no photo)   │   │
│  │              │   │
│  │ Dec 15, 2025 │   │  ← Oldest at bottom
│  └──────────────┘   │
│                     │
├─────────────────────┤
│  Empty state:       │
│  (if no memories)   │
│                     │
│  Your story starts  │
│  here               │
│  Save a daily Q or  │
│  add a memory.      │
│  [Add memory]       │
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Back" |
| Heading | Display serif | Static | "Story" + "Memories you've saved together." |
| Timeline | Vertical scrolling list | Newest first, scroll to oldest | Anchor point: relationship start date at bottom |
| Date milestone | Milestone marker | Milestone / Regular date | If special (anniversary, first Q, etc.): gold accent dot; else: plain date separator |
| Memory card | Card with optional photo | Has photo / No photo | Photo-forward if image exists (hero image, max width) · Title (heading serif) · Description (body text, 2–3 lines) · Date (small, muted) · Footer actions: [Delete] (quiet) · Tap card to expand full view |
| Milestone card | Card (no photo) | Relationship start / Other milestone | Title only (centered, soft text) · Date (muted) · May be gold accent |
| Empty state | Center screen | No memories yet | Icon: 📖 · Title: "Your story starts here" · Body: "Save a daily question you loved, or add a memory of your own — it will be the first entry here." · CTA: "[Add memory]" button |

### Full Memory View (modal / expanded)

```
┌─────────────────────┐
│  < [Back]           │  ← Close/back to timeline
├─────────────────────┤
│  [Full photo]       │  ← Hero image (if exists)
│  (landscape)        │
│                     │
├─────────────────────┤
│                     │
│  Title of memory    │  ← Heading (display serif)
│                     │
│  Jan 8, 2026        │  ← Soft date
│                     │
│  Full description   │  ← Body text, full length
│  text spans         │
│  multiple lines...  │
│  (no truncation)    │
│                     │
│  [Edit] [Delete]    │  ← Actions
│  [Save again?]      │  ← Quiet action if from Q
│                     │
└─────────────────────┘
```

### Loading State

- Skeleton cards matching memory layout
- Photo placeholder while loading

### Responsive

- Mobile: full-width timeline, single column
- Tablet/Desktop: centered timeline, max-width 600px

### Copy Rules

- Heading: "Story" + "Memories you've saved together."
- Empty state title: "Your story starts here" (not "No memories")
- Empty state body: "Save a daily question you loved, or add a memory of your own — it will be the first entry here."
- Memory title: User-provided
- Date format: "Jan 8, 2026" (readable, not timestamp)
- CTA: "[Add memory]" (not "Create" or "Save")

---

## 8. Vault — View-Once Media

**Purpose:** Encrypted view-once photos/videos; disappear after viewing.

**Layout (mobile):**
```
┌─────────────────────┐
│  < [Back]           │
├─────────────────────┤
│  Vault              │  ← Display serif
│  Private photos     │
│  & videos           │
│                     │
├─────────────────────┤
│                     │
│  [VAULT ITEM]       │  ← Metadata-only card (no preview)
│  📸                 │  ← Type icon
│  Sunset at the      │  ← Title (user-provided or auto)
│  beach              │
│  Jan 8, 3:45 PM     │  ← Timestamp (muted)
│                     │
│  View once          │  ← Badge (if not yet viewed)
│  [Open]             │  ← Primary button
│                     │
│  [VAULT ITEM]       │
│  🎥                 │
│  New Year's Eve     │
│  Jan 1, 11:59 PM    │
│  ✓ Viewed           │  ← Badge (if already viewed)
│  [Open again?]      │  ← Disabled or "Can't reopen"
│                     │
│  [VAULT ITEM]       │
│  📸                 │
│  Memory photo       │
│  Dec 20             │
│  [Open]             │
│                     │
├─────────────────────┤
│                     │
│  Empty state:       │
│                     │
│  Nothing private    │
│  yet                │
│  When you share     │
│  a view-once photo, │
│  it will appear     │
│  here.              │
│                     │
└─────────────────────┘
```

### Viewing a vault item (modal)

```
┌─────────────────────┐
│  < [Close]          │  ← Back to list
├─────────────────────┤
│                     │
│  [FULL IMAGE/VIDEO] │  ← Full viewport (no chrome)
│  (swipe to close)   │  ← Mobile gesture
│  (tap to close)     │
│                     │
│  Viewing…           │  ← Subtle indicator (top)
│  (message fades)    │
│                     │
│  ✓ Will auto-delete │  ← Reassurance text (soft)
│  after you close    │
│                     │
│  ✓ They can't       │
│  screenshot (best   │
│  effort)            │
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Back" |
| Heading | Display serif | Static | "Vault" + "Private photos & videos" |
| Vault item card | Card (metadata only) | Unviewed / Viewed | Type icon (📸 photo or 🎥 video) · Title (user-provided or filename) · Timestamp (muted) · Badge: "View once" (if not yet viewed) or "✓ Viewed" (if viewed) · Button: "[Open]" (primary if unviewed) or "[Open again?]" (disabled/grayed if viewed) |
| Full view modal | Full-screen image/video | Viewing | Minimal chrome (back/close only) · Swipe or tap to close · Subtle text: "Viewing…" fades · Reassurance: "Will auto-delete after you close" · "They can't screenshot (best effort)" |
| Empty state | Center screen | No vault items | Icon: 🔒 (or no icon) · Title: "Nothing private yet" · Body: "When you share a view-once photo, it will appear here." |

### States & Behaviors

| State | Behavior |
|-------|----------|
| **Unviewed** | Card shows "[Open]" button (primary rose-accent) · Badge says "View once" · Full view opens modal, plays/shows media, starts auto-delete timer |
| **Viewed** | Card shows "[Open again?]" (disabled) · Badge says "✓ Viewed" · Item is marked; still in list for reference · Tap has no effect (or shows "Already viewed") |
| **Auto-delete** | After closing full view: item disappears from vault after X seconds (5–10s delay for safety) · No notification, just gone · Partner's copy also deletes on their end |

### Loading State

- Skeleton card while fetching metadata
- Blur/placeholder while decrypting media

### Responsive

- Mobile: full-width card list
- Tablet/Desktop: two-column grid (2 cards per row) or three-column grid
- Full view: true fullscreen on all sizes

### Copy Rules

- Heading: "Vault" + "Private photos & videos"
- Card title: User-provided (if given) or auto-filename
- Badge: "View once" (unviewed) / "✓ Viewed" (viewed)
- Button: "[Open]" (not "View" or "Download")
- Reassurance text: "Will auto-delete after you close" + "They can't screenshot (best effort)" (honest, no false promises)
- Empty state: "Nothing private yet" + "When you share a view-once photo, it will appear here."

---

## 9. Write — Private Journal

**Purpose:** Personal, private reflection; never shared with partner.

**Layout (mobile):**
```
┌─────────────────────┐
│  < [Back]           │
├─────────────────────┤
│  Write              │  ← Display serif
│  Private            │
│  reflections for    │
│  only you.          │
│                     │
├─────────────────────┤
│                     │
│  [NEW ENTRY FORM]   │  ← Textarea card
│  ┌─────────────┐    │
│  │ Your entry  │    │  ← Placeholder (inviting)
│  │             │    │
│  │             │    │  ← Grows as you type (autosave)
│  │ [Autosaves] │    │  ← Indicator (subtle)
│  └─────────────┘    │
│  [Save entry]       │  ← Primary button (rose-accent)
│                     │
├─────────────────────┤
│                     │
│  JOURNAL ENTRIES    │  ← Chronological, newest first
│  (12 entries)       │
│                     │
│  ┌─────────────┐    │
│  │ Jan 8       │    │  ← Date (large, muted)
│  │             │    │
│  │ "I've been  │    │  ← Entry excerpt
│  │ thinking    │    │  ← Full text on tap
│  │ about..."   │    │
│  │             │    │
│  │ [Edit]      │    │  ← Actions (hover/reveal)
│  │ [Delete]    │    │
│  └─────────────┘    │
│                     │
│  ┌─────────────┐    │
│  │ Jan 6       │    │
│  │ "Today was  │    │
│  │ a good..."  │    │
│  └─────────────┘    │
│                     │
│  (more entries...)  │
│                     │
├─────────────────────┤
│                     │
│  Empty state:       │
│  Nothing here yet   │
│                     │
│  Your journal is    │
│  a private place    │
│  to reflect, grow,  │
│  and understand     │
│  yourself.          │
│  [Start writing]    │
│                     │
└─────────────────────┘
```

### Full entry view (modal / expanded)

```
┌─────────────────────┐
│  < [Back]           │  ← Close/back to list
├─────────────────────┤
│  Jan 8, 2026        │  ← Full date (soft color)
│  9:45 AM            │  ← Time (if stored)
│                     │
├─────────────────────┤
│                     │
│  Full journal entry │  ← Complete text (no truncation)
│  text, displayed    │
│  in body serif      │
│  (Fraunces). The    │
│  entry may span     │
│  multiple screens.  │
│  Comfortable line   │
│  height and spacing │
│  for reading.       │
│                     │
│  [Edit] [Delete]    │  ← Actions
│                     │
│  Private. Only you. │  ← Reassurance text (soft)
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Header | Back link + title | Static | "< Back" |
| Heading | Display serif | Static | "Write" + "Private reflections for only you." |
| New entry form | Textarea + button | Autosave / Empty / Filled | Placeholder: "Your entry" (inviting) · Textarea grows as you type · Autosaves locally · "[Save entry]" button (disabled if empty) · Indicator: "Autosaving…" (subtle, optional) |
| Entry card | Card (list view) | Default | Date (large, soft color) · Entry excerpt (2–3 lines) · Tap to expand full view · Hover/reveal: [Edit] and [Delete] buttons |
| Full entry view | Modal/expanded | Single entry | Date + time (if available) · Full text (complete, no truncation) · Body serif font (Fraunces) for reading comfort · Generous line height · Actions: [Edit] and [Delete] · Reassurance: "Private. Only you." (soft text) |
| Empty state | Center screen | No entries yet | Icon: ✍️ · Title: "Nothing here yet" · Body: "Your journal is a private place to reflect, grow, and understand yourself." · CTA: "[Start writing]" (focuses textarea) |

### Edit mode

- Tap [Edit] on an entry → expands textarea with full text
- Autosave applies to edits
- [Cancel] discards unsaved changes

### Loading State

- Skeleton card while fetching entries
- Autosave indicator (subtle, non-blocking)

### Responsive

- Mobile: full-width textarea, full-width entry cards
- Tablet: two-column (form on left, entries on right)
- Desktop: centered single column, max-width 700px (reading-comfortable)

### Copy Rules

- Heading: "Write" + "Private reflections for only you."
- Form placeholder: "Your entry" (not "What's on your mind?" — that's Messages)
- Button: "[Save entry]" (not "Post" or "Submit")
- Empty state title: "Nothing here yet" (not "No entries")
- Empty state body: "Your journal is a private place to reflect, grow, and understand yourself."
- Date format: "Jan 8, 2026" (readable)
- Reassurance: "Private. Only you." (emphasize ownership, never shared)
- Edit prompt: (on hover/reveal) "[Edit]" / "[Delete]"

---

## 10. Settings — Account & Relationship

**Purpose:** Profile, auth, privacy, help.

**Layout (mobile):**
```
┌─────────────────────┐
│  Settings           │  ← Display serif heading
├─────────────────────┤
│                     │
│  ACCOUNT            │  ← Section heading (bronze)
│                     │
│  Email              │  ← Label
│  you@example.com    │  ← Value (read-only in MVP)
│                     │
│  Signed in as:      │  ← Label
│  [Your name]        │  ← Value + edit icon (future)
│                     │
│  [Sign out]         │  ← Destructive button
│                     │
├─────────────────────┤
│                     │
│  RELATIONSHIP       │  ← Section heading (bronze)
│                     │
│  Your story started │  ← Label
│  Dec 15, 2025       │  ← Value (read-only)
│                     │
│  Partner:           │
│  [Partner name]     │  ← Value + edit icon (future)
│                     │
│  Invite link        │  ← Label
│  [Generate new]     │  ← Button (if partner not yet joined)
│                     │
│  [Leave space?]     │  ← Quiet button (if linked) with warning
│                     │
├─────────────────────┤
│                     │
│  PRIVACY &          │  ← Section heading (bronze)
│  SECURITY           │
│                     │
│  Your data:         │  ← Explanation
│  Stored on this     │
│  device + encrypted │
│  at rest. Shared    │
│  memories synced    │
│  to server (RLS).   │
│                     │
│  Journal:           │  ← Emphasis
│  Private to you.    │
│  Never shared.      │
│                     │
│  [Export my data]   │  ← Primary button
│  [Delete account]   │  ← Quiet button (confirmation required)
│                     │
├─────────────────────┤
│                     │
│  HELP &             │  ← Section heading (bronze)
│  LEGAL              │
│                     │
│  [Privacy Policy]   │  ← Links (quiet)
│  [Terms of Service] │
│  [About Aveyra]     │
│  [Support]          │  ← Email link
│                     │
│  Version 0.2.0      │  ← Small text (footer)
│                     │
└─────────────────────┘
```

### Export data (modal)

```
┌─────────────────────┐
│  Export your data   │
├─────────────────────┤
│  Download all your  │  ← Explanation
│  memories, answers, │
│  and journal entries│
│  as a ZIP file.     │
│  Takes 1–2 mins.    │
│                     │
│  [Export as JSON]   │  ← Primary button
│  [Export as PDF]    │  ← Secondary button
│  [Cancel]           │  ← Quiet button
│                     │
│  ✓ Exporting...     │  ← Progress indicator
│  Downloaded: ✓      │  ← Success message + file link
│                     │
└─────────────────────┘
```

### Leave relationship (confirmation)

```
┌─────────────────────┐
│  Leave your         │
│  relationship space?│  ← Warning (not urgent, clear)
├─────────────────────┤
│                     │
│  You'll keep a      │  ← Honest description
│  read-only copy of  │
│  all shared         │
│  memories. You can  │
│  export them anytime│
│  from your archive. │
│                     │
│  Your journal stays │  ← Reassurance
│  yours.             │
│                     │
│  [Leave]            │  ← Destructive button
│  [Cancel]           │  ← Cancel (equal prominence)
│                     │
│  This can't be      │  ← Honest: no undo
│  undone.            │
│                     │
└─────────────────────┘
```

### Components

| Section | Component | State | Content |
|---------|-----------|-------|---------|
| Heading | Display serif | Static | "Settings" |
| Section heading | Text (bronze color) | Static | "ACCOUNT", "RELATIONSHIP", "PRIVACY & SECURITY", "HELP & LEGAL" |
| Setting row | Label + value + optional action | Read-only / Editable | Email · Your name · Start date · Partner name · Version |
| Button | Primary / Secondary / Quiet / Destructive | Default | "[Sign out]" (destructive) · "[Generate new]" (for invite) · "[Export my data]" (primary) · "[Delete account]" (quiet, confirmation required) |
| Link | Text link (quiet) | Static | "Privacy Policy", "Terms of Service", "About Aveyra", "Support" |
| Export modal | Modal form | Idle / Exporting / Downloaded | Explanation · Format options (JSON / PDF) · Progress indicator · Success message + download link |
| Leave confirmation | Modal dialog | Prompt | Warning heading + explanation + reassurance · Destructive + cancel button (equal prominence) · Honest: "This can't be undone." |

### Empty States

**No relationship yet:**
- Show "Invite link [Generate]" (if solo)
- Hide "Partner" / "Leave space" fields

**Partner not yet joined:**
- Show "Invite link [Generate new]" (always regenerable)

### Loading State

- Export button shows "Exporting…" + progress
- Leave button shows "Leaving…" while processing

### Responsive

- Mobile: full-width settings, stack sections vertically
- Tablet/Desktop: centered column, max-width 600px

### Copy Rules

- Heading: "Settings"
- Section headings: "ACCOUNT", "RELATIONSHIP", "PRIVACY & SECURITY", "HELP & LEGAL"
- Privacy explanation: Honest, plain language (no jargon)
  - "Stored on this device + encrypted at rest"
  - "Shared memories synced to server (row-level access control)"
  - "Journal: Private to you. Never shared."
- Export: "Download all your memories, answers, and journal entries"
- Leave: "You'll keep a read-only copy of all shared memories. Your journal stays yours. This can't be undone."
- CTA: "[Export my data]" (not "Download" or "Backup")
- Destructive: "[Sign out]", "[Delete account]", "[Leave]" (clear, no hedging)

---

## General Guidelines for All Screens

### Accessibility

- **WCAG 2.2 AA:** 4.5:1 text contrast, 3:1 UI elements, both themes verified
- **Keyboard:** Tab through all interactive elements; focus visible (≥3:1 contrast)
- **Screen reader:** Landmarks (`<main>`, `<nav>`), headings hierarchy, alt text on images, live regions for reveals/updates
- **Touch targets:** ≥44×44px, spaced comfortably
- **Color:** Never sole signal. Pair with icon + text.
- **Reduced motion:** Collapse animations to opacity or instant. Meaning never lives in motion.

### Responsive Breakpoints

- **Mobile:** <768px (single column, full-width cards)
- **Tablet:** 768px–1024px (two-column layouts, generous padding)
- **Desktop:** >1024px (three-column, centered max-width, enhanced UI)

### Loading & Error States

- **Loading:** Skeleton placeholder (no "Loading…" spinner) mirroring final layout
- **Error:** Calm, actionable message + recovery CTA (no codes, no blame)
- **Offline:** Sync language valid (web-first). "Saved locally. Will sync when connected."
- **Empty:** Warm invitation (icon + title + body + one CTA). Never "No data."

### Motion

- **Duration:** 100–200ms base, up to 500ms for reveals
- **Easing:** Soft ease `cubic-bezier(0.2, 0.7, 0.2, 1)`
- **Reduced motion:** Instant or opacity-only
- **User content:** Never animates (photos, text entries static)

### Voice & Tone Checklist

- ✅ Address user as "you"
- ✅ Aveyra never says "we" or speaks in first person
- ✅ Sentence case (incl. buttons, headings)
- ✅ Front-load meaning
- ✅ One idea per sentence
- ✅ No system words (sync, cache, query)
- ✅ No marketing words (amazing, seamless, effortless)
- ✅ No emotional interpretation ("you must have felt…")
- ✅ No comparison, no inactivity remarks ("they haven't…")
- ✅ Honest tone in destructive actions (state consequences clearly)

### Constitutional Constraints (Required)

- ❌ **Never:** XP, levels, streaks, scores, leaderboards, comparison
- ❌ **Never:** Render one partner as a deficit ("they haven't answered", "waiting on them")
- ❌ **Never:** Gamification, earned progress gates, achievement badges
- ❌ **Never:** Relationship health metrics or activity dashboards
- ✅ **Always:** Privacy by default (private data stays private)
- ✅ **Always:** Consent before sharing
- ✅ **Always:** Reversible actions (soft delete, undo, Recently Deleted)
- ✅ **Always:** Calm, small navigation (no feature sprawl)

---

**Ready to build. Use these specs as your blueprint for component structure, layout, and interaction. The design system in `/docs/UI-REDESIGN-GUIDE.md` + `/docs/brand/aveyra-brand-identity.md` provides all visual rules (tokens, typography, spacing, motion, voice). Every screen follows the same emotional targets and constitutional principles.**
