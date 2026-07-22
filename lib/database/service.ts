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
  type BackupData,
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
    if (!(await this.keys.isInitialised())) await this.keys.initialise();
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
    const tables: SoftDeletableTable[] = ['relationships', 'answers', 'memories', 'journalEntries'];
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

  // ---- Memory ------------------------------------------------------------
  async createMemory(fields: CreatableFields<Memory>): Promise<Memory> {
    const rec = stamp<Memory>(fields);
    await this.db.memories.add(await this.encryptFields('memories', rec));
    await this.journal('memories', 'put', rec.id, rec.version);
    return rec;
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
    const [relationships, answers, memories, journalEntries] = await Promise.all([
      all<Relationship>('relationships'),
      all<Answer>('answers'),
      all<Memory>('memories'),
      all<JournalEntry>('journalEntries'),
    ]);
    return {
      relationships,
      answers,
      memories,
      journalEntries,
      settings: (await this.db.settings.get('app')) ?? null,
    };
  }

  /**
   * Restore a snapshot, re-encrypting content with THIS device's key. Records
   * are upserted by id (idempotent re-import). Returns how many were written.
   */
  async importSnapshot(data: BackupData): Promise<{ imported: number }> {
    let imported = 0;
    const put = async (name: SoftDeletableTable, rows: BaseRecord[] = []): Promise<void> => {
      // `table(name)` is a union of EntityTables, so its `.put` is over-typed;
      // narrow to a put-shaped view (records are already the right shape).
      const table = this.table(name) as unknown as { put: (v: BaseRecord) => Promise<unknown> };
      for (const r of rows) {
        await table.put(await this.encryptFields(name, r));
        imported++;
      }
    };
    await put('relationships', data.relationships);
    await put('answers', data.answers);
    await put('memories', data.memories);
    await put('journalEntries', data.journalEntries);
    if (data.settings) await this.db.settings.put(data.settings);
    await this.recordExport(imported);
    return { imported };
  }
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
  }
}

/** Shared singleton for app use. Tests construct their own with a named DB. */
let service: DatabaseService | null = null;
export function getService(): DatabaseService {
  if (!service) service = new DatabaseService();
  return service;
}
