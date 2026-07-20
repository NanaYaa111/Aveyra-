# Research Dossier (Evidence Base)

Evidence base for Aveyra. Findings are graded so a blog claim and a randomised
trial are not treated alike: **A** = replicated experimental/longitudinal,
peer-reviewed · **B** = single studies / meta-analyses with bias risk · **C** =
practitioner consensus / vendor analytics · **D** = popular but weak/negative
empirical support (never load-bearing).

## 1. Competitive landscape
- **Paired** — category leader; the asynchronous daily-question **reveal** is the
  strongest engagement primitive. Complaints: dark-pattern billing/cancellation,
  generic questions. *Take the reveal; leave the dark patterns and generic bank.*
  (JMIR mixed-methods proof-of-concept, **Grade B**.)
- **Between** — the **compounding memory archive** is the moat; gets more valuable
  over time. Dated UI; weak on growth. *Treat the archive as a core asset — it
  needs no server (local-first compatible).*
- **Cupla** — logistics/calendar; solves coordination but is cloud-sync dependent
  and not an emotional product. *Do not attempt calendar merging early.*
- **Lovewick** — large free question library, but **the reveal dead-ends** (no
  follow-through), **no played/unplayed state**. *These complaints are a free
  roadmap: support a follow-up gesture and a card state machine.*
- **Lasting** — therapist-designed structured programmes; evidence structured
  content has a market, but a different (clinical) product.
- **Love Nudge / Gottman Card Decks** — the former is built on Five Love Languages
  (weak evidence, §2.6); the latter proves zero-friction can beat feature richness.

**Cross-cutting:** nobody has unified emotional + practical (most couples use two
apps); **retention (will both open it tomorrow) beats acquisition**; **two-sided
adoption is the category's hardest problem**; billing dark patterns are a live
risk; privacy is claimed everywhere and architecturally guaranteed almost nowhere
— *that gap is the differentiator.*

## 2. Relationship psychology
- **2.1 Bids & turning toward — Grade A.** Couples who stay together respond to
  bids ~86% vs ~33%. Highest-value intervention: increase noticing/responding on
  small moments — a design brief for micro-interactions, not grand features.
- **2.2 The 5:1 ratio — Grade A/B.** Stable couples ~5 positive:1 negative in
  conflict. Bias the product toward adding to the numerator (appreciation,
  noticing). **Never display a computed positive/negative ratio.**
- **2.3 Perceived partner responsiveness (PPR) — Grade A.** The mechanism most
  good features work through. Design test: *does this increase the chance one
  partner feels understood?* Streaks/badges/stat dashboards fail it.
- **2.4 Gratitude — Grade A, with a boundary.** Robustly linked to satisfaction,
  **but** manufactured/obligatory gratitude in a low-responsiveness relationship
  can backfire. Make it specific ("name a thing they did"), never a requirement.
- **2.5 Expressive writing — Grade B.** One partner writing about the relationship
  predicted still dating 3 months later; effect propagated to the untreated
  partner. **The best-supported feature that works with one person on one device.**
  Prompt for depth; frame toward accepting feelings.
- **2.6 Five Love Languages — Grade D. Do not build on this.** Primary-language,
  five-factor, and matching hypotheses all unsupported. Do not assign a type and
  filter content by it. **Same caution for attachment-style typing** (flattening a
  dimensional construct into four boxes is unsupported). Implement as open-ended
  needs, never a typology.
- **2.7 Does it work in app form? — Grade B.** RCT meta-analysis shows a
  significant, moderate effect, but with substantial heterogeneity and bias risk;
  the strongest programmes had human coaches. *Claim "designed on evidence-based
  principles," never clinical efficacy.*

## 3. Behavioural design
- **Overjustification risk:** extrinsic rewards can crowd out the intrinsic
  motivation (loving someone). That is the central design risk here.
- **Streaks — Grade B, genuinely two-sided.** Broken streaks increase abandonment;
  in a *couples* app a lost streak reads as a verdict on the relationship and makes
  one partner's inactivity a visible failure (the corrosive turning-away signal).
  **Recommendation: no conventional streaks.** Use **accumulation without loss**
  (totals that only increase); at most a soft, no-penalty presence indicator;
  **never surface one partner's non-engagement as a deficit.** Reward = the
  partner's response.
- **Habit:** anchor to existing routine, keep the minimum action tiny, one
  well-timed prompt beats many. PWA push is unreliable (esp. iOS) — do not
  architect retention around push.

## 4. UI/UX
- **The ritual pattern:** one thing to do today, takes minutes, same each day —
  beats a tab bar full of capabilities. Supports a small, deep product.
- **The asynchronous reveal** (both answer independently; neither sees until both
  submit) creates real anticipation, prevents anchoring, and gives a
  non-nagging incentive. Known failure: it dead-ends without a "moment after."
  Single-device Phase 1 → **pass-the-phone** (validate with real couples).
- **Warm, not saccharine** (avoid pink hearts/cartoon); emotional design over
  feature count; reduce, don't add; motion soft, short, and concentrated;
  respect `prefers-reduced-motion`.
- **WCAG 2.2 AA:** keyboard reveal flow, visible focus, dark-palette contrast
  (validate early), 200% text, **ARIA live region for the reveal**, colour never
  the sole state.

## 5. Technical
- **Storage:** Dexie over raw IndexedDB. Version schema from day one. Request
  `navigator.storage.persist()`; handle quota; **Safari/iOS is the risk platform.**
- **Encryption:** Web Crypto **AES-GCM** (fresh 12-byte IV each time), **PBKDF2**
  (high iterations) for passphrase keys, non-extractable keys in IndexedDB (never
  localStorage). Be honest: client-side crypto protects at rest/against casual
  access, not against a compromised bundle/XSS.
- **No "relationship health score"** — technically easy, demo-friendly, and the
  most dangerous feature in the space. Offer descriptive history, not evaluative
  scoring.
- **Single-device, reframed:** it sidesteps two-sided adoption — a positioning
  advantage. Export/import is the *only* backup path under local-only → a
  first-class Phase-1 feature.

## 6. Open questions research doesn't settle
Does the pass-the-phone reveal feel good? Right prompt cadence for a partnerless
journal? Minimum useful archive size? Cultural specificity (cited research is
largely Western/US — state this limitation openly).

---
*This dossier informs but does not override the Constitution. Where the
two-device amendment re-introduces sync, §5's honesty rules apply: E2EE must make
"the server can't read it" literally true.*
