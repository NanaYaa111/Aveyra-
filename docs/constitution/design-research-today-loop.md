# Design Research — the Today daily-question loop

**Date:** 2026-07-24 · **Policy:** satisfies the [Design Research Policy](design-research-policy.md)
(research proven UX patterns → design proposal → approval) for the **Today** screen
before building it. Answers the four open questions (Q-T1…Q-T4).

## What proven products do
- **Paired** (≈8M downloads) — the canonical pattern: both partners answer the
  **same** daily question **independently**, and *you can only see your partner's
  answer once you've answered yourself* ("answer-to-unlock" reveal). A daily
  question is described as becoming a **"non-negotiable couple ritual."**
- **Gottman Card Decks** — deliberately **no onboarding, no progress tracking, no
  streaks**; calm, conversation-first. Confirms the anti-gamification stance.
- **BeReal** — enforces authenticity by **preventing edits/retakes**, and where a
  retake happens it is made **visible** ("honesty by design"); reveal is gated on
  posting first.
- **Streaks / pace comparison** — streaks do lift raw engagement, **but** the #1
  reason couples apps fail is *one partner stops*, and showing both partners'
  pace/streak side-by-side "creates a **tax on the relationship**" — the slower
  partner sees a constant reminder of the gap. Strong external support for our
  permanent no-streak / no-comparison rule (Q23).
- **Memory keeping** — automatic archives cause clutter ("organized photos you
  never look at again are still lost photos"); the memory-keeper pattern is to
  move *keepers* into a curated space. Favours intentional, minimal curation.

## Decisions (recommended, evidence-backed)

**Q-T1 — Reveal before Supabase → A: dev-simulate partner, clearly labelled.**
The answer-to-unlock reveal is the proven core (Paired). With no second device yet,
a **visibly dev-only** "simulate partner answered" control lets the full loop be
built and tested now. Per BeReal's "honesty by design," the simulation must **never
masquerade as a real partner** — it is labelled a dev tool and disappears the moment
Supabase is wired.

**Q-T2 — Cadence → A: one question per day, locked; no streaks, no pace UI.**
The daily-ritual cadence is what makes these apps stick. Crucially, we take the
ritual **without** the streak/comparison mechanics the research shows become a
relationship tax (and which Q23 already forbids). A dev-only "advance day" exists
for testing only.

**Q-T3 — Edit after submit → A: editable until reveal (no authenticity cost here).**
BeReal locks edits to prevent *performing for an audience*. Aveyra has no audience —
only your partner — **and the reveal gate already prevents gaming**: you cannot see
your partner's answer until both have submitted, so an editable-until-reveal window
never lets you tailor your answer to theirs. We therefore keep the **anxiety-reducing**
edit window with **no** authenticity downside. (If we ever want BeReal-style
transparency, "edited before reveal" is invisible and harmless; we won't surface it.)

**Q-T4 — Save as memory → A: optional, one tap (question + both answers + date).**
Automatic archiving invites the clutter the research warns about; blank-manual adds
friction that suppresses capture. One tap from the reveal — prefilled with the
question and both answers, titled/photo-able later — matches "memories are the
outcome" and the curated-keeper pattern.

## Guardrails carried into the build
- No streaks, scores, levels, or **visible pace/activity comparison** between
  partners (Q23; reinforced by the "relationship tax" finding).
- Skips stay **silent**; the question returns later (engine already does this).
- The dev-simulate + advance-day controls render **only** without a backend and are
  unmistakably labelled dev tools — never presented as real partner activity.

## Sources
- [Paired — official](https://www.paired.com/) · [WhistleOut review](https://www.whistleout.com/CellPhones/Apps/paired-app-couples-relationship-questions) · [Twine: question apps](https://www.twine-couples.com/question-apps-for-couples/)
- [Gottman Card Decks review](https://www.onedateidea.com/reviews/gottman-card-decks/) · [Gottman Institute](https://www.gottman.com/couples/apps/)
- [BeReal — TIME explainer](https://time.com/6167952/how-be-real-app-works/) · [Trill: authenticity update](https://www.trillmag.com/news/tech/bereals-new-update-is-patching-up-loopholes-to-keep-the-app-authentic/)
- [Couples-app retention / pace-mismatch insight](https://www.excellentwebworld.com/best-relationship-apps/) · [PairHabit](https://www.pairhabit.app/)
- [Automatic curation & clutter](https://medium.com/storyo/automatic-curation-of-photo-memories-through-unsupervised-learning-53cc985aa7ac) · [Techlicious: organizing photos](https://www.techlicious.com/tip/best-apps-photo-organization/)
