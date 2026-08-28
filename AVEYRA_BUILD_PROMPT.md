# AVEYRA — Full Build Prompt

Build a private, calm, two-person couples app called **Aveyra** ("Aveyra Flow"). It is a shared digital home for exactly two partners in a relationship — meaningful conversations, emotional check-ins, and the memories they keep together. No social feed, no strangers, no ads. Just the two of them.

---

## 1. Product Philosophy

- **Private by design**: every piece of content belongs to exactly one relationship (2 people). Nobody else can ever see it.
- **Calm, not addictive**: no infinite scroll, no gamification, no streaks pressure. Soft language ("How are you arriving today?"), gentle empty states.
- **Offline-first PWA**: works without connection, syncs when online.
- **Passwordless**: email OTP sign-in only. No passwords, no social login.

## 2. Tech Stack

- **Frontend**: Next.js 15 (App Router, static export `output: 'export'`), React 19, TypeScript strict, Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + Realtime + Storage), row-level security on every table
- **Local storage**: IndexedDB via Dexie for offline cache; outbox pattern for offline mutations
- **Auth**: Supabase GoTrue passwordless email OTP (6-digit code, 10-minute expiry, 30-day session)
- **PWA**: web manifest + service worker with precached assets, network-first navigations
- **Deploy**: Netlify (publish directory `out`, build command `npm run build`)

## 3. Design System

**Mood**: intimate, warm, dusky. Dark theme is primary; light theme supported. Rose/plum palette.

- Light background: `#faf1ee`; Dark background: `#1a1016`
- Accent: dusty rose `rgba(196,88,120)` — buttons glow softly (`box-shadow: 0 0 18px rgba(196,88,120,0.22)`)
- CSS custom properties for theming: `--color-surface`, `--color-well`, `--color-edge`, `--color-ink`, `--color-muted`, `--color-accent`, `--color-tint`, `--color-bronze`
- Typography: an elegant display serif for headings (italic lowercase wordmark "aveyra"), a clean humanist sans for body (`--font-display`, `--font-sans`)
- Cards: rounded-2xl (16px radius), 1px subtle borders, generous padding (20px)
- Buttons: pill-shaped (rounded-full), min-height 44px for touch targets
- Icons: 24×24 stroke SVG icons, strokeWidth 1.75, round caps/joins
- Section labels: 12px, weight 700, uppercase, letter-spacing 0.06em, bronze color
- Theme toggle: light / dark / system, persisted in localStorage, no flash on load
- Fully responsive: desktop gets a left sidebar (240px) with nested nav; mobile gets a fixed bottom tab bar (4 tabs: Today, Story, Write, Settings) with 64px height

## 4. Navigation Structure

**Core nav (bottom bar on mobile, top of sidebar on desktop):**
1. Today (hub)
2. Story
3. Write
4. Settings

**Embedded features (indented under "Today" in desktop sidebar; reached via cards on the Today screen on mobile):**
- Check-in, Messages, Dates, Notes, Scripture, Vault

## 5. Screens (10 total)

### 5.1 Today (hub)
- Greeting with date ("Friday, 8 August")
- **Daily question card**: one rotating relationship question per day (e.g. "What's one thing from today you'd want to remember?"). Both partners answer; your partner's answer is revealed after you answer. ~200 questions across 10 categories (memories, dreams, gratitude, playfulness, intimacy, values, fears, daily life, future, faith), deterministic daily rotation engine.
- Partner activity hints ("Jordan answered today's question")
- Quick-access cards to Check-in, Messages, Dates, Notes, Scripture, Vault
- **Daily relationship suggestion**: one small gentle idea per day ("Leave a note in their coat pocket")

### 5.2 Check-in (emotional wellness)
- "How are you arriving today?"
- 6 feelings in a 3×2 emoji grid: Calm 🌿, Happy 🌞, Grateful 🕊️, Tired 🌙, Stretched 🌧️, Low 🌫️
- Optional one-line note ("Anything you'd like to add?")
- Share button → partner sees your check-in; their card shows "Jordan's check-in hasn't come through yet." until they check in
- One check-in per person per day (upsert on same day)

### 5.3 Messages
- Private two-person chat thread, real-time
- **Pings**: 6 fixed quick messages sendable with one tap: "thinking of you", "miss you", "hope today is kind", "saw something you'd like", "no need to reply", "goodnight"
- Ping limit: max 5 pings per person per day (enforced server-side by trigger)
- Calm empty state: "It's quiet in here."

### 5.4 Dates (date planner)
- Plan dates together: title, notes, optional date/time
- Status flow: idea → planned → done
- Lists upcoming and past dates

### 5.5 Notes (three channels)
- Three note kinds, each its own tab/channel:
  1. **"Something's weighing on me"** (kind: weighing) — a gentle way to raise something hard. "It doesn't have to be tidy."
  2. **"Something lovely"** (kind: lovely) — appreciation notes
  3. **"Something to try"** (kind: idea) — ideas for the relationship
- Partner can acknowledge a note (acknowledged_at timestamp)
- Soft-delete support

### 5.6 Scripture (daily ritual)
- Faith ritual for couples: each day, the **first partner to open it chooses** the day's verse (suggested verse offered, or pick another) and adds an optional note on why
- The **second partner responds** with a reflection ("There's no right answer.")
- One scripture per relationship per day; both sides shown once complete
- Real-time updates

### 5.7 Story (shared memories)
- Timeline of shared memories: title, description, date, optional photo attachment
- Photos stored in private Supabase Storage bucket (`memory-photos`), scoped per relationship
- This is the couple's "story" — a scrapbook of their relationship

### 5.8 Write (private journal)
- Personal journal — **private to the author**, NOT shared with partner
- Title + free text ("whatever's on your mind")
- Save disabled until content exists; list of past entries; soft delete

### 5.9 Vault
- Private shared photo/video storage for the couple
- **View-once support**: items can be marked view-once (viewed then gone)
- Video support flag
- Private Supabase Storage bucket (`vault`), path scoped by relationship id
- Honest copy about limits: the app "can't stop a screenshot" — trust-based framing

### 5.10 Settings
- Display name edit
- Theme toggle (light/dark/system)
- Partner info (paired partner shown with avatar initial)
- Data export/import (JSON backup of local data)
- Sign out

## 6. Authentication & Onboarding

### Sign-in flow
1. `/sign-in`: enter email → "A sign-in code will be sent to the email you provide." → Send code
2. Supabase `signInWithOtp` emails a 6-digit code (10-minute expiry)
3. `/verify`: enter code → `verifyOtp` → 30-day session
4. Error states: invalid email, incorrect code ("That code is incorrect. Try again."), expired code, rate limiting (3 requests/min per email), max 3 verify attempts
5. Enumeration protection: requesting a code always "succeeds" from the UI's perspective

### Private beta allowlist
- Env var `NEXT_PUBLIC_ALLOWED_EMAILS` (comma-separated). If set, only these emails may sign in; message: "Aveyra isn't open to new accounts yet." Unset = open signup.

### Onboarding flow (after first sign-in)
1. `/onboarding/name`: your display name
2. `/onboarding/choice`: **Create a space** or **Join with an invite code**
3. Create → relationship created, shows an invite code to send to partner (`/onboarding/invite`)
4. Join → enter partner's code (`/onboarding/join`); code expires; a space holds max 2 members
5. `/onboarding/details`: optional relationship start date

## 7. Data Model (Postgres / Supabase)

Tables (all with RLS enabled; helper `is_member(relationship_id)` checks membership):

- `profiles` (id → auth.users, email, display_name, device_public)
- `relationships` (id, start_date)
- `relationship_members` (relationship_id, user_id) — max 2 per relationship
- `invitations` (code unique, relationship_id, inviter_id, expires_at, accepted_by, accepted_at)
- `answers` (relationship_id, question_id, author_id, content; unique per rel+question+author)
- `memories` (relationship_id, title, description, memory_date, image_ref)
- `journal_entries` (owner_id, title, content, deleted_at) — RLS: owner only
- `date_plans` (relationship_id, title, notes, status idea|planned|done, planned_for, deleted_at)
- `messages` (relationship_id, author_id, content, kind message|ping) + ping vocabulary check + trigger enforcing 5 pings/author/day
- `checkins` (relationship_id, author_id, date_key, mood [calm|happy|grateful|tired|stressed|sad], note; unique per rel+day+author)
- `vault_items` (relationship_id, author_id, object_path, view_once bool, is_video bool)
- `daily_scriptures` (relationship_id, date_key, chooser_id, reference, text, chooser_note, response, responded_at; unique per rel+day)
- `notes` (relationship_id, author_id, kind weighing|lovely|idea, content, acknowledged_at, deleted_at)

**RLS pattern**: SELECT for relationship members; INSERT requires membership AND author_id = auth.uid(); journal entries owner-only. SECURITY DEFINER functions: `create_space(start date)`, `accept_invitation(invite_code text)`.

**Realtime**: publications on messages, checkins, answers, daily_scriptures, notes.

**Storage buckets** (private): `memory-photos`, `vault` — object paths start with `{relationship_id}/`, policies gate by membership.

## 8. Architecture Patterns

- **Provider-swap pattern**: app talks to an `AuthProvider` interface (`requestOtp`, `verifyOtp`, `getSession`, `signOut`); a `LocalStubAuthProvider` (in-memory, testable) is the default, `SupabaseAuthProvider` injected at bootstrap when env vars exist. Same pattern for data repos (local Dexie repo ↔ Supabase repo).
- **Offline outbox**: mutations queue locally when offline, replay on reconnect.
- **Field encryption module** (Web Crypto, PBKDF2) wired into local storage; E2EE-ready design.
- **Error boundaries** at top level; calm, user-safe error messages everywhere; no PII or codes in logs.
- Screen components are pure client components ('use client') behind static-exported routes.

## 9. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<your supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>
NEXT_PUBLIC_ALLOWED_EMAILS=<email1,email2>   # optional private-beta lock
```

## 10. Quality Bar

- TypeScript strict, no `any`
- ESLint + Prettier clean; JSX entities escaped
- Unit tests for question rotation, auth stub contract, encryption, storage; component tests (Testing Library + jsdom); e2e smoke (Playwright)
- Lighthouse-friendly static export; all touch targets ≥ 44px; aria-current on nav, aria-labels on icon buttons, focus traps in modals
- Copy tone: lowercase, warm, unhurried. Example strings to preserve:
  - "Sign in to your space"
  - "How are you arriving today?"
  - "Jordan's check-in hasn't come through yet."
  - "It's quiet in here."
  - "It doesn't have to be tidy."
  - "There's no right answer."

## 11. Demo Data (for previews)

Use partner name "Jordan" in all mocked states, seeded example content for each screen, and current-date headers.
