/* ============================================================================
   seed.js — Static, evidence-informed content bundled with the app.
   All content ships locally so the app is 100% functional offline.
   Sources of inspiration: Gottman Method (Love Maps, fondness & admiration,
   turning toward), Five Love Languages, gratitude & appreciation research.
   ========================================================================== */

// Connection Deck — conversation starters grouped by intent.
export const DECK = [
  // Love Maps — knowing each other's inner world (Gottman)
  { cat: 'Love Maps', q: 'What is a small dream you have not told me about yet?' },
  { cat: 'Love Maps', q: 'What did comfort feel like in the home you grew up in?' },
  { cat: 'Love Maps', q: 'If we had a free, unplanned day tomorrow, how would you want to spend it?' },
  { cat: 'Love Maps', q: 'What is something you are quietly proud of this year?' },
  { cat: 'Love Maps', q: 'Which of your friendships shaped you the most, and how?' },
  { cat: 'Love Maps', q: 'What worry has been sitting in the back of your mind lately?' },

  // Fondness & Admiration — building positive sentiment
  { cat: 'Fondness', q: 'What is one thing I did this week that made you feel loved?' },
  { cat: 'Fondness', q: 'When did you first realise you were falling for me?' },
  { cat: 'Fondness', q: 'What strength do you see in me that I underrate in myself?' },
  { cat: 'Fondness', q: 'Describe a moment you felt genuinely proud to be with me.' },
  { cat: 'Fondness', q: 'What is a tiny habit of mine that you secretly adore?' },

  // Turning Toward — needs & bids for connection
  { cat: 'Turning Toward', q: 'What helps you feel supported when you are stressed?' },
  { cat: 'Turning Toward', q: 'How do you most like to be comforted after a hard day?' },
  { cat: 'Turning Toward', q: 'Is there a small thing I could do more often that would mean a lot?' },
  { cat: 'Turning Toward', q: 'What does a "good morning" together look like for you?' },

  // Dreams & Growth — shared meaning
  { cat: 'Dreams', q: 'Where do you hope we are, together, five years from now?' },
  { cat: 'Dreams', q: 'What tradition would you love for us to start?' },
  { cat: 'Dreams', q: 'What is an adventure you want us to say yes to?' },
  { cat: 'Dreams', q: 'What does a life well-lived look like to you?' },

  // Playful — lightness & fun
  { cat: 'Playful', q: 'If we swapped lives for a day, what would surprise you most about mine?' },
  { cat: 'Playful', q: 'What song instantly reminds you of us?' },
  { cat: 'Playful', q: 'What is the most us thing we have ever done?' },
  { cat: 'Playful', q: 'If our relationship were a movie, what genre would it be?' },

  // Repair — gentle reconnection after friction
  { cat: 'Repair', q: 'When we disagree, what makes you feel heard again?' },
  { cat: 'Repair', q: 'What is one thing we could both do to argue more kindly?' },
  { cat: 'Repair', q: 'What do you need from me right now — solutions, or just to be held?' },
];

// Daily reflection prompts shown on the dashboard (rotate by day).
export const DAILY_PROMPTS = [
  'Name one thing you appreciated about each other today.',
  'What is a small win you can celebrate together?',
  'Send a text right now that you would want to receive.',
  'What made you smile because of your partner recently?',
  'Plan one tiny act of kindness for tomorrow.',
  'Recall your favourite memory from this month.',
  'What is something you are grateful your partner does without being asked?',
  'Describe your partner in three words today.',
  'What would make tomorrow feel 1% warmer between you?',
  'Share a hope you have for the two of you this week.',
];

// Coupon templates users can add with one tap.
export const COUPON_IDEAS = [
  { title: 'Breakfast in bed', note: 'Redeemable any lazy morning.' },
  { title: 'A 20-minute shoulder rub', note: 'No phones allowed.' },
  { title: 'You pick the movie', note: 'And I will not complain. Promise.' },
  { title: 'One chore, handled', note: 'Your choice, my hands.' },
  { title: 'A distraction-free date night', note: 'Phones in a drawer.' },
  { title: 'Breakfast date of your choosing', note: 'On me.' },
  { title: 'One heartfelt compliment, daily, for a week', note: '' },
  { title: 'A long walk, just us', note: 'Talking optional.' },
];

// Date idea starters for the planner.
export const DATE_IDEAS = [
  'Cook a recipe from a country neither of you has visited.',
  'Recreate your first date, detail for detail.',
  'Sunrise or sunset picnic — whichever you can wake for.',
  'Visit a bookstore and pick a book for each other.',
  'Do a 1000-piece puzzle over a bottle of wine.',
  'Take a class together: pottery, dance, or cooking.',
  'A no-spend day: free museums, parks, and people-watching.',
  'Write letters to open on your next anniversary.',
  'Star-gazing with a blanket and a playlist.',
  'Trade phones and give each other a music tour.',
];

// Curated bucket-list suggestions.
export const BUCKET_IDEAS = [
  'Watch the sunrise together somewhere new',
  'Take a spontaneous weekend road trip',
  'Learn to cook each other\'s comfort dish',
  'Plant something and watch it grow',
  'See the northern lights',
  'Write a shared journal for a full year',
];

// Compliments generator pool.
export const COMPLIMENTS = [
  'Being around you feels like exhaling.',
  'You make ordinary days feel chosen.',
  'I trust you with the quietest parts of me.',
  'You are my favourite hello and hardest goodbye.',
  'Your kindness is not loud, but it is everywhere.',
  'I would pick this life with you again, easily.',
  'You make me braver than I am alone.',
  'Home stopped being a place when it became you.',
];

// Mood options with emoji + label + numeric score for insights.
export const MOODS = [
  { emoji: '😍', label: 'Adored', score: 5 },
  { emoji: '😊', label: 'Happy', score: 4 },
  { emoji: '🙂', label: 'Content', score: 3 },
  { emoji: '😐', label: 'Neutral', score: 2 },
  { emoji: '😔', label: 'Low', score: 1 },
  { emoji: '😣', label: 'Struggling', score: 0 },
];
