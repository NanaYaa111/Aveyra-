/**
 * A small thing to try today.
 *
 * Invitations, never instructions. Nothing here diagnoses a relationship,
 * assigns homework, or implies something is wrong — it offers one small,
 * concrete thing either of you could do, and it is entirely fine to read it and
 * do nothing.
 *
 * Three rules, and they are what keep this from becoming the worst feature in
 * the app:
 *
 * 1. **Nothing is tracked.** No "done" button, no completion, no history, no
 *    count. The moment an app knows whether you took its advice, the advice
 *    becomes an obligation with a record attached.
 * 2. **It never addresses a problem.** These are not tailored to anything the
 *    app has seen — it does not read your notes or your check-ins and respond.
 *    An app that noticed you were struggling and served advice about it would
 *    be surveillance wearing a kind face.
 * 3. **It is not therapy.** Small, ordinary, human suggestions only. Nothing
 *    that reads as clinical guidance or crisis advice.
 */
import { hashSeed, shuffle, dateKeyInTimeZone } from '../questions/rotation';

export interface Suggestion {
  id: string;
  text: string;
}

export const SUGGESTIONS: Suggestion[] = [
  { id: 's-01', text: 'Tell them one small thing they did this week that you noticed.' },
  { id: 's-02', text: 'Ask about something they mentioned in passing and never finished.' },
  { id: 's-03', text: 'Put your phone somewhere else for the length of one conversation.' },
  { id: 's-04', text: 'Say the thing you assumed they already knew.' },
  { id: 's-05', text: 'Ask what would make tomorrow easier for them.' },
  { id: 's-06', text: 'Share something you are looking forward to, however small.' },
  { id: 's-07', text: 'Remember something from early on and tell them what you remember.' },
  { id: 's-08', text: 'Ask them what they need more of lately, and just listen to the answer.' },
  { id: 's-09', text: 'Thank them for something ordinary that usually goes unsaid.' },
  { id: 's-10', text: 'Tell them about a moment today when you thought of them.' },
  { id: 's-11', text: 'Ask what they are worried about that they have not mentioned.' },
  { id: 's-12', text: 'Do one small thing they usually do, without being asked.' },
  { id: 's-13', text: 'Ask them to tell you about a good day they had recently.' },
  { id: 's-14', text: 'Say what you appreciate about how they handled something hard.' },
  { id: 's-15', text: 'Ask what you could do less of.' },
  { id: 's-16', text: 'Tell them something you are proud of them for.' },
  { id: 's-17', text: 'Ask about a part of their day you never usually hear about.' },
  { id: 's-18', text: 'Name one thing you would like the two of you to do more often.' },
  { id: 's-19', text: 'Tell them what you find easy about being with them.' },
  { id: 's-20', text: 'Ask what they were like at an age you did not know them.' },
  { id: 's-21', text: 'Say sorry for a small thing, without adding anything after it.' },
  { id: 's-22', text: 'Ask what song, place, or smell reminds them of you.' },
  { id: 's-23', text: 'Tell them one way they have changed your mind about something.' },
  { id: 's-24', text: 'Ask how they are, and then ask again once they answer.' },
  { id: 's-25', text: 'Share something you read or saw that they would like.' },
  { id: 's-26', text: 'Say what you are hoping for, for the two of you.' },
  { id: 's-27', text: 'Ask what they would want you to do differently when things get tense.' },
  { id: 's-28', text: 'Tell them about something you find hard to say out loud.' },
];

function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function dayNumber(dateKey: string): number {
  return Math.floor(Date.parse(dateKey + 'T00:00:00Z') / 86_400_000);
}

/**
 * Today's suggestion, the same one on both devices. Deterministic from the
 * relationship id and the date — no server, nothing stored, nothing to sync.
 */
export function suggestionForDate(relId: string, when: Date = new Date()): Suggestion {
  const dateKey = dateKeyInTimeZone(when, localTimeZone());
  // A different seed from the question and verse rotations, so all three don't
  // move in lockstep and land on the same theme every day.
  const order = shuffle(SUGGESTIONS, hashSeed(`${relId}:suggestions`));
  const index = ((dayNumber(dateKey) % order.length) + order.length) % order.length;
  return order[index]!;
}
