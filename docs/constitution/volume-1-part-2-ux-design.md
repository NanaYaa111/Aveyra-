# Volume 1 — Part 2: UX Philosophy, Psychology, Design Language, Accessibility & Interaction Standards

The platform must feel: Safe · Personal · Warm · Trustworthy · Beautiful · Effortless.
Every interface decision must strengthen the user's connection with their partner.

## 1. UX Philosophy
- **1.1 Human-centered.** Designed around connection, communication,
  appreciation, reflection, shared memories, growth. Technology stays invisible:
  the user thinks *"this helps my relationship,"* not *"I am using software."*
- **1.2 Emotional design (BINDING — decides unnamed cases).** Encourage
  happiness, curiosity, affection, reflection, appreciation. Avoid pressure,
  anxiety, competition, guilt. **Permanently rules out:** XP/levels/ranks;
  consecutive-day streaks & loss framing; scores/grades/ratings of the
  relationship; leaderboards or comparison; features locked behind earned
  progress. Any feature generating pressure/anxiety/competition/guilt is
  rejected regardless of performance.
- **1.3 Simplicity over complexity.** Achieved by subtraction. Before adding a
  component, remove one. Usable without training.
- **1.4 Deliberate pace.** Fast: navigation, saving, opening the archive.
  Deliberately unhurried: revealing a partner's answer, writing a letter,
  deleting a memory. Speed is a tool, not a goal.

## 2. Relationship Psychology Framework
- **2.1 Meaningful interaction** over frequent interaction.
- **2.2 Positive reinforcement.** Recognition anchored to **real facts**
  (anniversaries, totals that only ever increase — entries, memories, duration).
  **Never** anchored to usage patterns; never "you missed"; never anything that
  can decrease. The reward for participating is the partner's response.
- **2.3 Nothing may render a partner as a deficit.** The interface must never
  present one partner's behaviour as a shortfall to the other. Forbidden:
  "waiting on them," "they haven't answered in 6 days," absence counters, any
  comparison. An unanswered question is a neutral open state, never a failure.
- **2.4 Privacy psychology.** Communicate ownership and safety honestly. True
  statements only: data stored on this device and encrypted at rest; **not**
  end-to-end encryption (no second device yet); no analytics/telemetry/
  third-party scripts. Overstating protection is worse than offering less.

## 3. Design Language
- **3.1 Visual identity:** love, trust, calmness, premium quality. Warmth
  through **restraint, not decoration**. Failure mode to avoid: pink hearts and
  cartoon illustration.
- **3.2 Layout:** clean spacing, clear hierarchy, comfortable reading, peaceful
  not crowded. **Mobile-first, single column, generous vertical rhythm.**
- **3.3 Typography:** carries the character (text-heavy app). Display (question
  of the day, distinctive), Heading, Body (measure ~60–75 chars), Label. Text
  scales to 200% without loss; no text baked into images; user writing never
  truncated in the archive.
- **3.4 Color:** warm, restrained — deep warm-neutral base + a single muted
  accent used sparingly. Status colors (success/warning/error) apply to
  **system operations only, never to the relationship.** Light + dark both ship
  (dark not an afterthought); contrast verified in both; color never the sole
  carrier of meaning; **all color via design token, never a literal value in a
  component.**
- **3.5 Components:** reusable, consistent, accessible, responsive. No one-off
  components. Do not build components ahead of the phase that uses them.

## 4. Interaction Standards
- **4.1 User actions:** every interaction has a clear result. Feedback is quiet
  and proportionate — no celebration language, no exclamation marks, no scores.
  ("Memory saved." / "Your response has been saved.")
- **4.2 Navigation — fixed at four destinations:** **Today · Story · Write ·
  Settings.** Position/order never change, even in empty states. Always a way
  back. **No fifth destination** — anything that seems to need one belongs
  inside one of the four, or is out of scope.
- **4.3 Feedback:** proportionate. Local ops are near-instant — no loading state
  for fast operations; no spinner under 200 ms. Loading states only for image
  decoding, export, import.
- **4.4 Reversibility (safety requirement).** Soft delete for all user content.
  **Recently Deleted** retains 30 days. **Undo, not confirm** — deletion is
  immediate with an undo affordance ≥ 10 s. Editing is non-destructive where
  feasible (edited entry keeps original timestamp). **Nothing is ever deleted
  automatically.** Export always available from Settings in one action.

## 5. Offline-First Experience
Works with no network, always; no code path assumes otherwise.
- No feature blocked by connectivity; no connectivity indicators/offline
  banners/"reconnecting" states; never tell the user to check their connection.
- **Synchronization language is prohibited until synchronization exists.** No
  "Saved locally. Will sync when connected." / "Updating your shared space."
- Honest messages: "Saved." · storage low → "Your device is running low on
  space for Weave." · persistence not granted → "Your browser may clear this
  data. Install the app and export regularly to keep your memories safe."

## 6. Accessibility — WCAG 2.2 AA (verified per phase, never deferred)
- Contrast 4.5:1 body / 3:1 large text & UI, both themes. Text scalable to 200%.
- Full keyboard operability; visible focus indicators meeting contrast; touch
  targets ≥ 24×24 CSS px (primary 44×44); single-pointer alternative to any
  drag; reduced motion honoured everywhere.
- Cognitive: simple language, predictable behaviour, consistent help, no
  re-entry of provided info; the passphrase lock must never be a puzzle/memory
  game.
- **The reveal is a dynamic content change — it MUST be announced via an ARIA
  live region and tested in the same phase it is built.**
- Every phase: automated scan + manual keyboard pass + screen-reader pass over
  that phase's new flows. (Automated tools catch ~⅓ of issues.)

## 7. Mobile-First Standards
Touch-friendly controls, responsive layouts, fast loading, efficient storage.
Desktop enhances, doesn't define. Primary presentations (not edge cases):
standalone display (no browser chrome), safe-area insets on notched devices,
mobile keyboard viewport behaviour (breaks fixed layouts if untested).

## 8. Animation & Motion
Motion improves understanding. **Budget concentrated in three places:** the
reveal (emotional center), page transitions (soft, short, directional), save
confirmation (brief settle then fade). Everything else instant. 150–300 ms
except the reveal. Reduced motion → opacity-only or instant; the reveal must
remain fully comprehensible with no motion. Meaning cannot live in the animation.

## 9. Empty States
Never "No data available." Explain why it's empty and name exactly one small
action. The app starts genuinely empty — the empty state is the first
impression and must look designed. Onboarding captures the relationship start
date, so the timeline is never truly empty (a real entry, not manufactured
progress).

## 10. Error Experience
Human-friendly; never expose technical errors. Retry language only for genuinely
transient errors. Examples: quota exceeded → "Your device is out of space for
Weave. Export your memories or remove some photos to continue." · private
browsing → "Your browser is blocking local storage… Try a normal browser
window." · wrong passphrase → "That passphrase didn't match. There is no way to
recover it if it's lost." · invalid import → name the specific problem, never
import partially. **Prohibited copy:** error codes; permission language (there
are no permissions); password language (there is no account).

## 11. Content & Voice
Second person, present tense, short sentences. No exclamation marks in system
copy. Emoji only where the user puts them. Prompts invite, they do not instruct.
The platform never speaks for the couple, never assesses them, never assumes the
state of the relationship.

## 12. Quality Standards (release gate)
Must follow the design language, support accessibility, work offline, provide
feedback, maintain emotional consistency, avoid complexity. Plus:
- **Safety:** Could a user feel judged? If one partner stops, does the other see
  a failure? Is every destructive action reversible? Does anything score/grade/
  rank the relationship?
- **Honesty:** Is every claim literally true? Is progress real, not manufactured?
- **Craft:** Works with an empty DB? With three years of data? State change
  announced to a screen reader? Keyboard end-to-end? Contrast verified both
  themes? Reduced motion honoured? Design tokens only?
- **Discipline:** Was anything built that this phase does not ship?

## 13. Phase 1 Application
**In scope:** arrival screen (one sentence of value, one action) · onboarding
(≤3 screens, <45 s: partner name, start date, optional passphrase) ·
four-destination shell (Story/Write may show only empty states) · home (today's
question, one line of context, a few recent memories) · daily question
end-to-end (answer, reveal, optional save) · autosaving writing surface · soft
delete + undo + Recently Deleted · export/import · light + dark themes · full
WCAG 2.2 AA for every flow above.
**Out of scope (do not build or scaffold):** sync/pairing/second device;
notifications; search; media beyond one image per memory; everything prohibited
under §1.2.
**First run:** no walkthrough. Contextual guidance at first encounter,
revisitable from Settings. The first session ends with the user having made
something real (one answered question), not a completed tutorial.
**The Phase 1 reveal:** with one device there is no async reveal. Implement
**pass-the-phone** — one partner answers and hands over; the second answers
without seeing the first; both reveal together. *A recommendation, not a tested
finding — validate with 2–3 real couples before later phases build on it.*
