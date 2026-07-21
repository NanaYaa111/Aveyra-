# Volume 2 — Part 2: Information Architecture & User Journey

*(Written under the "Weave" working title — read as **Aveyra**.)*

> ⚠️ **UNRESOLVED CONFLICT — navigation destinations (see §4).**
> This document specifies a **five-destination** navigation
> (Home · Questions · Memories · Journal · Profile). **Volume 1 Part 2 §4.2**
> specifies a **four-destination** model (Today · Story · Write · Settings) and
> states there is *"no fifth destination, ever."* The shipped app implements the
> four-destination model. **Pending the author's decision (logged in the README
> decisions section), Volume 1's four-destination model remains in force.** The
> five-destination content below is recorded but NOT yet adopted.

## 1. Purpose
Defines how information is organized, how users navigate, the relationship-space
lifecycle, the interaction between shared and private content, and the full user
journey from install to long-term use.

## 2. IA Principles
- **2.1 Clarity before complexity** — users never wonder "where do I go / where
  was that / what does this do." Features discoverable within a few interactions.
- **2.2 Shared vs private must be unmistakable.** Two categories:
  - **Shared space** (visible to both): daily questions, shared memories,
    timeline, milestones.
  - **Private space** (owner only): personal journal, draft reflections, notes.
  Users must always know which is which.
- **2.3 Navigation reflects user goals**, not technical implementation
  ("continue today's conversation," "look back at memories," "write personal
  thoughts," "manage settings").

## 3. Relationship Space Model
Every relationship has a **Relationship Space** (shared container): profile,
shared questions/answers, memories, timeline, milestones, shared settings. Each
user also has an independent **Personal Space**: private journals, drafts,
personal preferences, device-specific settings. *(This matches the two-device
amendment's data model and the shared/private encryption boundary.)*

## 4. High-Level Navigation — ⚠️ five destinations (DISPUTED)
| V2P2 destination | Purpose | Maps to V1's four |
|---|---|---|
| **Home** | Session start: greeting, relationship summary, today's question, recent activity, upcoming milestones | (part of) **Today** |
| **Questions** | Today's question, previous, saved favorites, categories (future) | (part of) **Today** |
| **Memories** | Gallery, photos, captions, milestones, filters/search | **Story** |
| **Journal** | Private entries, drafts, search, history (owner only) | **Write** |
| **Profile** | Relationship details, partner info, backup/restore, privacy, notifications, export/import, help, about | **Settings** |

The only structural change vs Volume 1 is **splitting Today into Home +
Questions** (the added fifth destination). Everything else is a rename.

## 5. User Journey (six stages)
1. **Discovery** — learn about Aveyra, build trust, create curiosity.
2. **Account creation** — first user creates a personal account + relationship
   space; app prepares a secure invitation.
3. **Partner invitation** — QR / short code; single-use, time-limited,
   cryptographically secure (Volume 1).
4. **Relationship activation** — invitation accepted → accounts linked → shared
   space active; each retains private content.
5. **First shared experience** — one guided shared activity; concludes by
   creating the relationship's first shared memory.
6. **Ongoing use** — daily questions, memories, private reflections, timeline,
   milestones.

> ⚠️ **Sequencing note:** Stages 2–4 (account + invitation + activation) are the
> **two-device flow**, which requires the backend deferred to a later milestone
> ("build local-first before sync"). Volume 1 Part 2 §13 defines **Phase-1
> onboarding** as ≤3 local screens (partner name, start date, optional
> passphrase) with **no account**. Reconciliation logged as an open decision.

## 6. Navigation Rules
Every primary destination always reachable · back navigation never loses data ·
unsaved work protected · critical actions confirmed · long operations show
progress · offline status always understandable · connectivity never blocks
access to stored information.

## 7. Relationship Lifecycle (refines the `status` enum)
- **Pending** — invitation created, partner not joined.
- **Active** — both connected, shared experiences available.
- **Paused** — one partner temporarily inactive / sync interrupted / renewal
  pending; shared history stays accessible.
- **Archived** — intentionally archived; read-only; memories & journals
  preserved; no new shared activity.
- **Closed** — permanently removed after explicit confirmation; follows Volume 1
  retention/recovery rules.

*(Current build uses `solo | pending | linked`; this richer lifecycle is adopted
when relationships/sync are built.)*

## 8. Research recommendations (accompanying this part)
Keep the product **narrow** (two-person, relationship-focused); **make privacy
visible** (clear controls/states/boundaries at every step); build around
**rituals, not feeds**; optimize for **reflection, not frequency**; design for
**slow, accumulating value**. Priority order: private shared spaces with strong
controls → thoughtful question/reflection flows → memory creation & timeline →
milestone/growth views → optional quiet reminders. Product rules: *if a feature
doesn't deepen connection, remove it; if it creates urgency, redesign it; if it
weakens privacy trust, reject it; if a calmer version exists, choose it.*
