# Volume 1 — User Research Findings & Product Validation

**Added:** 2026-07-24 · **Source:** author-run validation survey, **n = 26**
(25 for demographic items). Synthesises the survey into decision-linked themes and
maps each to Aveyra's features and Constitution principles. Companion to the
earlier [user-research-report.md](user-research-report.md) (n = 13); the two waves
agree on the central finding — the problem is *communication and understanding*,
not a lack of relationships.

> **Read this chapter with its limitations (below) in view.** The evidence is
> **directional and encouraging**, not statistically powered. Its value is that it
> shows Aveyra's principles were **grounded in real signal**, not invented — while
> being honest about sample size and bias so investor/《external》 use never
> overstates it.

---

## 1. Who answered
- **Age:** 88% **18–24** (22/25); one each Under-18, 25–34, 35–44. → represents
  **young adults**, Aveyra's initial target.
- **Relationship status:** Single **60%** (15/25) · Dating **28%** (7/25) ·
  Married **8%** (2/25) · Close friendship **4%** (1/25). → **most respondents are
  not currently in a couple**; they answered about people they care about in
  general. Treat couple-specific inferences with care (see §7).

## 2. Findings (verbatim counts)

| # | Question | Headline result |
|---|----------|-----------------|
| 1 | Importance of feeling deeply understood | **88.5% important+** — Very 57.7% (15) · Important 30.8% (8) · Neutral 11.5% (3) · none below |
| 2 | Frequency of intentional meaningful conversation | **~46% rarely/almost-never** — Rarely 42.3% (11) · Almost never 3.8% (1); Daily 19.2% (5) · Several/wk 26.9% (7) · Weekly 7.7% (2) |
| 3 | Ever felt you don't know someone close as well as you'd like | **84.6% yes/sometimes** — Yes 42.3% (11) · Sometimes 42.3% (11) · No 15.4% (4) |
| 4 | Challenges to maintaining connection *(multi)* | **Lack of communication 84.6% (22)** · Busy 61.5% (16) · Expressing feelings 57.7% (15) · Distance 46.2% (12) · Life changes 42.3% (11) · Forgetting moments 23.1% (6) · Repetition 15.4% (4) · Less intimacy 3.8% (1) |
| 5 | How memories are preserved today *(multi)* | Photos 57.7% (15) · Messages 53.8% (14) · Keepsakes 30.8% (8) · Social posts 11.5% (3) · **Journal only 11.5% (3)** · Don't preserve 11.5% (3) |
| 6 | Wished for a better way to… *(multi)* | Understand thoughts/feelings 65.4% (17) · Strengthen over time 61.5% (16) · Deeper conversations 50% (13) · Learn new things 34.6% (9) · Remember moments 26.9% (7) |
| 9 | Interest in the tool | **69.3% positive** — Definitely 30.8% (8) · Maybe 38.5% (10) · Not sure 19.2% (5) · Probably not 11.5% (3) · none "not interested" |
| 10 | Concerns about a digital tool *(multi)* | **Privacy 80.8% (21)** · Security 61.5% (16) · Unnatural 30.8% (8) · Too much effort 15.4% (4) · No value 7.7% (2) |

## 3. The core validation
Synthesised across findings 1–6 and the free-text (findings 7–8), the evidence
points to one thesis:

> **People don't believe they lack relationships. They believe they lack
> meaningful communication, emotional understanding, preserved memories, and
> intentional connection.**

That is precisely Aveyra's problem statement. Communication (84.6%) dwarfs conflict
as the reason connection fades — relationships **erode by silence, not by fighting**
— which validates a product built around *intentional conversation* rather than
messaging volume.

## 4. What makes a conversation meaningful (free-text themes)
Honesty · listening · trust · depth · shared beliefs · understanding · remembering
details · authenticity · mutual vulnerability. **Not once** mentioned: streaks,
likes, followers, notifications, engagement, gamification. This is independent,
unprompted support for the **calm, non-gamified** design philosophy.

## 5. Findings → decisions & features

| Finding | Supports | Constitution / feature link |
|---------|----------|-----------------------------|
| Understanding matters (F1); people feel unknown (F3) | The whole mission | North Star; "Daily Questions is the hero" |
| Meaningful talk is rare (F2); communication is the #1 gap (F4) | **Daily Questions** as the core loop | Volume 2 Part 3 §E; M2 Today loop |
| Expressing feelings is hard (F4, 57.7%) | **Private Journal**; gentle prompts | Write; owner-only journal (RLS) |
| People already keep photos/messages but journal rarely (F5) | **Shared Memories + Timeline** — one calm home to organise what they already keep | Story; Memory Vault; anniversaries |
| Want to understand & remember (F6) | Daily Questions · Reflection · Memories · Timeline · Search | across M2 |
| Meaningful = honesty/listening/depth, never engagement (F8) | **No streaks/scores/likes** | Permanent prohibitions (Part 2 §1.2); Q23 upheld |
| Privacy 80.8% / Security 61.5% the top concerns (F10) | Every privacy decision | Passwordless OTP (Q15); private journal; no ads; no behavioural tracking (Q17); minimal telemetry; field encryption at rest; EU region (Q20) |
| 69.3% interested (F9) | Concept demand | — |

## 6. Honest caveats — the tensions (guardian notes)
Recording these *strengthens* the chapter; omitting them would weaken it.

- **A minority asked for things the Constitution deliberately excludes.** Free-text
  expectations included *"some interactive games too,"* *"a fun quiz or board game
  or something interactive,"* and *"an AI tool that analyzes text and facial
  expression to see if someone is happy or a message was offensive."* The last
  directly conflicts with **no behavioural analysis / surveillance** and
  privacy-first (Part 2 §1.2; "support connection, never monitor"). **Disposition:**
  these are **out of scope by principle**, not a backlog. Aggregate finding 8
  (nobody values gamification/engagement) outweighs the individual requests; and
  emotion/"lie-detection" analysis is exactly the manipulative/surveillant pattern
  Aveyra refuses. *Emotional Wellness stays supportive and non-scored (Q23).*
- **"Relationships shouldn't be forced."** Several respondents resist any tool that
  pressures connection. **Design consequence:** reinforces **gentle, skippable**
  prompts, **no streak-shaming, no FOMO nudges** (already locked). Aveyra invites,
  never coerces.
- **Differentiation / trust doubts.** *"There are already tools," "the space is
  crowded," "not trusting a stranger with my relationship."* → **Messaging must be
  explicit:** Aveyra is **not** another social or messaging app — it is a **private
  space for exactly two people** to strengthen one relationship through meaningful
  conversation, shared memories, and reflection. Trust is earned via the privacy
  architecture, stated plainly.

## 7. Limitations (state these wherever the data is cited)
- **Small, self-selected sample** (n = 26; 25 demographic) — convenience sample,
  not random; **directional only**, no statistical power or confidence intervals.
- **Narrow demographic** — ~88% aged 18–24; findings may not generalise to older
  couples or long-married partners.
- **Mostly single respondents** (60%) answering about relationships in general, not
  a couple using a two-person product — so couple-specific behaviour is inferred.
- **Some low-effort free-text** ("Phone," "Ghh," "Mm," "Get money closer to me")
  indicates a few non-serious responses; qualitative themes are reported, not
  weighted.
- **Multi-select percentages** sum past 100% by design (findings 4, 5, 6, 10).
- **One item mis-spelled** in the instrument ("Sonetimes") — recorded as
  "Sometimes."

## 8. Recommended use
Cite as **early, encouraging validation** that Aveyra's principles track real
signal — pairing the two waves (n = 13 + n = 26) — while always carrying the §7
limitations. Do **not** present as proof of market demand or as a feature mandate;
the free-text expectations are filtered through the Constitution's principles, not
adopted wholesale. A larger, couple-focused follow-up (targeting people currently
in relationships, across ages) would materially strengthen the evidence base.
