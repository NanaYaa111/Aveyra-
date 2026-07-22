# Volume 2 · Part 3 — Feature Specifications (Sections E–I)

> Received 2026-07-22. Sections **E (Daily Questions), F (Shared Memories),
> G (Timeline), H (Private Journal), I (Search & Discovery)**. Part 3 has 20
> sections; A–I now captured, **J–T + all of Part 4 pending**.

> **Structural directive (author, this batch):** from here on every section ends
> with **Data Model · User Flow Summary · Edge Cases · Acceptance Criteria ·
> Future Enhancements · Research Basis** — to keep the spec implementation-ready.
> Applied below.

> **Two guardian flags:**
> 1. **Section G (Timeline)** arrived only as a *research recap* (its data model,
>    flows, edge cases, acceptance), **not** a numbered primary spec. Recorded
>    from the recap; if the primary text differs, it supersedes.
> 2. 🔺 **Question categories — reconciliation (see the batch summary).** Section E
>    lists **9** canonical categories; the earlier decision said "**10**", and the
>    built **draft** bank uses 10 different ad-hoc slugs. Section E governs — the
>    draft bank must be **re-mapped to these 9** when the M2 question bank is
>    built. Tracked as [open-questions.md](open-questions.md) Q14.

---

## Section E — Daily Questions  *(the core experience / hero)*

**Purpose.** Aveyra's central promise: *every day offers one meaningful
opportunity to know each other a little better.* Not a game, streak system, or
productivity tool — small, consistent opportunities for genuine connection.

**Principles.** Quality over quantity (one thoughtful question/day) · Mutual
participation (neither sees the other's answer until both respond) · **No
pressure** (no streaks, no penalties, no public missed-day indicators) · Safe
vulnerability (invite openness, never force disclosure) · Growth through
conversation (light → deeper as trust develops).

**Question categories (9, canonical).** Discovery · Appreciation · Memories ·
Communication · Dreams & Future · Growth · Reflection · Fun & Play · **Conflict &
Repair** *(used sparingly, only after the relationship has matured)*. A **Love
Maps** sub-category sits under Discovery (example questions recorded separately).

**Research sources for questions.** Gottman Institute · Esther Perel · Arthur
Aron's "36 Questions" · relationship-psychology literature · Aveyra survey ·
future usability research. **Never generated for engagement metrics.**

**Selection rules.** One question/day; **same question for both partners**;
delivered per the **relationship's timezone**; **no repeat until the bank is
exhausted**, then **shuffle + restart** with a new randomized order.

**Answering.** Each partner answers **privately** — no typing indicators, no live
collaboration, no view of the partner's draft; autosaved as a draft until
submitted.

**Submission & grace.** On submit the answer **locks for the day**; editable
within a short **grace period (e.g. 10 min)**, then immutable.

**Waiting state.** If one has answered and the other hasn't: calm message ("Your
answer has been saved. You'll see each other's responses once you've both
answered.") — **do not reveal whether the partner has responded.**

**Reveal.** The emotional highlight. Both responses shown **side by side, equal
visual weight**, neither highlighted. Intimate, calm, rewarding.

**After reveal.** Optional: save as a shared memory · continue to dashboard ·
reflect privately in journal. Saving is optional.

**Skip.** Partner **not notified**; no judgment; the skipped question **returns
later in a future rotation.** Always acceptable.

**Missed days.** If both miss: the question is simply **deferred**; no punishment;
continue with the next opportunity.

**Insights (future).** Descriptive only ("topics discussed most", "categories
explored") — **never scores/judgments/grades.**

- **Data Model (per daily question / answer cycle).** Question id · category ·
  text · date (relationship tz) · lifecycle state; per-partner Answer (author,
  content, draft/submitted, submitted_at, grace-until); reveal state; optional
  saved-memory link.
- **Lifecycle.** Scheduled → Available → Answered A → Answered B → Ready for
  Reveal → Revealed → (optionally Saved as Memory) → Archived in History.
- **User Flow.** Question appears on Home (Today) → each answers privately →
  both submit → reveal side-by-side → optional save-as-memory → archived in
  searchable history.
- **Edge Cases.** One partner never answers (stays private, no reveal) · skip
  (silent, requeued) · both miss (deferred) · edit within grace vs after
  (locked) · timezone boundary for "today" · bank exhaustion → reshuffle.
- **Acceptance.** One question/day; same for both; answers private until both
  submit; reliable reveal; no repeats until exhausted; skipping harmless; optional
  save-as-memory; a11y (screen readers, keyboard, large targets, dynamic text,
  high contrast, reduced motion).
- **Future.** Seasonal packs · therapist-reviewed packs · long-distance / newly-
  married / parenting collections · optional transparent AI recommendations ·
  moderated user-suggested questions.
- **Research.** Gottman · Aron (36 Questions, graded light→deep) · Perel · NN/g ·
  HIG · Material · survey (desire for deeper conversation, understanding, growth,
  privacy, simple intentional interactions).

**Reconciliation.** ✅ **Selection rules match the built rotation engine
exactly** (`lib/questions/rotation.ts`): one/day, same for both (deterministic
per relationship), timezone day-keys, no consecutive repeats, exhaustion →
reshuffle → new cycle, silent-skip-returns-later. The answer/reveal **lifecycle**
is Milestone-2 (needs two devices + backend). 🔺 **Category taxonomy** differs
from the draft bank — see Q14.

---

## Section F — Shared Memories  *(the emotional archive; "Memories are the outcome")*

**Purpose.** Transform meaningful moments into a lasting relationship story. A
memory = a shared snapshot of an experience/conversation/milestone/emotion both
partners choose to keep.

**Principles.** Intentional saving (nothing auto-saved except an explicitly-saved
Daily Question reveal) · shared ownership (equal) · quality over quantity ·
privacy first (visible only to the two partners, never public).

**Ways to create.** From a completed Daily Question · manual *Create Memory* ·
from a milestone · (future) integrations.

**Content.** *Required:* title, description. *Optional:* one or more photos,
memory date, location (off by default), tags, mood, related Daily Question.

**Types.** Conversation (from a question) · Event (manual: trips, celebrations) ·
Reflection · Milestone (from milestones, optionally saved).

**Photos.** Never required; multiple allowed; **auto-compressed**; preserve aspect
ratio; reorderable; (future) short video.

**Tags & Mood.** Tags (Vacation, Anniversary, Family, Funny, Firsts, Goals,
Celebration; custom allowed). Mood optional & lightweight (Happy, Grateful,
Excited, Peaceful, Proud, Hopeful, Loved) — no scores.

**Editing.** Either partner may edit title/description/photos/tags/mood; reflected
on both devices. (Future: edit history.)

**Deleting.** Confirmation required → Recently Deleted → permanent per Part-4
retention policy.

- **Data Model.** Memory id · relationship id · creator id · title · description ·
  photos · tags · mood · related question id (opt) · created · updated · deleted
  status.
- **User Flow.** Create/save → stored securely → both partners view → appears in
  Timeline → searchable → edit/delete (per permissions).
- **Edge Cases.** No connection during upload · duplicate uploads · large images ·
  concurrent edit-while-viewing · failed uploads · missing image permissions ·
  deleted related Daily Question.
- **Acceptance.** Manual create; save-question-as-memory; reliable photo upload;
  sync across partners; search/filter; consistent edit/delete; a11y (incl.
  optional image alt text).
- **Future.** Video · voice notes · reactions · collaborative albums · optional AI
  recaps · printed books · anniversary recaps · smart highlights.
- **Research.** Survey · autobiographical-memory & relationship-satisfaction
  research · Mobbin gallery patterns · HIG · Material · NN/g.

**Reconciliation.** Current `Memory` (`lib/database/types.ts`) has id/
relationship_id/title/description/memory_date/image_ref. **M2 additions:** tags,
mood, related_question_id, **multiple** photos (currently single `image_ref`),
creator_id. Filter/search = Section I.

---

## Section G — Timeline  *(reconstructed from research recap — primary spec pending)*

**Purpose.** A calm, chronological "living storybook" combining memories,
milestones, and saved conversations into one co-owned, private, reflective
journey (not social, not algorithmic).

- **Data Model (event).** Event id · relationship id · **event type** (memory /
  milestone / conversation / anniversary…) · **reference id** (→ underlying
  record) · title · preview (short text from source) · cover image (opt) ·
  **timestamp** (the "when") · tags · created · updated. *(Clean separation:
  timeline event + referenced entity → chronological ordering independent of
  content type, fast listing, auto-update when the source changes.)*
- **User Flow.** A meaningful event occurs (memory/milestone/saved question) →
  app creates/updates a linked Timeline event → appears in the vertical
  chronological view → browse/search by year/month/type/tags/keywords → open card
  → full detail. **Editing the source updates the card; the Timeline itself is
  read-only.**
- **Edge Cases.** Empty relationship · very large histories (hundreds/thousands) ·
  missing images (fallback) · deleted memories (card updated/soft-removed) ·
  duplicate timestamps (order by timestamp then created_at) · timezone (display in
  relationship tz, respect original timestamps) · large photo collections (keep
  cards light) · corrupted media refs (safe fallback).
- **Acceptance.** Correct chronological order across types · conversations/
  memories/milestones consistently shown as cards · reliable filter/search by
  date/type/tags/text · smooth performance across years/many events · source
  edits update cards automatically · a11y (screen readers, headings, keyboard,
  text size, high contrast, reduced motion).
- **Future.** Map view · interactive journey viz · optional AI recap stories ·
  printed books · themes (all optional, privacy-preserving).
- **Research.** Autobiographical memory & intimacy · romantic nostalgia &
  relationship functioning · digital-memory/journaling design · HIG · Material ·
  NN/g/Mobbin archive patterns.

**Reconciliation.** Timeline maps to the resolved **Story** destination (four-nav,
Q13). New `TimelineEvent` table for M2 (event+reference model above). No current
equivalent; additive.

---

## Section H — Private Journal  *(strictly private per-partner reflection)*

**Purpose.** A personal space for each partner to reflect, process emotions, and
prepare for conversations. Supports self-awareness → stronger mutual
understanding. **Strictly private** — never visible to the partner unless the
author deliberately copies/shares it outside Aveyra.

**Principles.** **Privacy without exception** (partners cannot access, search, or
recover each other's journals) · reflection before reaction · simplicity ·
personal growth.

**Structure.** *Required:* entry content. *Optional:* title, mood, tags, photos
(**max 3**), date, favorite marker.

**Writing experience.** Full-screen focus mode · minimal UI · basic rich text
only (bold, italic, bullet/numbered lists) · character count hidden by default ·
**autosave** · drafts restored after unexpected close.

**Moods & Tags.** Optional mood (Happy, Calm, Grateful, Hopeful, Stressed, Sad,
Excited, Reflective) — **no judgments/scores**. Tags (Family, Work,
Communication, Dreams, Gratitude, Personal Growth, Conflict, Celebration; custom).

**Viewing.** Reverse chronological; shows title (or first line), date, optional
mood + favorite. **Favorites** get a dedicated filter.

**Deleting.** Confirmation → Recently Deleted → Part-4 retention.

**Privacy protection (absolute).** Journal entries are **never** shared
automatically, shown in the Timeline, visible to the partner, or included in
shared search results.

**Relationship integration.** The author may *manually* create a Shared Memory
inspired by an entry — always a deliberate act; no automatic sharing.

- **Data Model.** Journal id · **user id** · relationship id *(grouping only —
  grants no partner access)* · title · content · mood · tags · photos · favorite
  status · created · updated · deleted status.
- **User Flow.** New entry → autosave draft → finish → stored securely →
  search/edit/favorite/delete → **private throughout**.
- **Edge Cases.** Interrupted sessions · offline editing + later sync · very long
  entries · large image attachments · duplicate drafts · failed sync · multi-
  device concurrent edit (resolve to latest confirmed version, warn on conflict).
- **Acceptance.** Create/edit/delete private entries · reliable autosave · working
  search/filter · **never appears in shared areas** · privacy enforced across
  devices · a11y.
- **Future.** Voice entries · stylus notes · optional privacy-respecting AI
  prompts · **author-only** mood trends · export to PDF/Markdown · reminders.
- **Research.** Survey · expressive-writing & well-being research (private
  relationship writing predicts stability) · HIG · Material · NN/g · Mobbin.

**Reconciliation.** Current `JournalEntry` has id/owner_id/title/content. **M2
additions:** mood, tags, photos (≤3), favorite. **Privacy is a hard RLS rule:**
journal is owner-only — never in shared search, timeline, or partner views. The
built encryption already treats journal `title`/`content` as encrypted fields.

---

## Section I — Search & Discovery  *(calm rediscovery, privacy-first)*

**Purpose.** Help users quickly rediscover meaningful moments across years of
history — *revisiting the relationship's story*, not "searching files".

**Principles.** **Privacy first** (never expose content the user can't see;
private journals author-only) · unified experience (one search across everything)
· fast by default · calm discovery (uncluttered, no complex syntax).

**Scope.** Shared Memories · Timeline events · Daily Question history · Milestones
· **Private Journal (author only)** · Settings (future).

**Searchable by.** Keywords, titles, descriptions, question text, tags, dates/
months/years, memory types, mood labels, milestones.

**Results.** Title · preview · content type · date · optional thumbnail —
**grouped by category** for readability.

**Filters (optional).** Memories · Daily Questions · Timeline · Journal ·
Milestones · Tags · Date range · Mood · Photos. **Sort:** Most Relevant (default)
· Newest · Oldest.

**Empty search.** "Nothing matched your search yet." + gentle suggestions (try
another keyword; browse Timeline; explore Memories) — no generic errors.

**Recent & suggested.** Store a few **local, private** recent searches (clearable).
Empty-field suggestions encourage reflection ("This Month Last Year",
"Anniversaries", "Favorite Journal Entries") — **not engagement maximization.**

**Privacy rules (hard).** Partner A can search shared memories/timeline/questions/
milestones but **never** Partner B's journal or drafts. Boundaries never violated.

- **Data Model (index).** Content id · content type · relationship id · **user id
  (private content only)** · title · preview · tags · mood · created · updated.
- **User Flow.** Open Search → keyword/suggestion → instant grouped results →
  optional filter/sort → open result → return without losing context.
- **Edge Cases.** Empty relationship · very large datasets · typos · duplicate
  titles · deleted content · missing images · offline search (cached) · concurrent
  sync updates.
- **Acceptance.** Search all **permitted** content · logical grouping · working
  filters/sort · **private content inaccessible to partners** · fast on large
  datasets · a11y (incl. voice input where supported). Perf targets → Part 4.
- **Future.** Semantic/NL search · optional transparent AI discovery · visual
  photo search · saved searches · advanced filtering · recap suggestions — all
  **privacy-first, no content analysis without explicit consent.**
- **Research.** Survey · findability/IA research · NN/g · HIG search-field
  guidance · Material · Mobbin archive patterns.

**Reconciliation.** M2 feature (needs the content corpus + RLS). The **author-only
journal rule** must be enforced in both the query layer and RLS. Maps to a Search
surface reachable from the four-nav (likely within Story/Today, not a 5th tab).

---

## Batch reconciliation summary (for the M2 build)

**🔺 Q14 — Question categories: 9 canonical (Section E) supersede "10".**
- Section E's authoritative set: **Discovery · Appreciation · Memories ·
  Communication · Dreams & Future · Growth · Reflection · Fun & Play · Conflict &
  Repair** + a **Love Maps** sub-category under Discovery.
- The built **draft** bank (`lib/questions/bank.ts`) uses 10 different ad-hoc
  slugs (everyday, our-story, dreams, values, growth, gratitude, play,
  inner-world, us, care). It was always flagged draft. **Action (M2):** re-map the
  draft questions into the 9 canonical categories, add **Conflict & Repair**
  (reserved for matured relationships), fold Love Maps under Discovery, and
  incorporate the author's example Love Maps questions. The rotation **engine** is
  unaffected (category-agnostic). Tracked as open-questions Q14.

**M2 schema additions implied by E–I (for Part 4 DDL):**
- **Memory:** tags, mood, related_question_id, **multiple** photos, creator_id.
- **JournalEntry:** mood, tags, photos (≤3), favorite.
- **New:** DailyQuestion instance + per-partner Answer + reveal state;
  **TimelineEvent** (event+reference model); **search index**; question↔memory
  links.
- **Hard privacy/RLS rules:** journal is **owner-only** everywhere (never in
  shared search/timeline/partner views); shared content equal-access to both
  participants; recent searches local & private.

**Strong alignment confirmed:** the built rotation engine already implements
Section E's selection rules; the encryption layer already encrypts the journal &
memory content fields E–I call private; the four-nav (Q13) absorbs Timeline
(Story), Journal (Write), and Search (within Today/Story).
