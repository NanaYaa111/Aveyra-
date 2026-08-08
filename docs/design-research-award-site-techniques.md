# Evaluating "award-site" techniques against Aveyra

**Source:** *The One Prompt That Can Upgrade Your Website Into An Award-Winner*
(@codergirl.megha, 14pp) — a prompt pack for building Awwwards-tier sites:
Three.js / React Three Fiber, GSAP + ScrollTrigger, Lenis, Spline, Theatre.js,
Aceternity UI / Magic UI / shadcn-based component libraries, Cobe globes,
preloaders, cinematic scroll, custom cursors.

**Verdict: adopt three ideas, reject the stack.** The document is competent at
what it sets out to do. What it sets out to do is the opposite of Aveyra's
purpose. An award site is designed to be *looked at*; Aveyra is designed to
disappear so two people can talk to each other.

---

## Adopted

### 1. One accent, one curve, motion scaled to size (§06)
The strongest idea in the document, and it validates what's already built: a
single `--color-accent` used for every interactive element, a single `--ease`
reused everywhere, and duration tokens rather than per-component guesses.

Acted on: the two hardcoded `3.2s ease-in-out` values in `illustrations.tsx`
were the only motion in the app bypassing the token system. They now read from
`--dur-ambient` / `--ease-ambient`. The ambient loop deliberately keeps a
symmetric ease — the shared `--ease` is a decelerating entry curve and reads
wrong on a repeating animation, so this is centralisation, not a naive swap.
Duration tokens are now commented with the size rule they encode.

### 2. Ship-time performance rigour (§10)
Genuinely aligned with the goal of opening anywhere on anything: test on real
mid-range hardware rather than a dev machine, watch mobile Lighthouse rather
than desktop, keep LCP under 2.5s and CLS near zero, animate `transform` and
`opacity` rather than `top`/`left`. Folded into the shipping checklist in
`docs/deploying.md`.

### 3. Native View Transitions over an animation library (§11)
Noted for later. If cross-route continuity is ever wanted, the browser's own
View Transitions API is the way — no library, no bundle cost, and it degrades
silently where unsupported. Not adopted now: nothing in the current experience
is asking for it.

---

## Rejected, and why

| Technique | Why it can't come in |
| --- | --- |
| Three.js / R3F / Spline 3D scenes | ~600KB+ of JS before a single feature. The whole app is 2.1MB today and must open on a mid-range phone on a slow connection anywhere in the world. The document concedes the problem itself in §10 ("where 3D sites die on mobile") and answers it with device-detection fallbacks — complexity in service of decoration Aveyra doesn't want. |
| GSAP + ScrollTrigger + Lenis | Smooth-scroll wrappers take scroll away from the browser and hand it to JS. That breaks native scrolling behaviour, assistive tech, and keyboard paging, for an aesthetic Aveyra doesn't want. |
| Pinning, scrubbing, horizontal scroll-jack (§04) | Scroll-jacking overrides a control the user owns. Aveyra's screens are short, quiet and read top-to-bottom. |
| Preloader with a **faked minimum 2.5s** (§05) | This is a dark pattern by the constitution's definition — deliberately spending the user's time to manage an impression. Prohibited outright, regardless of how common it is. |
| shadcn/ui, Aceternity UI, Magic UI, Cult UI (§07) | Q24 settled this: a bespoke, zero-dependency component layer. The components are already built, tested, and accessible. |
| Cobe / 3D globes, bento "wow" grids | Aveyra has two users who know each other. A rotating globe communicates nothing to them. |
| Custom cursor, hidden native scrollbar (§11) | Both remove affordances people rely on, including assistive-tech and motor-impaired users. Straight accessibility regressions. |
| Grain + vignette "fake depth", magnetic buttons (§11) | Decoration that pulls attention toward the interface and away from the content. Directly against calm technology. |
| Ambient audio cues (§11) | Unrequested sound in an app people use in bed, on a bus, next to a sleeping partner. |
| Text-scramble intros (§05) | Animated garbled text is hostile to screen readers and to anyone with a reading difficulty. |

## The structural gap

The document never mentions `prefers-reduced-motion`, WCAG, contrast, keyboard
access, or screen readers — in fourteen pages about interface. Aveyra honours
reduced motion globally, is verified against WCAG 2.2 AA by axe on every screen
in CI, and had its palette contrast-checked before it shipped. A source silent
on all of that can inform Aveyra's craft, but cannot set its direction.
