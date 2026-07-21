# Volume 2 — Part 1: Product Overview & User Experience Specification

*Version 1.0 · Approved for Phase 1 Development.*
*(Written under the "Weave" working title — read as **Aveyra**.)*

## Purpose
Defines the product vision, UX philosophy, information architecture, navigation
model, target users, and Phase 1 scope.

## Product Overview
Aveyra is an **offline-first relationship platform** for couples focused on
meaningful conversations, private reflections, and shared memories.

## Vision
Become the most trusted relationship companion through **intentional
experiences**.

## Mission
Help couples grow together with a secure, privacy-first, offline application.

## Goals
Offline-first · privacy-first · simple UX · meaningful interactions · scalable
architecture.

## Target Users
Couples and individuals seeking private relationship reflection.
*(See the Positive Love research: the wellbeing evidence is not romance-specific,
which raises an open question about widening "partner" to "participants" — logged
as a decision for Milestone 2, not silently adopted.)*

## Core Principles
Privacy First · Offline First · Simplicity · Intentionality · Emotional Safety.

## User Journey
Install → Onboard → Relationship Setup → Today → Story → Write → Settings.

## Information Architecture
**Today · Story · Write · Settings**, plus Onboarding. (Matches the fixed
four-destination navigation from Volume 1 Part 2 §4.2.)

## Phase 1 Scope
Core offline features only. Excludes cloud sync, accounts, AI, and multi-device
support.
*(⚠️ Superseded 2026-07-21: the [web-first amendment](amendment-2026-07-21-web-first-two-device.md)
makes accounts, invitation, and cross-device sync **core**. AI remains excluded
— roadmap only, per the product strategy.)*

---

## 7. Product Principles (non-negotiable, take precedence over convenience/trends)
- **7.1 Every feature must strengthen human connection** — it must help two
  people understand each other, encourage meaningful communication, preserve
  memories, support healthy growth, or reduce relationship-maintenance friction.
  If it does none of these, it is not implemented.
- **7.2 Privacy is a product feature** — not just technical. Users share honest
  thoughts because they trust the space. Every interaction reinforces that trust.
- **7.3 Quality over quantity** — meaningful engagement, not frequent engagement.
  Encourage intentional participation, never continuous usage.
- **7.4 Calm technology** — quiet, focused, respectful of attention. **Never**
  endless scrolling, artificial urgency, manipulative notifications,
  attention-grabbing mechanics, or pressure to return. Users control when/how
  they engage.
- **7.5 Shared growth** — help users move forward *together*; celebrate progress,
  reflection, understanding — never competition or comparison.

## 8. Product Boundaries — what Aveyra is *not*
Not: a social-media platform · a public-sharing platform · a messaging app · a
dating app · a therapy/counseling service · a mental-health diagnostic tool · a
productivity app · a habit tracker · a cloud-storage platform · a replacement for
genuine human interaction. *Technology supports relationships; it does not
replace them.*

## 9. Relationship-Science Foundation
Aveyra creates opportunities for intentional communication and reflection rather
than trying to "fix" relationships. Guiding principles: curiosity strengthens
understanding · shared experiences strengthen bonds · reflection improves
communication · **consistency > intensity** · small moments accumulate into
lasting relationships · psychological safety encourages honesty · positive
interactions deserve preservation.

## 10. User Personas
- **Primary — Intentional Partners:** two people actively strengthening their
  relationship through better communication and shared experiences. Value
  meaningful conversation and privacy; want stronger trust, to learn more about
  each other, to preserve milestones. Challenges: busy schedules, repetitive
  conversations, forgetting moments, difficulty expressing deeper thoughts.
- **Secondary — Long-Distance Partners:** shared experiences despite distance,
  regular meaningful connection, memory preservation across time.
- **Future personas** — best friends, parent & child, mentor & mentee, siblings;
  tailored experiences that preserve the core philosophy. *(This directly
  supports the open `participants` vs `partner` schema decision — the product
  roadmap explicitly anticipates non-romantic one-to-one relationships.)*

## 11. Emotional Experience Framework (target feeling per surface)
- **Onboarding:** welcome · safe · curious · hopeful
- **Daily questions:** curious · comfortable · thoughtful
- **Shared answer reveal:** anticipation · discovery · understanding · appreciation
- **Creating memories:** gratitude · reflection · joy
- **Timeline:** nostalgia · pride · growth · perspective
- **Private journal:** safe · honest · calm · unjudged

*(This is the design brief for Milestone 2 — each flow is built to evoke its
row.)*

## 12. Success Metrics
- **North Star — Meaningful Shared Moments:** a completed interaction that
  contributes to understanding, reflection, or memory creation between two users.
- **Supporting:** daily-question completion, shared-memory creation, conversation
  completion, milestone participation, weekly active relationship spaces,
  retention over meaningful periods, satisfaction & trust.
- **Never** vanity metrics (screen time, notification engagement). These never
  drive product decisions. *(Consistent with the constitution's ban on scores and
  engagement mechanics — measured internally, never shown as relationship scores.)*

## 13. Feature Evaluation Framework (a proposal must pass ALL)
1. Strengthens meaningful human connection? 2. Respects privacy? 3. Aligns with
Aveyra's philosophy? 4. Avoids unnecessary complexity? 5. Long-term value over
short-term engagement? 6. Implementable offline-first? 7. Understandable for new
users? 8. Contributes positively to the emotional experience? 9. Sustainably
maintainable? 10. Would removing it noticeably reduce Aveyra's value?

---
**Consistency check:** nothing here conflicts with Volume 1, the two-device
amendment, or the research. It sharpens governance (§7, §13), draws hard product
boundaries (§8), and gives per-surface emotional targets (§11) that become the
Milestone 2 design brief. §10's future personas reinforce the open `participants`
question.
