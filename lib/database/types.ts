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
export type SoftDeletableTable = 'relationships' | 'answers' | 'memories' | 'journalEntries';

/** A unified Recently Deleted row, derived from `deleted_at`. */
export interface DeletedItem {
  table: SoftDeletableTable;
  id: string;
  deleted_at: number;
  label: string;
}
