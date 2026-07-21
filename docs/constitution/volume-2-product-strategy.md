# Volume 2 — Product Strategy & Positioning (survey-driven)

Closes Volume 2. Survey finding reframed the product: the real problem is **lack
of meaningful communication**, not lost memories. This sharpens positioning and
adds the product-level guardrails (principles, metrics, voice, entry criteria,
AI boundaries, North Star).

## 1. Core value proposition (official positioning)
> **Aveyra is a private space for two people to intentionally understand each
> other better through meaningful conversations, shared experiences, and a
> relationship story they build together.**

**Daily Questions is the hero feature; Memories are the natural outcome** (the
result, not the starting point). *(Reinforces the current build order — Today /
the daily question is the core ritual; Story accrues from it.)*

## 2. Product principles (every future feature must follow)
1. **Conversation before content** — encourage meaningful interaction, not passive
   consumption.
2. **Privacy by default** — protected without having to configure anything.
3. **Connection over engagement** — no features that exist only to raise usage.
4. **Quality over quantity** — one meaningful interaction beats many shallow ones.
5. **Build rituals, not habits** — intentional moments, never addictive behaviour.

## 3. Success metrics (relationship outcomes, not app usage)
Measure: % of daily questions answered **by both** partners · conversations that
lead to a saved memory · shared reflections created · **weekly active couples**
(not individuals) · **couple retention at 30 / 90 / 180 days**.
Explicitly **not**: DAU, time-in-app, notifications opened. *(Consistent with the
constitution's ban on engagement/vanity metrics and relationship scores — these
are internal product metrics, never shown to users as relationship judgments.)*

## 4. "Moments That Matter" framework
Categories that guide prompts, timelines, and reminders: first conversation ·
first memory · anniversary · birthdays · difficult conversations · long-distance
periods · celebrations · reconciliation after disagreement. *(Difficult
conversations / reconciliation handled supportively — never as scoring or
diagnosis.)*

## 5. Trust as a feature (privacy as identity)
Commitments: **no advertising · no selling user data · no public profiles · no
follower counts · no algorithmic feeds**; and **end-to-end encryption for
sensitive shared content**. Plain statement:
> **What happens in Aveyra stays between the two people who created it.**

> ⚠️ **Reconcile with staged privacy (Sections E–P):** launch privacy is
> **server-side encryption at rest + strict access controls**; **E2EE is the
> planned later stage for the *sensitive-content* class** (matches the 3-class
> taxonomy). Per the honesty rule, the product will **not claim E2EE until it is
> actually implemented** — early copy states the real protection (encrypted at
> rest, strict access, never sold), and the "stays between the two of you"
> statement is honoured by *no ads / no selling / no third-party access*.

## 6. Brand personality — voice
**Warm · calm · encouraging · honest · respectful.**
Avoid: being preachy · sounding like a therapist · cliché relationship advice ·
guilt through notifications. *(Extends the brand guide; governs all copy.)*

## 7. Feature entry criteria (a proposal must answer all)
1. What user problem does it solve? 2. Which survey finding supports it? 3. Which
product principle does it reinforce? 4. Does it increase understanding between
partners? 5. Can the product succeed without it? — *If it can't answer these, it
isn't added.* (Complements Volume 2 §13's evaluation framework.)

## 8. Future AI strategy — ROADMAP ONLY, do not build
Potential later uses: generate thoughtful prompts · suggest anniversary
reflection questions · summarise a year of memories into a story · surface
forgotten moments at the right time.
AI must **never**: analyse whether a relationship is "healthy" · judge either
partner · replace honest communication · make emotional decisions for users.
*(Aligns with the permanent ban on relationship scoring/diagnosis. Not in scope
for the current release.)*

## 9. Expand user research before release (action for the author, not a build task)
Current survey is small and skewed 18–24. Before the production version: aim for
50–100 responses; include more married couples, long-distance couples, couples
together 5+ years, and ages 25–45; then 10–15 short interviews to understand the
"why." *(Recorded as a product-ops recommendation; nothing to implement.)*

## 10. North Star
> **Every interaction in Aveyra should help two people know each other a little
> better than they did yesterday.**

Every design and engineering decision must support this.
