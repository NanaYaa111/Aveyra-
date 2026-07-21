# Volume 1 — Part 4: Database Schema, Data Models, Application Architecture, Technology Stack & Implementation Rules

The permanent technical blueprint. The architecture exists to serve the
couple's experience; the codebase must never become more complicated than the
product requires.

> **Superseded in part by the amendments** — see
> [`amendment-2026-07-20-two-device.md`](amendment-2026-07-20-two-device.md) and
> the governing [`amendment-2026-07-21-web-first-two-device.md`](amendment-2026-07-21-web-first-two-device.md).
> The single-device data model below is extended (not discarded) with the
> two-device identity model; the backend is Supabase with staged privacy; the
> schema follows the neutral `participants` model and three content classes
> (Volume 2 Sections E–P). All emotional-safety and simplicity rules stand
> unchanged.

## 1. Application Architecture Principles
- **1.1 Architecture follows UX.** It mirrors the four permanent destinations
  (Today, Story, Write, Settings) without creating unnecessary boundaries.
- **1.2 Layered structure (Phase 1):**
  - **Presentation** — Pages, Components, Accessibility, Themes
  - **Application** — User Actions, Validation, State Management, Business Rules
  - **Domain** — Relationship Logic, Timeline Rules, Delete Rules, Export Rules
  - **Data** — Database Access, Encryption, Import/Export, Storage Management
  - **Platform** — Browser APIs, PWA Features, Device Capabilities

## 2. Technology Stack Requirements
Prioritize stability, accessibility support, long-term maintainability, offline
capability — **not** trendiness, developer excitement, or maximum complexity.
- **2.1 Frontend:** a modern component-based framework (see Part 1 fixed stack →
  **Next.js 15 / React 19**, static export). Justify bundle size, a11y tooling,
  productivity.
- **2.2 Language: TypeScript** — type safety reduces data corruption, migration
  mistakes, unexpected states.
- **2.3 Styling: design tokens + component-level system + theme variables.**
  Never `background-color: #xxxxxx` in a component. Use `color.background.primary`,
  `color.text.secondary`, `spacing.large`, `radius.card`.
- **2.4 Database: IndexedDB through a reliable abstraction layer** (Dexie). A
  Database Service owns create/update/query/delete/export. **The UI must never
  directly communicate with IndexedDB.**

## 3. Database Design
Standard fields on every entity: `id`, `created_at`, `updated_at`, `deleted_at`,
`schema_version`.

- **3.2 RelationshipProfile** — `partner_name`, `relationship_start_date`.
  Collect only these. **No** gender assumptions, relationship labels, or personal
  questionnaires.
- **3.3 Question** — `question_text`, `date_available`. Questions are
  **invitations**; never imply performance, success, or failure. *(Amendment: use
  `category`/`theme`, not `difficulty`.)*
- **3.4 Answer** — `question_id`, `response_text`, `author`. The `author` field
  is for device context only; it must not create rankings, comparison, or
  activity tracking.
- **3.5 RevealSession** — `question_id`, `partner_one_completed`,
  `partner_two_completed`, `revealed`. No waiting counters, completion scores, or
  time pressure.
- **3.6 Memory** — `title`, `description`, `memory_date`, `image_reference`.
  **Max one image per memory** (Phase 1).
- **3.7 JournalEntry** — `content`. No public visibility, sharing indicators, or
  engagement statistics.
- **3.8 DeletedItem** — `original_entity`, `original_id`, `deleted_at`,
  `restore_available`. Supports Recently Deleted, undo, recovery.
- Plus **AppSettings**, **ExportRecord**.

## 4. Application State Management
Separate: **UI state** (modal open, current tab, animation) · **Domain state**
(memories, answers, relationship profile) · **Storage state** (encryption status,
storage availability). Never mix button loading state with database saving state.

## 5. Component Architecture
Reusable, accessible, tested, theme-aware. Required base components: Button,
Input, Textarea, Card, Modal, Dialog, Toast, Navigation, EmptyState,
LoadingState, ErrorMessage. Every component: accessibility (keyboard, focus,
semantic HTML, SR labels), responsive (mobile portrait/landscape, desktop),
themes (light/dark).

## 6. Routing
`/today`, `/story`, `/write`, `/settings`. No additional primary routes.
Features belong inside these areas.

## 7. Offline Data Flow
Correct: **User Action → UI Update → Domain Validation → Database Transaction →
Confirmation Feedback.** Never Action → Server Request → Wait → Update. The
application must never depend on remote responses. *(Amendment: sync is an
enhancement layered on top of the local write, never in the critical path.)*

## 8. Autosave Writing
Typing → **debounced save** → local database → quiet "Saved" indicator. No save
button required for long writing; no lost drafts; no warning after accidental
refresh.

## 9. Error Handling
Translate technical errors. `QuotaExceededError` → "Your device is out of space
for Aveyra. Export your memories or remove some photos to continue." Never expose
stack traces, error codes, or developer terminology.

## 10. Testing Requirements
Unit (data rules, validation, export logic, delete recovery) · Integration (DB
operations, offline behavior) · Accessibility (keyboard, screen reader, focus
order) · **Manual Emotional Review** (Does this feel calm? Does it create
pressure? Does it respect privacy?).

## 11. Development Discipline
Before any new code: Is this required by the current phase? Does it improve the
couple's experience? Can it be simpler? Does it preserve reversibility? Does it
maintain accessibility?

## 12. Forbidden Technical Patterns
- ~~Premature backend (API server, cloud database, user accounts)~~ →
  **amended:** a backend exists *solely* as an E2EE sync relay; accounts are
  minimal identity for pairing. See amendment.
- **Tracking, analytics, telemetry, third-party scripts** — still forbidden.
- **Relationship scoring, metrics, activity dashboards, engagement scores** —
  still forbidden.
- Frameworks chosen only for popularity; large dependencies without
  justification — still forbidden.

## 13. Phase 1 Implementation Boundary
Included: project setup, TypeScript config, PWA setup, offline database,
encryption foundation, relationship profile, Today screen, daily-question flow,
reveal interaction, Story empty state, Write empty state, Settings, export/import,
soft delete, Recently Deleted, accessibility verification.
~~Not included: synchronization, accounts, multiple devices~~ → **amended** (now
in scope as foundations; live sync per milestone plan). Still excluded:
notifications, search, social features, AI relationship analysis.

## Final Engineering Rule
The codebase makes the right behavior the **easiest** behavior. A developer
should not need discipline to avoid harmful features — the architecture itself
prevents them. Every technical decision answers: *"Does this protect the
couple's experience, ownership, privacy, and trust?"* If not, do not build it.
