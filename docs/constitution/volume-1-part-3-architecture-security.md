# Volume 1 — Part 3: Offline-First Architecture, Database, Security, Encryption, Backup, Export/Import & Data Management

The correct architecture is the **simplest** system that works reliably without
connectivity, protects relationship data honestly, preserves user control, and
allows future evolution without rebuilding Phase 1. Technical sophistication is
not a goal.

## Four questions Part 3 answers
1. Offline-first architecture that never assumes connectivity but still allows
   future sync — no sync states, remote identifiers, fake cloud status,
   "waiting to sync," or network-dependent flows. Future compatibility comes
   from good data design, not premature infrastructure.
2. Store/encrypt/protect data per the privacy rules. Allowed: "Your data is
   stored on this device and encrypted at rest." Forbidden: "completely secure,"
   "end-to-end encrypted," "nobody can access your memories."
3. Genuinely reversible export, import, deletion. Deletion ≠ destruction;
   export ≠ screenshot; backup ≠ suggestion. Guarantee recovery after mistakes,
   portable ownership, future migration, no silent data loss.
4. WCAG 2.2 AA across all Phase 1 technical flows (DB states, error handling,
   dynamic updates, keyboard, focus, import/export feedback, reveal).

## 2. Architecture Principles
- **2.1 Local-first by default.** The device database is the source of truth.
  Works with no internet, airplane mode, after install, during network failure.
  No feature checks "is the user online?" before normal operation.
- **2.2 Local truth vs future remote state — never mixed.** A local entry is
  "stored locally," never "waiting for upload." Future versions may add a
  Conflict Resolution Layer + Remote State; Phase 1 has only Local Truth.
- **2.3 Layering:** UI → Application Logic → Local Data Access → Encrypted Local
  Database → Device Storage. **No** API layer, auth server, cloud database,
  analytics SDK, or tracking scripts.

## 3. Storage
- **IndexedDB** is the primary Phase 1 store, through a reliable abstraction
  layer. Export files for user-controlled backup. Future migration path to
  SQLite if required. Treat IndexedDB as the **canonical device database, not a
  cache** — assume it can be evicted if not persisted.
- Compared: SQLite/WASM (strong relational model, more complexity) and File
  System Access API (user-controlled files, useful for exports, limited support
  — not a primary store).

## 4. Data Persistence Rules
- **Best-effort** storage may be removed by the browser; **persistent** storage
  is requested not to be. Request `navigator.storage.persist()` where available,
  detect whether granted, explain honestly if not.
- Correct: "Your browser may clear this data. Install the app and export
  regularly to keep your memories safe." Incorrect: "Your memories are
  permanently safe." Watch quota (`navigator.storage.estimate()`); handle
  quota-exceeded deliberately. **Safari/iOS is the risk platform — test first.**

## 5. Database Design
Must support offline operation, soft deletion, export/import, version migration,
future synchronization.
- **Core entities (Phase 1):** RelationshipProfile, Question, Answer, Memory,
  JournalEntry, DeletedItem, AppSettings, ExportRecord.
- **Every user-content record carries:** `id`, `created_at`, `updated_at`,
  `deleted_at`, `schema_version`.

## 6. Event History
Phase 1: use normal records with timestamps. Do **not** introduce full event
sourcing / append-only journal unless future sync requirements justify it.

## 7–9. Encryption & Security
- **Threat model.** Protects against: casual device access, lost *unlocked*
  device, someone opening the app without permission. **Not** against: advanced
  forensic attacks, compromised OS/malware, professional data recovery. Web
  Crypto cannot defend against XSS or a compromised bundle — if hostile JS runs,
  it can use the keys.
- **Encryption at rest.** Pipeline: user passphrase → **PBKDF2** (random salt,
  **≥ 200,000 iterations**; Argon2 would add a dependency) → key →
  **AES-GCM** (fresh random **12-byte / 96-bit IV per operation**) → local data.
  Keys **non-extractable**; never persisted in plaintext (not in IndexedDB,
  localStorage, or files). Passphrase kept **in memory only**, cleared at
  session end. Store only ciphertext, IVs, salts, metadata.
- **Passphrase** is optional, has no account, and **no recovery mechanism** —
  "There is no way to recover this passphrase if it is lost."
- **Full vs selective.** Prefer encrypting the **entire local store** if
  performance allows ("the archive is locked"), not "some parts are protected."
  *(Implementation note: structural/index fields — `id`, timestamps,
  `deleted_at` — stay queryable, so "encrypt the store" means encrypting content
  fields while keeping index columns readable; pin down in Part 4 schema.)*
- Communicate honestly: "encrypted at rest on this device," with limitations in
  plain language. Never "no one can access your data" / "unbreakable."

## 10–11. Export / Import
- **Export** is a first-class ownership feature: available anytime, one action
  from Settings, no account, no server. Contains archive version, relationship
  profile, questions, answers, memories, journal entries, metadata, integrity
  check. Preferred format: an encrypted archive with `manifest.json` (archive +
  schema version, created time), encrypted data (with IVs/salts), `media/`, and
  a checksum/HMAC. **Must include soft-deleted records + `deleted_at`.** Must
  **not** reduce protection relative to the on-device DB.
- **Import is atomic** — either a complete successful restore or no changes.
  Process: select → validate structure/manifest → check version → verify
  integrity (checksum/HMAC) → decrypt to temporary structures → apply in a
  **single transaction that fully commits or fully aborts.** On any failure
  before commit, existing data is untouched and the failure is announced
  accessibly (visual + live region). Never a half-imported archive.

## 12. Soft Delete
Deletion sets `deleted_at = timestamp`; never a physical `DELETE` in normal
flows. Recently Deleted = query `WHERE deleted_at IS NOT NULL`. Retention **30
days minimum**, no automatic destruction. Exports include soft-deleted records.

## 13. WCAG 2.2 AA Technical Requirements
Automated (Lighthouse, axe-core) + manual (keyboard, screen reader, focus
order), per flow. **Live regions exist in the DOM at all times** (not created at
update): `role="status"` / `aria-live="polite"` for non-urgent, `role="alert"` /
`assertive` for urgent errors. Errors `aria-describedby`-linked and visually
adjacent. Reveal & dialogs: move focus in, keep it there, restore to trigger on
close; everything keyboard-reachable with visible, contrast-compliant focus.

## 14. Mobile PWA Technical Requirements
Test safe areas (notches, rounded screens, bottom gesture areas), keyboard
behaviour (no fixed elements covering inputs, no lost focus/hidden buttons), and
standalone mode (works without browser chrome).

## 15. Final Technical Rule
Before approving any architecture decision, ask whether it improves reliability,
privacy, ownership, accessibility, and emotional experience. If not, do not
build it. Complexity is not progress. The best architecture is the one the
couple never notices.
