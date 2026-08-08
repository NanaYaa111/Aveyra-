# Survey 3 — feature prioritisation (ready to paste into Google Forms)

Built to answer one question the last survey structurally couldn't: **which
features earn their place.** Copy each block into a Google Form question of the
stated type.

## Design rules this follows

- **Screen first.** The last survey was 61.5% single. People not in a
  relationship cannot report on a two-person habit; their answers add noise, not
  sample size.
- **Never ask "would you like X?"** Everyone says yes to everything. Every
  demand question here forces a trade-off — pick one, rank, or spend a budget.
- **Ask about last week, not about feelings.** Reported past behaviour predicts
  use; imagined future behaviour does not.
- **Test the privacy trade-off honestly**, since 81.5% named privacy and the
  product does not yet claim end-to-end encryption.
- **Keep it under five minutes** or the completion rate collapses.

---

## Section 1 — Screening

**Q1.** Are you currently in a romantic relationship?
*(Multiple choice — required)*
- Yes, and we live together
- Yes, and we live apart
- Yes, long distance (different cities or countries)
- No

> **Set form logic: if "No" → skip to the end.** Thank them and submit. Their
> answers would dilute everything that follows.

**Q2.** How long have you been together?
*(Multiple choice)* — Under 6 months · 6 months–2 years · 2–5 years · Over 5 years

---

## Section 2 — Current behaviour (last 7 days, not in general)

**Q3.** In the past 7 days, how many days did you and your partner have a
conversation that felt genuinely meaningful — not logistics?
*(Multiple choice)* — 0 · 1 · 2–3 · 4–5 · 6–7

**Q4.** In the past 7 days, how often did you want to reach out to your partner
but didn't, because you couldn't think of what to say?
*(Multiple choice)* — Never · Once · 2–3 times · 4 or more times

**Q5.** When you and your partner talk, what usually starts it?
*(Multiple choice)* — Logistics (plans, chores, money) · Something one of us saw
or read · Checking in on each other · A problem that needs resolving · We rarely
start; it just happens in person

---

## Section 3 — The trade-off questions

**Q6.** Below are things an app for two people could do. **Pick the ONE you would
actually use this week.**
*(Multiple choice — required, single answer)*
- A shared question each day that you both answer privately, revealed once you
  both have
- A private thread just for the two of you
- A shared list of date ideas and plans
- A daily one-word check-in on how you're each feeling
- A saved archive of your moments together, with photos
- A private journal only you can see
- None of these

> This single question is worth more than any "rate each feature 1–5" grid.

**Q7.** Now pick the one you'd be **least** likely to use.
*(Same options — single answer)*

**Q8.** You have **10 points** to spend across these. Give more points to what
matters more. *(Grid: rows = the six features above, columns = 0/1/2/3/4/5)*

> A forced budget separates genuine preference from politeness. Anything that
> averages below ~1.5 is not worth building.

**Q9.** If the app did only ONE thing well, it should be…
*(Short answer — one sentence)*

---

## Section 4 — Notifications and reach

**Q10.** How would you want to find out your partner had answered the day's
question?
*(Multiple choice)*
- Only when I open the app — nothing should interrupt me
- A phone notification
- An email
- A text message
- I wouldn't want to be told at all

**Q11.** If your partner sent you a one-tap "thinking of you" with no reply
expected, how would that land?
*(Multiple choice)* — I'd love it · I'd like it occasionally · Neutral · It would
feel hollow or automated · It would feel like pressure

> Q10 and Q11 settle two open decisions: the delivery channel, and whether
> one-tap affection reads as warm or as hollow. Ask them plainly and accept the
> answer.

---

## Section 5 — Privacy, asked as a real trade-off

**Q12.** Which matters more to you?
*(Multiple choice)*
- Nobody but us can ever read our messages, even the company — even if that
  means losing everything if we both forget our passwords
- Being able to recover our data if we lose access, even if that means the
  company technically could read it
- I don't have a preference

> This is the honest form of the E2EE question. Asking "do you want your data
> encrypted?" gets 100% yes and tells you nothing.

**Q13.** Would you be comfortable using an app like this if it clearly stated
what it can and cannot see?
*(Multiple choice)* — Yes · Only if nobody at the company could read it · No,
I wouldn't store this anywhere digital

**Q14.** Anything an app like this should never do?
*(Paragraph — optional)*

> Included deliberately. The last round surfaced requests for lie detection and
> facial-expression analysis; this question surfaces the opposite instinct and
> gives you language for the privacy copy.

---

## Section 6 — Demographics (keep last)

**Q15.** Age range — Under 18 · 18–24 · 25–34 · 35–44 · 45+
**Q16.** Would you like to try it early? *(Short answer — email, optional)*

> Q16 is the only question that returns a hard number: how many people will
> hand over an email address for a product that does not exist yet. Treat that
> conversion rate as the truest demand signal in the whole survey.

---

## Reading the results

- **Q6 is the roadmap.** Whatever wins is the hero; the constitution already
  says that should be Daily Questions, and this either confirms it or is real
  evidence to revisit.
- **Q8 below ~1.5 average = cut it.** A feature nobody spends points on is a
  feature nobody opens.
- **Q4 sizes the pings idea.** If most say "never", the words-are-hard problem
  is smaller than assumed and the feature can stay quiet.
- **Q10 decides notifications**, which is currently blocked on exactly this.
- **Q12 decides E2EE priority.** If most pick unrecoverable privacy, staged
  privacy (Q26) needs revisiting sooner than planned.
- **Aim for 40+ responses from people who pass Q1.** Below ~30 the cross-tabs
  stop meaning anything — which is precisely what went wrong last time.
