/**
 * ============================================================================
 * DRAFT QUESTION BANK — for review, not final.
 * ============================================================================
 *
 * ⚠️ CATEGORY RECONCILIATION (Volume 2 Part 3 Section E, open-questions Q14):
 * Section E defines the CANONICAL 9 categories — Discovery, Appreciation,
 * Memories, Communication, Dreams & Future, Growth, Reflection, Fun & Play,
 * Conflict & Repair (+ a Love Maps sub-category under Discovery). The ten ad-hoc
 * slugs below predate that spec and must be RE-MAPPED to the 9 when the M2
 * question bank is built. The rotation engine is category-agnostic, so this is a
 * content change only. See docs/constitution/love-maps-example-questions.md.
 *
 * ~200 questions across the ten (draft) categories, plus the fixed opening question.
 * Authored to the spec (Parts 3–4 decisions batch): warm, open, invitation-
 * style prompts; questions deepen gradually WITHIN a category (the `depth`
 * hint) but difficulty is never surfaced (open-questions Q9). Nothing here
 * frames a partner as a deficit, ranks, scores, or compares (Part 2 §1.2).
 *
 * This content is a DRAFT starting point. Final wording, additions, and
 * removals are the author's call — replace freely. The rotation engine treats
 * this as an opaque pool, so editing text/adding/removing entries is safe as
 * long as ids stay stable and unique.
 */

import type { QuestionSeed, CategorySlug } from './types';

/**
 * The fixed first question every relationship sees on day one
 * (Parts 3–4 decisions). Referenced by id so the engine can always lead with
 * it, regardless of the shuffled order that follows.
 */
export const FIRST_QUESTION_ID = 'q-open-01';

const OPENING: QuestionSeed = {
  id: FIRST_QUESTION_ID,
  category: 'inner-world',
  text: `What's one small thing about yourself that you hope I always remember?`,
  depth: 1,
};

/** Helper: build a category's list with sequential ids and depth ramp. */
function seed(category: CategorySlug, texts: [string, 1 | 2 | 3][]): QuestionSeed[] {
  return texts.map(([text, depth], i) => ({
    id: `q-${category}-${String(i + 1).padStart(2, '0')}`,
    category,
    text,
    depth,
  }));
}

const EVERYDAY = seed('everyday', [
  [`What small thing made you smile today?`, 1],
  [`What's a part of your everyday routine that you quietly love?`, 1],
  [`What's something ordinary that always feels a little special to you?`, 1],
  [`What did you notice today that you almost walked past?`, 1],
  [`What's the best part of your mornings lately?`, 1],
  [`What's a small luxury you'd never want to give up?`, 1],
  [`What made today feel like a good day, even a little?`, 1],
  [`What's something you did this week just because it felt nice?`, 2],
  [`What's a tiny ritual that makes an ordinary day feel like yours?`, 2],
  [`What's the last thing that made you laugh out loud?`, 1],
  [`What's a simple pleasure you wish you made more time for?`, 2],
  [`What's your favorite way to spend a slow afternoon?`, 1],
  [`What's something small you're looking forward to this week?`, 1],
  [`What's a place in your day where you feel most at ease?`, 2],
  [`What's a little thing that always lifts your mood?`, 1],
  [`What's a food that tastes like home to you?`, 2],
  [`What's something you saw today that felt beautiful?`, 2],
  [`What's a small good thing from today worth remembering?`, 1],
  [`What's the coziest part of your evenings?`, 1],
  [`What's a sound or smell that instantly comforts you?`, 2],
]);

const OUR_STORY = seed('our-story', [
  [`What's an early moment with me that still makes you smile?`, 1],
  [`When did you first feel truly comfortable around me?`, 2],
  [`What's a small memory of us you hope we never forget?`, 2],
  [`What surprised you most about me when we were getting to know each other?`, 2],
  [`What's a place that feels like "ours"?`, 1],
  [`What's something we've been through together that made us stronger?`, 3],
  [`What's a tiny detail from a day together that stuck with you?`, 2],
  [`When have you felt proudest of us?`, 2],
  [`What's a moment you wish we could relive exactly as it was?`, 2],
  [`What's something I did early on that made you think, "oh, them"?`, 2],
  [`What's an inside joke or phrase that's just ours?`, 1],
  [`What's a hard moment we handled better than you expected?`, 3],
  [`What's something between us that you're grateful has changed?`, 3],
  [`What's a memory of us that always makes you laugh?`, 1],
  [`What did our first days together teach you?`, 2],
  [`What's something about how we met that you love telling people?`, 1],
  [`When did you realize this was something real?`, 3],
  [`What's a quiet, unremarkable day with me that you'd keep forever?`, 2],
  [`What's a way we've grown that you didn't see coming?`, 3],
  [`What's the story of us you'd want to tell years from now?`, 3],
]);

const DREAMS = seed('dreams', [
  [`What's something you're quietly hoping for lately?`, 2],
  [`If next year went beautifully, what would be different?`, 2],
  [`What's a place you'd love for us to see together someday?`, 1],
  [`What's a dream you've never said out loud?`, 3],
  [`What does a good life look like to you, in plain terms?`, 2],
  [`What's something you'd love to learn or try one day?`, 1],
  [`What kind of home do you imagine for us down the road?`, 2],
  [`What's a small adventure you'd love to have soon?`, 1],
  [`What do you hope stays exactly the same about us in ten years?`, 3],
  [`What's something you want to be braver about?`, 3],
  [`If money weren't a worry, how would you spend a free year?`, 1],
  [`What's a tradition you'd love for us to start?`, 2],
  [`What's a version of your future self you're excited to meet?`, 2],
  [`What would you love for us to be really good at together?`, 2],
  [`What's a goal that would make you proud to reach?`, 2],
  [`What's something you want more of in your life?`, 2],
  [`Where do you picture us on an ordinary evening, years from now?`, 2],
  [`What's a dream of yours I could help make more possible?`, 3],
  [`What's something you hope we always make time for?`, 2],
  [`What would "we made it" feel like to you?`, 3],
]);

const VALUES = seed('values', [
  [`What's something you believe that you rarely get to say?`, 2],
  [`What does being a good partner mean to you?`, 2],
  [`What's a value you hope we always protect?`, 2],
  [`What's something you'd rather not compromise on?`, 3],
  [`What does home mean to you, beyond a place?`, 2],
  [`What's a lesson from your family you want to keep — and one you don't?`, 3],
  [`What does trust look like to you, in practice?`, 2],
  [`What's something you've changed your mind about?`, 2],
  [`What matters more to you than people might guess?`, 2],
  [`What does a fair disagreement look like to you?`, 2],
  [`What's a principle you try to live by, even when it's hard?`, 3],
  [`What does respect feel like to you when you're on the receiving end?`, 2],
  [`What kind of person do you most want to be remembered as?`, 3],
  [`What's something you think is worth being patient for?`, 1],
  [`What does honesty mean to you when it's uncomfortable?`, 3],
  [`What's a small way you try to be a good person day to day?`, 1],
  [`What do you think makes love last?`, 2],
  [`What's something you want us to always be honest about?`, 3],
  [`What does forgiveness mean to you?`, 3],
  [`What's a belief of yours you hope I understand better over time?`, 3],
]);

const GROWTH = seed('growth', [
  [`How are you different from who you were a few years ago?`, 2],
  [`What's something you're working on in yourself right now?`, 2],
  [`What's a fear you're slowly getting better at facing?`, 3],
  [`What's a habit you're proud of building?`, 1],
  [`What's something you've forgiven yourself for?`, 3],
  [`What's a mistake that taught you something you needed?`, 2],
  [`What's a part of yourself you're learning to be kinder to?`, 3],
  [`What's something you used to want that you've let go of?`, 2],
  [`When did you last surprise yourself?`, 1],
  [`What's a way you'd like to grow that I could support?`, 3],
  [`What's something hard that turned out to be good for you?`, 2],
  [`What's a strength you didn't know you had until you needed it?`, 2],
  [`What's a truth about yourself you've come to accept?`, 3],
  [`What's something you're unlearning?`, 2],
  [`Who helped you become who you are, and how?`, 2],
  [`What's a change you're a little scared of but want anyway?`, 3],
  [`What does taking care of yourself look like for you these days?`, 1],
  [`What's something you're more confident about now?`, 1],
  [`What would the younger you be proud of?`, 2],
  [`What's one small step you could take toward who you want to be?`, 2],
]);

const GRATITUDE = seed('gratitude', [
  [`What's something about me you're grateful for but maybe don't say enough?`, 2],
  [`Who in your life are you thankful for right now?`, 1],
  [`What's something you have today that you once only hoped for?`, 2],
  [`What's a small kindness someone showed you that stayed with you?`, 2],
  [`What part of your life feels like a gift lately?`, 2],
  [`What's something I do that makes your day easier?`, 1],
  [`What's a moment from this week you're grateful happened?`, 1],
  [`What's something about your body you're thankful for?`, 2],
  [`What's a hard thing you're now glad you went through?`, 3],
  [`What's something ordinary you'd miss if it were gone?`, 1],
  [`What's a way I've supported you that meant more than you let on?`, 3],
  [`Who taught you something you're still grateful for?`, 2],
  [`What's a comfort in your life you don't take for granted?`, 1],
  [`What made you feel loved recently?`, 2],
  [`What's something about us you feel lucky to have?`, 2],
  [`What's a place you're grateful exists?`, 1],
  [`What's a small thing I did that you appreciated more than I know?`, 2],
  [`What are you proud of yourself for lately?`, 2],
  [`What's something good in your life that snuck up on you?`, 2],
  [`What's a person, place, or thing you'd thank right now if you could?`, 1],
]);

const PLAY = seed('play', [
  [`If we could teleport anywhere for dinner tonight, where to?`, 1],
  [`What would your perfect lazy day look like, hour by hour?`, 1],
  [`If you could instantly master one skill, what would it be?`, 1],
  [`What's a wildly impractical thing you'd love to own?`, 1],
  [`If our life were a movie, what genre would it be?`, 1],
  [`What imaginary superpower would suit you best?`, 1],
  [`If we had a free weekend and no budget, what would we do?`, 1],
  [`If we invented a holiday just for the two of us, what would we celebrate?`, 2],
  [`If you could relive one day just for fun, which one?`, 2],
  [`What would you name a boat, a band, and a pet?`, 1],
  [`If you could share a meal with anyone, living or not, who?`, 2],
  [`What's a ridiculous talent you wish you had?`, 1],
  [`If we swapped lives for a day, what would surprise you about mine?`, 2],
  [`What's the most fun you've had recently?`, 1],
  [`If you could design our dream room, what's in it?`, 1],
  [`What's a childhood game you'd happily play right now?`, 1],
  [`If we started a business together on a whim, what would it be?`, 2],
  [`What's a place that only exists in your imagination?`, 2],
  [`If today had a theme song, what would it be?`, 1],
  [`What's something delightfully weird you love?`, 1],
]);

const INNER_WORLD = seed('inner-world', [
  [`How are you, really, underneath the usual answer?`, 2],
  [`What's been on your mind lately that you haven't shared?`, 3],
  [`What's something you're feeling but finding hard to name?`, 3],
  [`When do you feel most like yourself?`, 2],
  [`What makes you feel safe?`, 2],
  [`What's a worry you've been carrying quietly?`, 3],
  [`What helps you when you're overwhelmed?`, 2],
  [`What's something you needed to hear this week?`, 2],
  [`When did you last feel really understood?`, 2],
  [`What's a feeling you wish you were better at expressing?`, 3],
  [`What's something that's been weighing on you?`, 3],
  [`What does peace feel like in your body?`, 2],
  [`What's a memory that comforts you when things are hard?`, 2],
  [`What's something you're proud of that no one saw?`, 2],
  [`When do you feel lonely, even around people?`, 3],
  [`What's a small thing that reassures you?`, 1],
  [`What do you do with feelings you don't know what to do with?`, 3],
  [`What's something you wish I asked you about more?`, 3],
  [`What makes you feel most at home in yourself?`, 2],
  [`What's something tender you're protecting right now?`, 3],
]);

const US = seed('us', [
  [`What makes you feel closest to me?`, 2],
  [`What's something you'd love more of between us?`, 2],
  [`When do you feel most loved by me?`, 2],
  [`What's a way we're good together that you're grateful for?`, 2],
  [`What's something you wish we did more often?`, 1],
  [`How do you most like to be comforted when you're down?`, 2],
  [`What's a small way I could make you feel more appreciated?`, 2],
  [`What do you think we're quietly great at?`, 1],
  [`What's something you'd like us to get better at, gently?`, 3],
  [`What does a really good day together look like to you?`, 1],
  [`How do you like to reconnect after a hard moment?`, 3],
  [`What's a way I show love that you especially feel?`, 2],
  [`What's something you'd like to understand better about me?`, 2],
  [`What helps you feel like we're a team?`, 2],
  [`What's a routine of ours you'd hate to lose?`, 1],
  [`When do you feel most glad to be with me?`, 2],
  [`What's something you've been wanting to tell me?`, 3],
  [`How could I be a better partner to you this month?`, 3],
  [`What's a way we handle hard things that you're proud of?`, 3],
  [`What do you hope never changes about us?`, 2],
]);

const CARE = seed('care', [
  [`What's the kindest thing someone could do for you on a bad day?`, 2],
  [`What does being taken care of look like for you?`, 2],
  [`What do you need more of right now — rest, fun, space, or closeness?`, 2],
  [`How do you like to be checked on when you go quiet?`, 2],
  [`What's a comfort food or ritual for hard days?`, 1],
  [`What helps you feel better when you're worn out?`, 1],
  [`What's something small I could do to lighten your load?`, 2],
  [`How do you like to recharge when you're drained?`, 1],
  [`What words help you most when you're struggling?`, 3],
  [`What's a way you like to be shown you're not alone?`, 2],
  [`What do you wish people understood about how you cope?`, 3],
  [`What's a boundary that helps you feel cared for?`, 3],
  [`When you're stressed, what actually helps — and what doesn't?`, 2],
  [`What's a gesture that makes you feel deeply looked after?`, 2],
  [`How can I support you without trying to fix everything?`, 3],
  [`What's your favorite way to be comforted after a long day?`, 1],
  [`What helps when you drift too far into your own head?`, 3],
  [`What's something you'd never ask for but would love to receive?`, 3],
  [`What does a truly restful day look like for you?`, 1],
  [`What do you need to hear when you're being hard on yourself?`, 3],
]);

/** The full draft pool: the fixed opener followed by every category. */
export const QUESTION_BANK: readonly QuestionSeed[] = [
  OPENING,
  ...EVERYDAY,
  ...OUR_STORY,
  ...DREAMS,
  ...VALUES,
  ...GROWTH,
  ...GRATITUDE,
  ...PLAY,
  ...INNER_WORLD,
  ...US,
  ...CARE,
];

/** All question ids, in bank order. */
export const ALL_QUESTION_IDS: readonly string[] = QUESTION_BANK.map((q) => q.id);

/** Lookup a question by id. */
export function getQuestion(id: string): QuestionSeed | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}
