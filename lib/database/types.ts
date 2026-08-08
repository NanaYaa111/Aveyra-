/**
 * Aveyra data models (Constitution Part 4 §3, extended by the two-device
 * amendment). Every user-content record carries id/created_at/updated_at/
 * deleted_at/schema_version, plus a monotonic `version` for future conflict
 * resolution (timestamps + version numbers).
 *
 * Timestamps are epoch milliseconds. `deleted_at === null` means "live";
 * a timestamp means soft-deleted (recoverable). Nothing is ever hard-deleted
 * by normal flows (Constitution Part 3 §12).
 */

export const SCHEMA_VERSION = 1;

/** Fields shared by every persisted user-content record. */
export interface BaseRecord {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  schema_version: number;
  /** Monotonic version for future sync conflict resolution. */
  version: number;
}

/** Minimal local identity for a person on a device (amendment A3). */
export interface User {
  id: string;
  display_name: string;
  device_id: string;
  created_at: number;
  /** True for the person using this device; false for the linked partner. */
  is_self: boolean;
}

export type RelationshipStatus = 'solo' | 'pending' | 'linked';

/** The shared relationship (folds in the former RelationshipProfile). */
export interface Relationship extends BaseRecord {
  creator_id: string;
  partner_id: string | null;
  status: RelationshipStatus;
  partner_name: string;
  /** Epoch ms of the relationship start date (a real timeline anchor). */
  relationship_start_date: number | null;
}

/** A daily question. Bundled content; an invitation, never a test. */
export interface Question {
  id: string;
  category: string;
  text: string;
  created_at: number;
  schema_version: number;
}

/** Neutral local author label — never a ranking or tracker (Part 4 §3.4). */
export type Author = 'partner_one' | 'partner_two';

export interface Answer extends BaseRecord {
  question_id: string;
  author: Author;
  content: string;
}

/** Temporary state for the pass-the-phone reveal (Part 4 §3.5). */
export interface RevealSession {
  id: string;
  question_id: string;
  partner_one_completed: boolean;
  partner_two_completed: boolean;
  revealed: boolean;
  created_at: number;
}

export interface Memory extends BaseRecord {
  relationship_id: string;
  title: string;
  description: string;
  /** Epoch ms of when the memory happened. */
  memory_date: number;
  /** Reference into the images store; one image max in Phase 1. */
  image_ref: string | null;
}

export interface JournalEntry extends BaseRecord {
  owner_id: string;
  title: string;
  content: string;
}

export type DatePlanStatus = 'idea' | 'planned' | 'done';

/** A shared date idea/plan. Both partners see and edit the same list. */
export interface DatePlan extends BaseRecord {
  relationship_id: string;
  title: string;
  notes: string;
  status: DatePlanStatus;
  /** Epoch ms of when it's planned for; null while it's still just an idea. */
  planned_for: number | null;
}

/**
 * The fixed vocabulary of pings — for missing someone without having words.
 * Deliberately closed and small: choosing from six warm things is easier than
 * facing an empty box, which is the entire point. Every one is obligation-free
 * by construction; none asks a question, so none can go unanswered.
 */
export const PINGS = [
  'thinking-of-you',
  'miss-you',
  'hope-today-is-kind',
  'saw-something-you-would-like',
  'no-need-to-reply',
  'goodnight',
] as const;
export type PingKind = (typeof PINGS)[number];

/** A thread entry: either something written, or a one-tap ping. */
export type MessageKind = 'message' | 'ping';

/** One message in the couple's private thread. */
export interface Message extends BaseRecord {
  relationship_id: string;
  author: Author;
  content: string;
  /** 'ping' rows carry a {@link PingKind} in `content`, not free text. */
  kind: MessageKind;
}

/**
 * Feeling words for the daily check-in. A small, plain-spoken set — a weather
 * report, never a score (no numbers, no streaks, no trends; Q23).
 */
export const MOODS = ['calm', 'happy', 'grateful', 'tired', 'stressed', 'sad'] as const;
export type Mood = (typeof MOODS)[number];

/**
 * The daily scripture ritual. Whoever arrives first chooses the verse; the
 * other reads it and adds their reflection. One row per day per relationship —
 * the verse is chosen once, and the second person answers it rather than
 * posting a competing one.
 */
export interface DailyScripture extends BaseRecord {
  relationship_id: string;
  /** Local YYYY-MM-DD key. */
  date_key: string;
  /** Who chose the verse. */
  chooser: Author;
  /** Reference, e.g. "Psalm 143:8". */
  reference: string;
  /** The verse text as it was shown when chosen. */
  text: string;
  /** What the chooser wanted to say about it. Optional. */
  chooser_note: string;
  /** The second person's reflection, added when they arrive. */
  response: string;
  /** When the response landed; null until then. */
  responded_at: number | null;
}

/** The kind of note — the register is stated up front, before it's opened. */
export const NOTE_KINDS = ['weighing', 'lovely', 'idea'] as const;
export type NoteKind = (typeof NOTE_KINDS)[number];

/**
 * A note between the two of you, labelled by what kind of thing it is. The
 * label exists so nobody has to open "we need to talk" cold, and so a hard
 * thing and a happy thing don't arrive looking identical.
 */
export interface Note extends BaseRecord {
  relationship_id: string;
  author: Author;
  kind: NoteKind;
  content: string;
  /** Marked read by the recipient — never shown to the sender as a receipt. */
  acknowledged_at: number | null;
}

/** A daily emotional check-in, shared with the partner as soon as it's made. */
export interface CheckIn extends BaseRecord {
  relationship_id: string;
  author: Author;
  /** Local YYYY-MM-DD key — one check-in per person per day (editable all day). */
  date_key: string;
  mood: Mood;
  note: string;
}

/** Log of exports performed (for the user's own reference). */
export interface ExportRecord {
  id: string;
  created_at: number;
  item_count: number;
  schema_version: number;
}

export type ThemeChoice = 'system' | 'light' | 'dark';

/** Singleton app/device settings (id === 'app'). */
export interface AppSettings {
  id: 'app';
  onboarded: boolean;
  theme: ThemeChoice;
  persistent_storage_granted: boolean | null;
  schema_version: number;
}

/** Names of tables that hold soft-deletable user content. */
export type SoftDeletableTable =
  | 'relationships'
  | 'answers'
  | 'memories'
  | 'journalEntries'
  | 'datePlans'
  | 'messages'
  | 'checkIns'
  | 'dailyScriptures'
  | 'notes';

/** A unified Recently Deleted row, derived from `deleted_at`. */
export interface DeletedItem {
  table: SoftDeletableTable;
  id: string;
  deleted_at: number;
  label: string;
}

/**
 * A full DECRYPTED snapshot of user content for export/import (Constitution
 * Part 3 §4 — the user owns their data and can take it with them). Content is
 * plaintext here so a backup is portable and human-readable; it is re-encrypted
 * on import with the importing device's key.
 */
export interface BackupData {
  relationships: Relationship[];
  answers: Answer[];
  memories: Memory[];
  journalEntries: JournalEntry[];
  /** Absent in pre-full-app backups; import tolerates the omission. */
  datePlans?: DatePlan[];
  messages?: Message[];
  checkIns?: CheckIn[];
  settings: AppSettings | null;
}
