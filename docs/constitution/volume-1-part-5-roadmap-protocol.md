# Volume 1 — Part 5: Phase 1 Roadmap, Workflow, Testing Gates, Code Review & Claude Code Execution Protocol

Defines how principles become implementation, and prevents the project from
becoming a collection of features. Every implementation decision must preserve
the foundation: emotional safety, privacy honesty, offline ownership,
accessibility, simplicity, reversibility.

## 1. Development Philosophy
- **1.1 Build the foundation before features.** Dependency order:
  **Foundation → Design System → Storage Layer → Core User Flows → Polish →
  Validation.** Never "beautiful screens → broken data layer → security problems
  → rebuilding."

## 2. Phase 1 Goal
A complete single-device relationship experience *(amended: two-device-ready)*:
open the app, create the relationship profile, answer a daily question,
experience the reveal, save moments, write privately, export the archive, recover
deleted content — all without requiring internet during use.

## 3. Development Sequence
- **Milestone 1 — Project Foundation:** app setup, TS config, PWA config, dev +
  testing environments, accessibility tooling. *Required before UI work.*
- **Milestone 2 — Design System:** tokens, typography, color, spacing, component
  foundations, light + dark (per Part 2).

## 4. Mobbin Research Integration
Mobbin is a **UX research reference** — study proven interaction patterns; it is
**not** for copying screens/layouts or replacing product thinking. Before
designing a major flow, research navigation, empty states, forms, settings,
writing experiences, confirmation, and privacy interactions; extract interaction
principles; adapt to offline-first, relationship psychology, accessibility.
**Approval question:** *"Does this pattern make the couple's experience safer,
clearer, or more meaningful?"* If no, reject it.

## 5. Implementation Order
1. **Application Shell** — four-destination nav, fixed structure, keyboard
   accessible, mobile-first, responsive.
2. **Local Database** — initialization, schema versioning, CRUD, soft delete,
   recovery. No screen manipulates storage directly.
3. **Onboarding** — max three screens; collect only partner name, start date,
   optional passphrase.
4. **Today** — daily question, answer writing, autosave, reveal, save to
   timeline. The reveal is the emotional center: focus management, screen-reader
   announcements, reduced-motion alternative.
5. **Story** — timeline, saved memories, relationship start date. No search,
   filters, or analytics.
6. **Write** — private writing space, autosave, editing.
7. **Settings** — profile, lock settings, accessibility options, storage
   information, export/import, Recently Deleted.

## 6. Development Workflow (no stage skipped)
**Research → Design → Accessibility Review → Implementation → Testing →
Emotional Review → Approval.**

## 7. Claude Code Execution Protocol
Claude Code behaves as a senior engineer following the constitution — a
**guardian of the product constitution, not a code generator.**
- **7.1 Before writing code:** read relevant constitution sections; confirm the
  feature is within scope; explain the implementation approach; identify risks;
  **wait for approval before major architecture changes.**
- **7.2 During implementation:** prefer simple solutions; avoid unnecessary
  dependencies; reuse existing components; follow design tokens; preserve
  accessibility; write maintainable code.
- **7.3 Must reject / challenge** requests that introduce: gamification,
  relationship scoring, ~~cloud dependency~~ *(amended: cloud allowed only as an
  E2EE relay)*, analytics, tracking, unnecessary complexity, or features outside
  the current phase — even if requested — until a volume explicitly authorizes
  them.

## 8. Testing Gates (feature incomplete until all pass)
- **Gate 1 Functional:** correct behavior, data persistence, offline operation,
  recovery after refresh.
- **Gate 2 Accessibility:** automated (axe, Lighthouse) + manual (keyboard,
  screen reader, focus order).
- **Gate 3 Privacy:** no unnecessary data collection, encryption behavior, honest
  privacy messaging.
- **Gate 4 Emotional:** does this create pressure, judgment, comparison, or
  anxiety? If yes, redesign.

## 9. Code Review Rules
Every change answers: **Product alignment** (improves the couple's experience?) ·
**Simplicity** (could this be simpler?) · **Accessibility** (can every user
complete this flow?) · **Offline** (works without connectivity?) · **Privacy**
(is every claim technically true?).

## 10. Performance Standards
Feel instant. Avoid heavy dependencies, unnecessary animations, large bundles,
slow local queries. Motion only where emotionally meaningful: reveal, navigation
transition, save confirmation.

## 11. Documentation
Every major technical decision documents: why it exists, alternatives considered,
tradeoffs, future impact. Avoid undocumented complexity.

## 12. Phase 1 Completion Checklist
- **Product:** four-destination navigation, onboarding, daily question, reveal,
  timeline, writing, export/import, Recently Deleted.
- **Technical:** offline-first, encrypted local storage, schema versioning, error
  handling, PWA support.
- **Accessibility:** WCAG 2.2 AA verified, keyboard complete, screen reader
  tested, reduced motion supported.
- **Design:** light + dark complete, Mobbin-informed patterns reviewed, product
  identity preserved.

## Final Rule
Claude Code is **a guardian of the product constitution.** The goal is not "build
more features" — it is *"build the smallest, safest, most meaningful relationship
experience possible."* Every line of code must serve that purpose.
