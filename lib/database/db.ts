import Dexie, { type EntityTable } from 'dexie';
import type {
  User,
  Relationship,
  Question,
  Answer,
  RevealSession,
  Memory,
  JournalEntry,
  DatePlan,
  Message,
  CheckIn,
  ExportRecord,
  AppSettings,
} from './types';
import type { KeyVaultRecord } from '../encryption/keyManager';
import type { Mutation } from '../sync/types';

/**
 * The Aveyra local database (IndexedDB via Dexie). This is the canonical device
 * store and the source of truth — never a cache (Constitution Part 3 §3).
 *
 * Schema is versioned from the very first write so migrations are always
 * possible (Part 3 §5). `deleted_at` is indexed only where we page over it;
 * live/deleted filtering is done in memory, which is correct and simple at this
 * data scale (avoids Dexie's sparse-index pitfalls with null keys).
 *
 * A separate `DeletedItem` table from the Constitution's schema is intentionally
 * omitted: Recently Deleted is derived from `deleted_at` (Part 3 §12's single
 * source of truth), avoiding dual-write desync.
 */
export class AveyraDB extends Dexie {
  users!: EntityTable<User, 'id'>;
  relationships!: EntityTable<Relationship, 'id'>;
  questions!: EntityTable<Question, 'id'>;
  answers!: EntityTable<Answer, 'id'>;
  revealSessions!: EntityTable<RevealSession, 'id'>;
  memories!: EntityTable<Memory, 'id'>;
  journalEntries!: EntityTable<JournalEntry, 'id'>;
  datePlans!: EntityTable<DatePlan, 'id'>;
  messages!: EntityTable<Message, 'id'>;
  checkIns!: EntityTable<CheckIn, 'id'>;
  exportRecords!: EntityTable<ExportRecord, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;
  /**
   * Image bytes, keyed by ref (Memory.image_ref). Stored as ArrayBuffer + mime
   * rather than Blob so structured clone works across every IndexedDB
   * implementation. Kept out of the JSON tables and out of v1 backups.
   */
  images!: EntityTable<StoredImage, 'id'>;
  /** Key material (CryptoKey objects / wrapped keys). Never plaintext bytes. */
  keyvault!: EntityTable<KeyVaultRecord, 'id'>;
  /** Local mutation outbox — journalled changes awaiting a future sync (M2). */
  outbox!: EntityTable<Mutation, 'id'>;

  constructor(name = 'aveyra') {
    super(name);
    this.version(1).stores({
      users: 'id, device_id, is_self',
      relationships: 'id, status',
      questions: 'id, category',
      answers: 'id, question_id, created_at',
      revealSessions: 'id, question_id',
      memories: 'id, relationship_id, memory_date',
      journalEntries: 'id, owner_id, created_at',
      exportRecords: 'id, created_at',
      settings: 'id',
      images: 'id',
      keyvault: 'id',
      outbox: 'id, timestamp, synced',
    });
    // v2 (full app): shared date plans, the private message thread, and daily
    // emotional check-ins. Additive only — v1 stores carry over untouched.
    this.version(2).stores({
      datePlans: 'id, relationship_id, status, planned_for',
      messages: 'id, relationship_id, created_at',
      checkIns: 'id, relationship_id, date_key, created_at',
    });
  }
}

/** Row shape of the `images` store. */
export interface StoredImage {
  id: string;
  data: ArrayBuffer;
  mime: string;
}

let instance: AveyraDB | null = null;

/** Lazily construct the DB so it is only touched in the browser. */
export function getDB(): AveyraDB {
  if (!instance) instance = new AveyraDB();
  return instance;
}

/** Test/reset helper: swap in a named DB instance. */
export function __setDB(db: AveyraDB) {
  instance = db;
}
