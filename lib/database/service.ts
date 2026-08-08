import { getDB, type AveyraDB } from './db';
import { getOutbox, type Outbox } from '../sync/outbox';
import { KeyManager } from '../encryption/keyManager';
import { Cipher } from '../encryption/cipher';
import type { MutationOp } from '../sync/types';
import {
  SCHEMA_VERSION,
  type BaseRecord,
  type SoftDeletableTable,
  type DeletedItem,
  type AppSettings,
  type Relationship,
  type Answer,
  type Memory,
  type JournalEntry,
  type DatePlan,
  type Message,
  type CheckIn,
  type DailyScripture,
  type Note,
  type BackupData,
  type ThemeChoice,
} from './types';

/**
 * Content fields encrypted at rest, per table (Constitution Part 3 §9). Index
 * and metadata fields (ids, timestamps, category, question_id, memory_date)
 * stay plaintext so the store remains queryable.
 */
const ENCRYPTED_FIELDS: Record<SoftDeletableTable, readonly string[]> = {
  relationships: ['partner_name'],
  answers: ['content'],
  memories: ['title', 'description'],
  journalEntries: ['title', 'content'],
  datePlans: ['title', 'notes'],
  messages: ['content'],
  // `mood` stays plaintext: a six-value enum used for display, not prose.
  checkIns: ['note'],
  // `reference` stays plaintext — it's a citation, not private prose.
  dailyScriptures: ['text', 'chooser_note', 'response'],
  // `kind` stays plaintext so notes can be listed by kind without decrypting.
  notes: ['content'],
};

/** Stable id + time helpers. */
export function newId(): string {
  return crypto.randomUUID();
}
export function now(): number {
  return Date.now();
}

/** Fields the caller supplies when creating a record (the rest is derived). */
type CreatableFields<T extends BaseRecord> = Omit<
  T,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'schema_version' | 'version'
>;

function stamp<T extends BaseRecord>(fields: CreatableFields<T>): T {
  const ts = now();
  return {
    ...(fields as object),
    id: newId(),
    created_at: ts,
    updated_at: ts,
    deleted_at: null,
    schema_version: SCHEMA_VERSION,
    version: 1,
  } as T;
}

const isLive = <T extends BaseRecord>(r: T): boolean => r.deleted_at === null;

/**
 * The Database Service — the ONLY path between the app and IndexedDB
 * (Constitution Part 4 §2.4). Encryption of content fields is layered on top
 * of this in a later step; the service itself stays storage-focused.
 */
export class DatabaseService {
  private vaultReady = false;

  constructor(
    private db: AveyraDB = getDB(),
    private outbox: Outbox = getOutbox(),
    private keys: KeyManager = new KeyManager(db),
    private cipher: Cipher = new Cipher(keys),
  ) {}

  /**
   * Ensure a content key exists before encrypting/decrypting. Auto-initialises
   * a no-passphrase vault on first use (honest: protects data at rest against
   * casual inspection, not device compromise — see KeyManager). Idempotent.
   */
  private async ready(): Promise<void> {
    if (this.vaultReady) return;
    await this.keys.initialise(); // idempotent + concurrency-safe (serialised)
    // Warm the in-memory content key so later encrypt/decrypt need no DB read
    // (important inside a Dexie transaction, whose scope excludes the keyvault).
    await this.keys.getDataKey();
    this.vaultReady = true;
  }

  /** Encrypt the designated content fields of a record or patch (copy). */
  private async encryptFields<T extends object>(name: SoftDeletableTable, rec: T): Promise<T> {
    await this.ready();
    const out = { ...rec } as Record<string, unknown>;
    for (const f of ENCRYPTED_FIELDS[name]) {
      const v = out[f];
      if (typeof v === 'string' && v.length > 0) out[f] = await this.cipher.encrypt(v);
    }
    return out as T;
  }

  /** Decrypt the designated content fields of a stored record (copy). */
  private async decryptFields<T extends object>(name: SoftDeletableTable, rec: T): Promise<T> {
    await this.ready();
    const out = { ...rec } as Record<string, unknown>;
    for (const f of ENCRYPTED_FIELDS[name]) {
      const v = out[f];
      if (typeof v === 'string') out[f] = await this.cipher.decrypt(v);
    }
    return out as T;
  }

  /**
   * Journal a mutation to the outbox for future sync. Non-blocking to the write
   * path and metadata-only in Milestone 1 (no plaintext payload; encrypted
   * payloads arrive with the real transport in M2).
   */
  private async journal(table: string, op: MutationOp, id: string, version: number): Promise<void> {
    await this.outbox.record(table, op, id, version);
  }

  // ---- Generic soft-deletable CRUD --------------------------------------
  private table(name: SoftDeletableTable) {
    return this.db[name];
  }

  /** All live (non-deleted) rows in a soft-deletable table (decrypted). */
  async listLive<T extends BaseRecord>(name: SoftDeletableTable): Promise<T[]> {
    const rows = (await this.table(name).toArray()) as unknown as T[];
    const live = rows.filter(isLive);
    return Promise.all(live.map((r) => this.decryptFields(name, r)));
  }

  async get<T extends BaseRecord>(name: SoftDeletableTable, id: string): Promise<T | undefined> {
    const row = (await this.table(name).get(id)) as unknown as T | undefined;
    return row ? this.decryptFields(name, row) : undefined;
  }

  /** Next monotonic version for a record (0 if it is gone). */
  private async nextVersion(name: SoftDeletableTable, id: string): Promise<number> {
    const existing = (await this.table(name).get(id)) as unknown as BaseRecord | undefined;
    return (existing?.version ?? 0) + 1;
  }

  /** Soft delete: mark deleted, never remove (Part 3 §12). Returns an undo fn. */
  async softDelete(name: SoftDeletableTable, id: string): Promise<() => Promise<void>> {
    const version = await this.nextVersion(name, id);
    await this.table(name).update(id, { deleted_at: now(), updated_at: now(), version });
    await this.journal(name, 'put', id, version);
    return async () => {
      const v = await this.nextVersion(name, id);
      await this.table(name).update(id, { deleted_at: null, updated_at: now(), version: v });
      await this.journal(name, 'put', id, v);
    };
  }

  /** Restore a soft-deleted record from Recently Deleted. */
  async restore(name: SoftDeletableTable, id: string): Promise<void> {
    const version = await this.nextVersion(name, id);
    await this.table(name).update(id, { deleted_at: null, updated_at: now(), version });
    await this.journal(name, 'put', id, version);
  }

  /**
   * Permanently remove a record. The ONLY hard delete — reachable only from an
   * explicit user action in Recently Deleted, never automatically (Part 2 §4.4).
   */
  async purge(name: SoftDeletableTable, id: string): Promise<void> {
    const version = await this.nextVersion(name, id);
    await this.table(name).delete(id);
    await this.journal(name, 'delete', id, version);
  }

  /** Recently Deleted, unified across tables and sorted newest-first. */
  async recentlyDeleted(): Promise<DeletedItem[]> {
    const tables: SoftDeletableTable[] = [
      'relationships',
      'answers',
      'memories',
      'journalEntries',
      'datePlans',
      'messages',
      'checkIns',
      'dailyScriptures',
      'notes',
    ];
    const out: DeletedItem[] = [];
    for (const t of tables) {
      const rows = (await this.db[t].toArray()) as unknown as BaseRecord[];
      for (const r of rows) {
        if (r.deleted_at !== null) {
          // Only the label fields need decrypting; id/deleted_at are metadata.
          const dec = await this.decryptFields(t, r);
          out.push({ table: t, id: r.id, deleted_at: r.deleted_at, label: labelFor(t, dec) });
        }
      }
    }
    return out.sort((a, b) => b.deleted_at - a.deleted_at);
  }

  // ---- Relationship ------------------------------------------------------
  async createRelationship(
    fields: CreatableFields<Relationship>,
  ): Promise<Relationship> {
    const rec = stamp<Relationship>(fields);
    await this.db.relationships.add(await this.encryptFields('relationships', rec));
    await this.journal('relationships', 'put', rec.id, rec.version);
    return rec;
  }
  async getRelationship(): Promise<Relationship | undefined> {
    const first = (await this.db.relationships.toArray()).filter(isLive)[0];
    return first ? this.decryptFields('relationships', first) : undefined;
  }
  async updateRelationship(id: string, patch: Partial<Relationship>): Promise<void> {
    const existing = await this.db.relationships.get(id);
    const version = (existing?.version ?? 0) + 1;
    const encPatch = await this.encryptFields('relationships', { ...patch });
    await this.db.relationships.update(id, { ...encPatch, updated_at: now(), version });
    await this.journal('relationships', 'put', id, version);
  }

  // ---- Answer ------------------------------------------------------------
  async createAnswer(fields: CreatableFields<Answer>): Promise<Answer> {
    const rec = stamp<Answer>(fields);
    await this.db.answers.add(await this.encryptFields('answers', rec));
    await this.journal('answers', 'put', rec.id, rec.version);
    return rec;
  }
  async updateAnswer(id: string, patch: Partial<Answer>): Promise<void> {
    const existing = await this.db.answers.get(id);
    const version = (existing?.version ?? 0) + 1;
    const encPatch = await this.encryptFields('answers', { ...patch });
    await this.db.answers.update(id, { ...encPatch, updated_at: now(), version });
    await this.journal('answers', 'put', id, version);
  }

  // ---- Memory ------------------------------------------------------------
  async createMemory(fields: CreatableFields<Memory>): Promise<Memory> {
    const rec = stamp<Memory>(fields);
    await this.db.memories.add(await this.encryptFields('memories', rec));
    await this.journal('memories', 'put', rec.id, rec.version);
    return rec;
  }

  // ---- Date plans --------------------------------------------------------
  async createDatePlan(fields: CreatableFields<DatePlan>): Promise<DatePlan> {
    const rec = stamp<DatePlan>(fields);
    await this.db.datePlans.add(await this.encryptFields('datePlans', rec));
    await this.journal('datePlans', 'put', rec.id, rec.version);
    return rec;
  }
  async updateDatePlan(id: string, patch: Partial<DatePlan>): Promise<void> {
    const existing = await this.db.datePlans.get(id);
    const version = (existing?.version ?? 0) + 1;
    const encPatch = await this.encryptFields('datePlans', { ...patch });
    await this.db.datePlans.update(id, { ...encPatch, updated_at: now(), version });
    await this.journal('datePlans', 'put', id, version);
  }

  // ---- Messages ----------------------------------------------------------
  async createMessage(fields: CreatableFields<Message>): Promise<Message> {
    const rec = stamp<Message>(fields);
    await this.db.messages.add(await this.encryptFields('messages', rec));
    await this.journal('messages', 'put', rec.id, rec.version);
    return rec;
  }

  // ---- Check-ins ---------------------------------------------------------
  async createCheckIn(fields: CreatableFields<CheckIn>): Promise<CheckIn> {
    const rec = stamp<CheckIn>(fields);
    await this.db.checkIns.add(await this.encryptFields('checkIns', rec));
    await this.journal('checkIns', 'put', rec.id, rec.version);
    return rec;
  }
  async updateCheckIn(id: string, patch: Partial<CheckIn>): Promise<void> {
    const existing = await this.db.checkIns.get(id);
    const version = (existing?.version ?? 0) + 1;
    const encPatch = await this.encryptFields('checkIns', { ...patch });
    await this.db.checkIns.update(id, { ...encPatch, updated_at: now(), version });
    await this.journal('checkIns', 'put', id, version);
  }

  // ---- Images (memory photos) --------------------------------------------
  /** Store image bytes; returns the ref to keep in `Memory.image_ref`. */
  async putImage(data: ArrayBuffer, mime: string): Promise<string> {
    const id = newId();
    await this.db.images.put({ id, data, mime });
    return id;
  }
  async getImage(ref: string): Promise<{ data: ArrayBuffer; mime: string } | undefined> {
    return this.db.images.get(ref);
  }
  async deleteImage(ref: string): Promise<void> {
    await this.db.images.delete(ref);
  }

  // ---- Daily scripture ---------------------------------------------------
  async createDailyScripture(fields: CreatableFields<DailyScripture>): Promise<DailyScripture> {
    const rec = stamp<DailyScripture>(fields);
    await this.db.dailyScriptures.add(await this.encryptFields('dailyScriptures', rec));
    await this.journal('dailyScriptures', 'put', rec.id, rec.version);
    return rec;
  }
  async updateDailyScripture(id: string, patch: Partial<DailyScripture>): Promise<void> {
    const existing = await this.db.dailyScriptures.get(id);
    const version = (existing?.version ?? 0) + 1;
    const encPatch = await this.encryptFields('dailyScriptures', { ...patch });
    await this.db.dailyScriptures.update(id, { ...encPatch, updated_at: now(), version });
    await this.journal('dailyScriptures', 'put', id, version);
  }

  // ---- Notes -------------------------------------------------------------
  async createNote(fields: CreatableFields<Note>): Promise<Note> {
    const rec = stamp<Note>(fields);
    await this.db.notes.add(await this.encryptFields('notes', rec));
    await this.journal('notes', 'put', rec.id, rec.version);
    return rec;
  }
  async updateNote(id: string, patch: Partial<Note>): Promise<void> {
    const existing = await this.db.notes.get(id);
    const version = (existing?.version ?? 0) + 1;
    const encPatch = await this.encryptFields('notes', { ...patch });
    await this.db.notes.update(id, { ...encPatch, updated_at: now(), version });
    await this.journal('notes', 'put', id, version);
  }

  // ---- Vault (end-to-end encrypted) --------------------------------------
  /**
   * Vault payloads arrive already encrypted with the shared E2EE key, so they
   * bypass this service's field encryption entirely — wrapping ciphertext in a
   * weaker device-local key would add nothing and imply protection it doesn't
   * give. Hard delete only; these rows never enter Recently Deleted.
   */
  async addVaultLocal(relationshipId: string, payload: string): Promise<void> {
    await this.db.vaultItems.add({ id: newId(), relationship_id: relationshipId, payload, created_at: now() });
  }
  async listVaultLocal(relationshipId: string) {
    const rows = await this.db.vaultItems.where('relationship_id').equals(relationshipId).toArray();
    return rows.sort((a, b) => b.created_at - a.created_at);
  }
  async getVaultLocal(id: string): Promise<string | null> {
    return (await this.db.vaultItems.get(id))?.payload ?? null;
  }
  async deleteVaultLocal(id: string): Promise<void> {
    await this.db.vaultItems.delete(id);
  }

  // ---- Journal -----------------------------------------------------------
  async createJournalEntry(fields: CreatableFields<JournalEntry>): Promise<JournalEntry> {
    const rec = stamp<JournalEntry>(fields);
    await this.db.journalEntries.add(await this.encryptFields('journalEntries', rec));
    await this.journal('journalEntries', 'put', rec.id, rec.version);
    return rec;
  }
  async updateJournalEntry(id: string, patch: Partial<JournalEntry>): Promise<void> {
    const existing = await this.db.journalEntries.get(id);
    const version = (existing?.version ?? 0) + 1;
    const encPatch = await this.encryptFields('journalEntries', { ...patch });
    await this.db.journalEntries.update(id, { ...encPatch, updated_at: now(), version });
    await this.journal('journalEntries', 'put', id, version);
  }

  // ---- Settings ----------------------------------------------------------
  async getSettings(): Promise<AppSettings> {
    const existing = await this.db.settings.get('app');
    if (existing) return existing;
    const fresh: AppSettings = {
      id: 'app',
      onboarded: false,
      theme: 'system',
      persistent_storage_granted: null,
      schema_version: SCHEMA_VERSION,
    };
    await this.db.settings.put(fresh);
    return fresh;
  }
  async updateSettings(patch: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings> {
    const current = await this.getSettings();
    const next = { ...current, ...patch };
    await this.db.settings.put(next);
    return next;
  }

  // ---- Export bookkeeping ------------------------------------------------
  async recordExport(itemCount: number): Promise<void> {
    await this.db.exportRecords.add({
      id: newId(),
      created_at: now(),
      item_count: itemCount,
      schema_version: SCHEMA_VERSION,
    });
  }

  // ---- Backup (export / import) -----------------------------------------
  /**
   * A full DECRYPTED snapshot of user content (live + soft-deleted, so a backup
   * never silently drops Recently Deleted). The user owns their data (Part 3
   * §4). Note: image blobs are not yet included — a v1 limitation.
   */
  async exportSnapshot(): Promise<BackupData> {
    const all = async <T extends BaseRecord>(name: SoftDeletableTable): Promise<T[]> => {
      const rows = (await this.table(name).toArray()) as unknown as T[];
      return Promise.all(rows.map((r) => this.decryptFields(name, r)));
    };
    const [relationships, answers, memories, journalEntries, datePlans, messages, checkIns] =
      await Promise.all([
        all<Relationship>('relationships'),
        all<Answer>('answers'),
        all<Memory>('memories'),
        all<JournalEntry>('journalEntries'),
        all<DatePlan>('datePlans'),
        all<Message>('messages'),
        all<CheckIn>('checkIns'),
      ]);
    return {
      relationships,
      answers,
      memories,
      journalEntries,
      datePlans,
      messages,
      checkIns,
      settings: (await this.db.settings.get('app')) ?? null,
    };
  }

  /**
   * Restore a snapshot, re-encrypting content with THIS device's key.
   *
   * Hardened against malformed/hostile files and data loss:
   *  - ATOMIC: the whole restore runs in one transaction, so a bad row rolls
   *    the entire import back (no half-restored state).
   *  - NON-DESTRUCTIVE MERGE: a record is written only if the backup's version
   *    is >= the local version, so importing a stale backup never silently
   *    discards newer local edits.
   *  - VALIDATED: non-array tables and structurally-invalid rows are skipped;
   *    settings are sanitised to the singleton.
   *  - JOURNALLED: each write is recorded to the outbox so restored data syncs.
   *
   * Records are upserted by id, so re-import is idempotent. Returns how many
   * rows were written. (Image blobs are not yet part of a backup — a v1 limit.)
   */
  async importSnapshot(data: BackupData): Promise<{ imported: number }> {
    await this.ready();
    const tables: SoftDeletableTable[] = [
      'relationships',
      'answers',
      'memories',
      'journalEntries',
      'datePlans',
      'messages',
      'checkIns',
      'dailyScriptures',
      'notes',
    ];

    // Phase 1 (outside the transaction): validate + encrypt. Web Crypto awaits
    // are not Dexie operations and would prematurely commit a Dexie transaction,
    // so all crypto happens here; Phase 2 does only DB work.
    const prepared: { name: SoftDeletableTable; row: BaseRecord; version: number }[] = [];
    for (const name of tables) {
      const rows = (data as unknown as Record<string, unknown>)[name];
      if (!Array.isArray(rows)) continue; // tolerate a malformed/absent field
      for (const r of rows) {
        if (!isImportableRecord(r)) continue; // skip structurally-invalid rows
        prepared.push({ name, row: await this.encryptFields(name, r), version: r.version });
      }
    }
    const settings =
      data.settings && typeof data.settings === 'object' ? sanitiseSettings(data.settings) : null;

    // Phase 2: atomic write — only Dexie ops inside, so the transaction holds.
    let imported = 0;
    await this.db.transaction(
      'rw',
      [
        this.db.relationships,
        this.db.answers,
        this.db.memories,
        this.db.journalEntries,
        this.db.datePlans,
        this.db.messages,
        this.db.checkIns,
        this.db.outbox,
        this.db.settings,
      ],
      async () => {
        for (const p of prepared) {
          const table = this.table(p.name) as unknown as {
            get: (id: string) => Promise<BaseRecord | undefined>;
            put: (v: BaseRecord) => Promise<unknown>;
          };
          const existing = await table.get(p.row.id);
          if (existing && existing.version > p.version) continue; // keep newer local
          await table.put(p.row);
          await this.journal(p.name, 'put', p.row.id, p.version);
          imported++;
        }
        if (settings) await this.db.settings.put(settings);
      },
    );

    return { imported };
  }
}

/** True for a row safe to import (has the base identity/versioning fields). */
function isImportableRecord(r: unknown): r is BaseRecord {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.version === 'number' &&
    (o.deleted_at === null || typeof o.deleted_at === 'number')
  );
}

const VALID_THEMES: ThemeChoice[] = ['system', 'light', 'dark'];

/** Coerce imported settings to a valid singleton so a bad backup can't break it. */
function sanitiseSettings(s: Partial<AppSettings>): AppSettings {
  return {
    id: 'app',
    onboarded: s.onboarded === true,
    theme: VALID_THEMES.includes(s.theme as ThemeChoice) ? (s.theme as ThemeChoice) : 'system',
    persistent_storage_granted:
      typeof s.persistent_storage_granted === 'boolean' ? s.persistent_storage_granted : null,
    schema_version: SCHEMA_VERSION,
  };
}

function labelFor(table: SoftDeletableTable, r: BaseRecord): string {
  switch (table) {
    case 'memories':
      return (r as Memory).title || 'Memory';
    case 'journalEntries':
      return (r as JournalEntry).title || 'Journal entry';
    case 'answers':
      return 'Answer';
    case 'relationships':
      return (r as Relationship).partner_name || 'Relationship';
    case 'datePlans':
      return (r as DatePlan).title || 'Date plan';
    case 'messages':
      return 'Message';
    case 'checkIns':
      return 'Check-in';
    case 'dailyScriptures':
      return (r as DailyScripture).reference || 'Scripture';
    case 'notes':
      return 'Note';
  }
}

/** Shared singleton for app use. Tests construct their own with a named DB. */
let service: DatabaseService | null = null;
export function getService(): DatabaseService {
  if (!service) service = new DatabaseService();
  return service;
}
