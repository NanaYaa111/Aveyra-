# Survey analysis — "Understanding Human Connection" (n = 27)

Second export of the connection/communication survey. Read alongside the
earlier n=26 chapter in Volume 1; the shape of the findings is consistent.

---

## The headline everyone will misread

**Only 33% said they were "definitely interested"** in a tool like this. Taken
flat, that is a weak signal. The cross-tab says otherwise:

| Relationship status | Definitely | Maybe | Not sure | Probably not |
| --- | --- | --- | --- | --- |
| **Dating** (7) | 4 | 3 | 0 | 0 |
| **Married** (2) | 1 | 0 | 1 | 0 |
| **Single** (16) | 4 | 7 | 3 | 2 |
| Close friendships (1) | 0 | 0 | 0 | 1 |

**Every single respondent currently in a relationship was positive — zero
negatives.** All of the scepticism came from people who are not the product's
user. Among the actual target (dating + married, n=9), 8 of 9 were interested.

That is the real number, and it is a strong one. It also means **this sample
cannot answer feature questions**, because 61.5% of it is single people
speculating about a two-person tool they have no occasion to use.

## Sample

n = 27 · **88.5% aged 18–24** · **61.5% single**, 26.9% dating, 7.7% married.
Young, overwhelmingly not-in-a-relationship. Treat as directional only.

## What holds up

**The problem is real and it is the one Aveyra is built on.**

- **88.9%** say feeling deeply understood is important or very important.
- But **48.1%** rarely or almost never have meaningful conversations.
- **85.1%** have felt they don't know someone close to them as well as they'd
  like (44.4% yes, 40.7% sometimes).

The gap between valuing depth and practising it is the whole opportunity, and it
is what a one-question-a-day ritual exists to close.

**Barriers, ranked:**

| | |
| --- | --- |
| Lack of communication | **85.2%** |
| Busy schedules | 63.0% |
| Difficulty expressing feelings | **59.3%** |
| Distance | 48.1% |
| Changes in life circumstances | 40.7% |
| Forgetting important moments | 25.9% |
| Repeating the same conversations | 14.8% |

"Difficulty expressing feelings" at 59.3% is the strongest support in the data
for a low-effort prompt: a supplied question removes the blank page, which is
the thing people are actually stuck on.

**What people wish they could do better** — note the ordering:

| | |
| --- | --- |
| Understand someone's thoughts and feelings | 63.0% |
| Strengthen a relationship over time | 63.0% |
| Have deeper conversations | 51.9% |
| Learn new things about someone close | 37.0% |
| **Remember important moments** | **25.9%** |

Memory preservation is dead last. This is direct support for the existing
framing — **Daily Questions is the hero; Memories are the outcome.** Leading
with an archive would be leading with the thing people want least.

## What should worry us

**Privacy is the dominant objection, by a distance.**

| | |
| --- | --- |
| Privacy concerns | **81.5%** |
| Security concerns | **59.3%** |
| It may feel unnatural | 33.3% |
| Too much effort | 14.8% |
| No value / prefer traditional | 7.4% |

Four in five name privacy. Aveyra's current position (Q26, staged privacy) is
plaintext-under-RLS with at-rest encryption and **no end-to-end encryption claim
at launch**. That is defensible and honestly documented, but it is squarely
against the strongest thing this sample said. Two implications:

1. Privacy has to be *shown*, not asserted — in onboarding, in Settings, in
   plain language, including what Aveyra cannot see and what it can.
2. E2EE deserves to be treated as a demand-driven roadmap item, not a nicety.

**"It may feel unnatural" at 33.3%** is the quiet one. A third of people expect
a tool like this to make closeness feel performed. That is an argument for the
calm, unadorned direction and against anything that gamifies the relationship.

## Requests that cannot be built

The open-ended answers included several popular ideas that the constitution
forbids, and they should be recorded as refused rather than quietly dropped:

- *"tell when one is lying"*, *"knowing why people hide certain things from
  you"*, *"an AI tool that analyzes text and facial expression to see if someone
  is happy or a message was offensive"* — these are **surveillance of a
  partner**. Aveyra is relationship support, explicitly not monitoring. Building
  any of them would make the product a tool for control.
- *"a game or event... a fun quiz or board game"*, *"interactive games"* (2
  mentions) — **gamification**, prohibited under Q23.

Popular demand is not a mandate. Worth noting the same respondents who asked for
these also named privacy as their top concern; they want to be protected and to
inspect, which is the ordinary contradiction, and the constitution resolves it in
favour of protection.

## What people actually mean by "meaningful"

Free-text on what makes a conversation special clusters tightly, and none of it
is about features:

> *"When we both listen"* · *"actually listening"* · *"Remembering the tiny
> details about the person"* · *"mutual vulnerability and thoughtful
> engagement"* · *"when they are honest"* · *"When we talk about things that are
> deeply tied to who we are"* · *"consistency"*

Listening, honesty, vulnerability, consistency, small remembered details. Every
one of those is a reason to keep the interface quiet and the prompt good.

One answer describes the built product almost exactly:

> *"I would expect it to allow two people chat, share moments privately without
> any external factors involved. Just two people chatting and building a
> connection."*

## Why this survey cannot decide the feature roadmap

Three reasons, all fixable in the next round:

1. **Wrong sample.** 61.5% single. They cannot report on a two-person habit.
2. **No feature questions.** Nothing asked about specific capabilities, so
   there is nothing to rank.
3. **The open question failed.** *"What would you expect it to do"* returned
   mostly unusable text — *"Phone"*, *"speak"*, *"Get money closer to me"*,
   *"I don't know"* (×3). Broad prompts to a non-target sample produce noise.

See `survey-3-feature-form.md` for a follow-up built to answer the feature
question specifically.
