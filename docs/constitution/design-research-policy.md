# Design Research Policy (Volume 2 §2.X)

**Binding on the implementation AI.** Before any major screen or interaction is
designed, targeted research into established UX patterns must be conducted. The
purpose is **not to copy** interfaces, but to adapt proven interaction models to
Aveyra's privacy-first, calm, relationship-centered philosophy (connected, with graceful disconnect).

## Required research sources
- **Mobbin** — user flows, onboarding, empty states, forms, settings,
  navigation, authentication, profile, notifications.
- **Page Flows** — complete journeys, multi-screen flows, transitions.
- **Apple Human Interface Guidelines** — iOS navigation, controls, motion,
  accessibility.
- **Material Design 3** — Android components, layout, motion, responsive.
- **Nielsen Norman Group** — usability, IA, cognitive load, form design.
- **Laws of UX** — hierarchy, decision-making, interaction principles.

## Required workflow (every new feature/screen)
1. Identify the **user goal**.
2. Review comparable flows + platform guidance.
3. Note the patterns that fit Aveyra.
4. **Reject** patterns that conflict with privacy, calmness, or graceful-disconnect resilience.
5. **Present the proposed direction for approval before implementation.**

## Mandatory additions to every screen proposal
- **Pattern justification** — a short note on *why* each adopted pattern was
  chosen.
- **Accessibility checkpoint** — how the screen handles readability, touch
  targets, focus states, motion, and error recovery.

## Prohibited
Inventing layouts without precedent research · copying an app's UI verbatim ·
mixing unrelated patterns · prioritizing aesthetics over usability · ignoring
accessibility.

## Design philosophy
Every screen feels: calm · intentional · premium · warm · minimal · trustworthy.
The user is never overwhelmed. Interfaces support meaningful human connection
rather than maximize screen time.

---
## Implementation reality (honest tooling note)
- **Apple HIG, Material Design 3, NN/g, Laws of UX are publicly reachable** — I
  will fetch and cite them per screen.
- **Mobbin and Page Flows are login/subscription-gated**; I generally **cannot**
  fetch them from this environment. Where they're required, I will (a) say so
  explicitly, (b) substitute the accessible sources above plus first-principles
  pattern knowledge, and (c) invite the author to share Mobbin/Page Flows
  screens or exports, which I will then study directly. I will never claim to
  have researched a source I could not access.
- Each M2 screen therefore ships as: **research note → design proposal (with
  pattern justifications + accessibility checkpoint) → approval → implementation
  → the four testing gates.**
