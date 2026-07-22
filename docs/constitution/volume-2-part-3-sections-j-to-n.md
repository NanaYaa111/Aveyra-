# Volume 2 · Part 3 — Feature Specifications (Sections J–N)

> Received 2026-07-22. Sections **J (Notifications & Reminders), K (Relationship
> Settings & Personalization), L (Media & Memory Storage), M (Account, Identity &
> Authentication), N (Offline-First Architecture & Synchronization)**. Part 3 has
> 20 sections; **A–N now captured, O–T + all of Part 4 pending.** A polished
> "implementation-ready" restatement of J–N and a research synthesis accompanied
> this batch — treated as refinement references, consistent with the primaries.

> ✅ **TWO CONFLICTS RESOLVED 2026-07-22 (author decided):**
> 1. **Q15 — Auth → passwordless email OTP / magic link.** Section M's password /
>    recovery language is **superseded**; credential = email + OTP / magic link
>    (recovery = request a new code/link; passkeys a future option).
> 2. **Q16 — Architecture → web-first stays; Section N reframed** as the
>    graceful-disconnection layer ("local-first EXPERIENCE, cloud source of
>    truth"). Local = cache + pending-actions queue; **conflict-preservation**;
>    keep the UX copy ("Saved safely. Waiting to sync."), drop full
>    local-first / CRDT architecture.
>
> See [open-questions.md](open-questions.md) Q15, Q16. The section text below is
> kept as written; these banners + reconciliation notes carry the resolution.

---

## Section J — Notifications & Reminders

**Purpose.** Gentle assistance to maintain meaningful connection **without
pressure, anxiety, or engagement addiction.** A support system, **not a measure
of relationship performance.** Reminds about: answering Daily Questions,
important dates, revisiting memories, relationship rituals, personal reflection.

**Principles.** Gentle over frequent (never social-media / streak / gamified) ·
**relationship support, not monitoring** (never "your partner is waiting" / "you
missed…" — *good:* "A small moment of reflection is waiting for you") · user
control (which/when/how often) · **privacy first** (never reveal sensitive
content — *bad:* "Your partner wrote a private journal entry"; *good:* "Aveyra
has a new reflection opportunity").

**Categories.** A. Daily Connection reminders · B. Milestone notifications · C.
Memory rediscovery · D. Personal Journal reminders (**never reveal journal
content**) · E. System notifications (sync/backup/security/account).

**Timing & limits.** User controls time / days / frequency. Defaults: Daily
Questions ~1/day; Memories a few/week; anniversaries auto-on. **Quiet hours**
(queued, delivered later). **Frequency cap ~5 relationship notifications/day**,
weekly adjustable; prioritise milestones > user reminders > memories > prompts.

**Independence.** Each partner controls their own; settings are **never** a
relationship signal.

**Security.** Configurable lock-screen previews (private mode: "You have a new
Aveyra reminder"). Calm short copy; no urgency/clickbait/badges.

- **Data Model.** Notification id · user id · relationship id · type · title ·
  message · reference id · scheduled time · delivered time · read status ·
  created.
- **User Flow.** Event/schedule → rules checked → prefs evaluated → scheduled →
  delivered → opens related feature.
- **Edge Cases.** Notifications disabled · multiple devices · duplicates ·
  expired reminders · relationship deletion · account restoration · timezone
  changes · offline scheduling · permission denial.
- **Acceptance.** Appropriate reminders · controlled frequency · full user
  control · privacy protected · cross-device · reliable offline · a11y.
- **Future.** Smart timing · relationship rituals · context-aware suggestions
  (approval required) · wearables.
- **Research.** Survey · HIG (notifications require consent, glanceable) ·
  Material · NN/g · habit-formation & digital-wellbeing research.

**Reconciliation.** 🟡 **v1 scope:** the resolved decision is **"Notifications v1:
none — in-app reminders/indicators only; push/email deferred."** Section J is the
**full eventual spec**; the push-notification pieces (§12 push design, §14
lock-screen) are **post-v1**. The in-app pieces (history, activity indicators,
system messages) fit v1. No hard conflict — a scope-staging note.

---

## Section K — Relationship Settings & Personalization

**Purpose.** Let couples configure Aveyra to feel personal, while keeping
**equality, privacy, simplicity.** Adapt to the couple without changing the core
philosophy. *Most users should enjoy Aveyra without changing anything.*

**Principles.** **Equality by design** (both manage shared settings; neither has
superior ownership; important actions confirmed) · **personal settings stay
personal** (notifications, theme, journal, a11y = individual; start date, name,
milestones = shared) · **simplicity over configuration** (no hundreds of toggles)
· **privacy by default** (private journals stay private; settings cannot
override).

**Categories.** A. Relationship Profile (name, partner names, start date,
important dates, photo, description) · B. Shared Preferences (timeline
appearance, memory organization, shared reminders, anniversaries) · C. Personal
Preferences (notifications, theme, language, a11y, writing) · D. Privacy
Settings · E. Account Settings (email, password*, devices, deletion).

**Partner management.** View partner connection, manage invitations, disconnect.
**Leaving** shows data consequences + confirmation (no immediate deletion).

**Privacy controls.** Shared-content visibility · **journal privacy is a
permanent rule settings can't override** · search stays separated (partner
journals never appear).

**Personalization.** Appearance (light/dark/system — **already built**) ·
Timeline style (Classic / Scrapbook / Minimal) · Memory display (photo / text /
balanced) · language (future). **Relationship rituals** (name, frequency,
reminder) — optional.

**Ownership.** Shared data (memories, milestones, timeline) → relationship
space; private data (journal, personal prefs) → individual.

- **Data Model.** *Relationship Settings:* relationship id · name · partner ids ·
  start date · photo · description · shared preferences · created · updated.
  *User Preferences:* user id · theme · notification prefs · language · a11y
  prefs · privacy prefs · created · updated.
- **User Flow.** Open Settings → shared + personal sections → select category →
  update → validate → sync → experience updates.
- **Edge Cases.** Partner disconnects · relationship deletion · account recovery
  · conflicting edits · invalid dates · missing profile info · multiple devices ·
  offline changes.
- **Acceptance.** Manage shared info · personal settings separate · privacy
  controls work · equal ownership · reliable sync · simple interface · a11y.
- **Future.** Relationship themes · shared goals · **optional** relationship
  insights (consent, no judgment, **no scoring**) · transparent AI
  personalization.
- **Research.** Survey · HIG · Material · NN/g · privacy-centred design.

**Reconciliation.** ✅ Aligns with the resolved **Settings** destination
(four-nav), **participants** model, and the journal-privacy hard rule. Schema
additions for M2: relationship name/photo/description/important-dates; the
`UserPreferences` record (theme already persisted locally today). *§4E lists
"password" — see Q15.* Timeline styles + memory-display are additive
personalization.

---

## Section L — Media & Memory Storage

**Purpose.** Preserve relationship media as **meaningful moments**, not ordinary
files. Memories stay safe, accessible, high-quality, private, available over
time. *Goal is preservation, not maximising uploads.*

**Principles.** Memories are valuable (preserve/quality/organise) · privacy first
(never public/discoverable/unauthorised) · quality over quantity (no infinite-
storage pressure, no social-posting behaviour) · **invisible complexity** (users
never see storage/compression/sync/file management).

**Media types.** Images (JPEG, PNG, HEIC/WebP where supported) · videos (common
mobile formats) · documents (future). **Sources:** device gallery, camera,
files, future cloud. **Locations:** shared memories, timeline, relationship
profile, private journal (**journal media follows journal privacy**).

**Upload.** Select → validate → upload (background where possible) → progress →
process → attach. Retry failed; clear errors; **no data loss.**

**Processing.** Compression (**preserve visual quality**, no noticeable
degradation) · thumbnails (timeline/search/cards) · metadata (**location hidden
unless explicitly enabled**).

**Storage architecture.** Secure object storage · access-controlled media URLs ·
encryption · backup · version handling. **Never expose** raw paths / internal
ids / private URLs.

**Security.** Auth required · authorization checks (identity + relationship
membership + permission) · temporary secure links where appropriate.

**Offline.** Select/create/attach locally → upload queue → resume on reconnect.
**Sync** handles multi-device, failed/interrupted/duplicate uploads; **preserve
originals, avoid silent deletion.**

**Storage limits.** Balance user needs / cost / sustainability. MVP: free tier
(limited); premium later. **Limits must never threaten existing memories without
warning.**

**Organization.** Albums · tags · categories. **Editing:** basic only (crop,
rotate, cover) — not a full editor. **Deleted media** → recovery storage →
retention → permanent.

- **Data Model.** *Media Object:* media id · relationship id · owner user id ·
  storage reference · media type · file name · file size · dimensions · duration
  · thumbnail reference · metadata · created · updated. *Media Attachment:*
  attachment id · media id · content type · reference id · visibility level ·
  created.
- **User Flow.** Create memory → attach media → secure upload → process →
  available → appears in connected features.
- **Edge Cases.** Large videos · low storage · slow networks · interrupted
  uploads · duplicates · corrupted media · unsupported formats · deleted accounts
  · missing references · offline-created memories.
- **Acceptance.** Reliable upload/view · media private · offline uploads sync ·
  acceptable performance · deleted media follows recovery · quality preserved ·
  a11y (alt text).
- **Future.** AI organization (consent) · relationship video stories · physical
  products (books) · advanced archival/export.
- **Research.** Survey · Apple Photos · Material · NN/g · digital-preservation.

**Reconciliation.** M2 moves media from the M1 local `images` Blob store to
**Supabase Storage** (object storage + access-controlled URLs + RLS). Enables
Section F's **multiple photos** per memory. Media Object/Attachment models are
new for M2. Location-metadata-hidden-by-default aligns with no-tracking.

---

## Section M — Account, Identity & Authentication  ✅ *(Q15 resolved: passwordless OTP)*

**Purpose.** Secure access, data ownership, partner connection, control. Auth is
**the foundation of trust.**

**Principles.** Trust before convenience · **identity belongs to the individual**
(a relationship connection **never merges identities** — partners stay separate,
connected via permission-based relationships) · privacy by default (private info,
no public profile, no discoverability) · simple security.

**🔺 Account creation (CONFLICT — Q15).** Section M: **Email registration
requires email + password + confirmation** (optional name/photo); §8 password
requirements; §9 password recovery. *Future:* Google/Apple/passkeys/phone. **This
contradicts Section A + the resolved decision (passwordless email OTP / magic
link, no passwords).**

**Registration flow.** Open → Create Account → info → accept Terms & Privacy →
account created → onboarding → create/join relationship.

**Identity profile.** *Required:* user id, credentials, email. *Optional:*
display name, image, prefs. **User identity ≠ relationship identity.**

**Login / recovery.** Verify → session. Recovery via verified email; messages
must not expose account existence ("If an account exists with this email,
recovery instructions have been sent"). **Email verification** confirms ownership.

**Partner connection.** Two separate accounts; invitation → accept; consent
required; either can decline; no automatic matching.

**Permissions.** AuthN = access; authZ = what you can do. Can access own journal
+ shared content; **cannot** access partner's private journal/settings.

**Sessions.** View/remove devices, remote sign-out; device name, last active,
location estimate where appropriate. **Multi-device** (phone/tablet/web-future).

**Security notifications.** New login / password / recovery / security changes —
calm, non-fearful copy.

**Deactivation / deletion.** Deactivate (hidden, data preserved, notifications
paused). Delete → confirmation + explanation + **recovery period**; clarify what
happens to private vs shared data. **Account changes must not cause accidental
data loss.**

**Security architecture.** Secure password hashing* · encrypted comms ·
token-based sessions · secure refresh · **rate limiting** · suspicious-activity
detection. **Offline auth:** previously-authenticated devices access cached
content; sensitive actions require verification; sync on reconnect.

- **Data Model.** *User Account:* user id · email · password hash* · display name
  · profile image · email verified · account status · created · updated.
  *Session:* session id · user id · device info · access token · refresh token ·
  created · last active · expiration. *Relationship Connection:* relationship id
  · user A id · user B id · connection status · created · updated.
- **User Flow.** Create account → verify → enter → create/join relationship →
  permissions assigned → access features.
- **Edge Cases.** Forgotten passwords* · lost devices · duplicate accounts ·
  expired sessions · failed verification · invitation expiration · deletion
  requests · suspicious logins · offline auth conflicts.
- **Acceptance.** Secure register/login · clear ownership · consent-based partner
  connection · private data protected · secure sessions · reliable recovery ·
  a11y (password-manager compatibility*).
- **Future.** Passkeys · biometrics · security center · trusted recovery contacts.
- **Research.** HIG · **OWASP** auth practices · NN/g · privacy-focused identity ·
  survey.

**Reconciliation.** ✅ Individual identity ≠ relationship identity, consent-based
linking, authZ boundaries, session management → all match the **participants**
model + staged-privacy RLS. ✅ **Q15 resolved → passwordless email OTP / magic
link** (Option A): every `*`-marked password item (password field, confirmation,
password recovery, password hashing, "forgotten passwords") is **superseded** —
the credential is email + OTP/magic link, recovery is a new code/link, passkeys
are a future option. Rate limiting + suspicious-activity + secure sessions carry
over unchanged (Supabase Auth provides OTP natively).

---

## Section N — Offline-First Architecture & Synchronization  ✅ *(Q16 resolved: reframed under web-first)*

**✅ Purpose (Q16 resolved → web-first, Section N reframed).** As written, Section
N says *"the device is the primary place… the cloud exists to synchronize"* —
full offline-first / local-first. **Resolution:** **web-first stays** — the cloud
is the canonical **source of truth**; the local device holds a **cache + a
pending-actions queue**, not the primary store. Section N is read as **"local-first
EXPERIENCE, cloud source of truth"**: the entire UX (offline create/edit → sync
queue → auto-sync → "Saved safely. Waiting to sync." → conflict-preservation)
survives; only the *architecture* framing (local is truth / full local-first /
CRDT) is dropped.

**Principles (as written).** Local first, cloud enhanced · never lose a
meaningful moment · sync is invisible · transparency on failure ("Your memory is
saved on this device and will sync when you're connected" — not "Sync error
403").

**Offline-supported features.** Timeline (cached) · memories (create/text/local
media) · journal (write/edit drafts) · daily questions (cached, answer locally) ·
search (downloaded content). **Requires connection:** account creation, partner
invitation, security changes, large media upload, backup restore.

**Local storage.** Secure local DB per device (cached memories, journal drafts,
timeline, pending actions, search indexes). *§7 suggests SQLite/Realm* — **note:
the web-first stack uses Dexie/IndexedDB.**

**Sync model.** Action → save locally → add to sync queue → connection →
upload → server validates → download updates → local DB updated. **Sync queue
item:** id · user id · action type · entity type · entity id · created · status
(Pending/Uploading/Completed/Failed/Conflict) · retry count.

**Conflict resolution.** Default **last confirmed valid update**, BUT **critical
conflicts must not silently overwrite** — preserve both versions temporarily,
notify. (Merge field-level where possible: A edits title, B changes photo → merge.)

**Media sync.** Metadata first → upload → process → final reference.
**Connectivity awareness:** online status, quality, progress ("12 memories
waiting to sync") — not constant technical indicators. **Background sync** +
battery/network awareness; user controls mobile-data/background syncing.

**Security/privacy offline.** Encrypted local storage · secure tokens · device
protection · session expiration · app-lock (future) · **private journal
protected even on an unlocked device.**

- **Data Model.** *Sync Record:* sync id · user id · entity type · entity id ·
  operation · local version · server version · status · created · updated.
  *Local Cache Record:* cache id · user id · entity type · entity data · last
  synced · expiration policy.
- **User Flow.** Create → saves locally instantly → keep using → internet returns
  → auto-sync → server confirms → all devices get latest.
- **Edge Cases.** Long offline periods · multiple offline devices · failed/partial
  uploads · crashes · device replacement · storage limits · corrupted local DB ·
  device time differences.
- **Acceptance.** Core features work offline · no silent data loss · reliable sync
  · safe conflict handling · secure local data · understandable sync status ·
  smooth performance.
- **Future.** Advanced sync intelligence · peer-to-peer sync · offline AI
  (privacy/device/consent) · **full local-first mode.**
- **Research.** Offline-first / **local-first software** movement (Kleppmann et
  al.) · HIG · Material resilience · distributed-systems · survey. *"A meaningful
  memory should never depend on whether the internet happens to be available."*

**Reconciliation.** ✅ **Q16 → reframe under web-first (Option A, author decided).**
Section N's substance (save-locally-first, sync queue, conflict-**preservation**,
"Saved safely. Waiting to sync.", encrypted local cache) is the **graceful-
disconnection + draft-cache layer under a cloud source of truth** — most of the
spec survives; only the "local is source of truth / full local-first / CRDT"
framing is dropped. Tech: web-first uses **Dexie/IndexedDB + Supabase**, not
SQLite/Realm. The M1 **outbox + sync-engine stub already model the
pending-actions queue** the reframed Section N needs.

---

## Batch reconciliation summary

- **Q15 (auth):** Section M password auth vs Section A + resolved OTP passwordless
  — **decision needed.**
- **Q16 (offline-first):** Section N local-first vs the web-first pivot —
  **decision needed** (reframe-under-web-first vs reverse-the-pivot).
- **Notifications v1 = none** (in-app only) stands; Section J push design is
  post-v1.
- **M2 schema additions (J–N):** notifications table · relationship
  profile fields + UserPreferences · Media Object + Media Attachment (Supabase
  Storage) · Session + Relationship Connection · Sync Record + Local Cache Record.
- **Consistent regardless of Q15/Q16:** individual-identity-≠-relationship,
  consent-based linking, journal-owner-only RLS, no-scoring, calm/no-pressure
  notification tone, location-metadata-off-by-default, preserve-don't-overwrite
  conflict handling.
