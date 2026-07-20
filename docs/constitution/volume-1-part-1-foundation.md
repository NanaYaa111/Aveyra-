# Volume 1 — Part 1: Foundation

*Product vision, core principles, AI operating rules, fixed tech stack, Phase 1 scope.*

## Purpose
Establishes the permanent engineering constitution for building an
**offline-first couples platform**. Defines product vision, architecture
principles, execution rules, quality standards, and the fixed technology stack.

## 1. Product Vision
Build the world's most trusted offline-first couples platform that strengthens
relationships through meaningful shared experiences, privacy, beautiful design,
and thoughtful psychology.

## 2. Core Principles
Privacy-first · Offline-first · Accessibility-first · Mobile-first ·
Performance-first · Simplicity over complexity · Incremental delivery.

## 3. AI Operating Rules
- Build only the current phase.
- No placeholder components.
- No empty folders.
- Stop after each phase and wait for approval.
- Research only architecturally significant decisions.

## 4. Fixed Tech Stack
Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion,
Dexie.js, Zustand, React Hook Form, Zod, PWA, Vitest, ESLint, Prettier, pnpm.

> **Author-sanctioned deviations** (see Decisions Log in README): the
> meta-framework (Next.js → proposed Vite) and component library
> (shadcn/ui → bespoke) are being adjusted for this static, offline-only PWA.
> All other stack items stand.

## 5. Architecture
Feature-based folders · local-first storage · clean separation of UI, business
logic, and persistence · avoid unnecessary abstractions.

## 6. Phase 1 Scope
Project setup · onboarding · local relationship profile · Dexie schema ·
daily-question feature end-to-end. **Single-device only.**
