import { getDB, type AveyraDB } from './db';
import { getOutbox, type Outbox } from '../sync/outbox';
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
} from './types';

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
  constructor(
    private db: AveyraDB = getDB(),
    private outbox: Outbox = getOutbox(),
  ) {}

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

  /** All live (non-deleted) rows in a soft-deletable table. */
  async listLive<T extends BaseRecord>(name: SoftDeletableTable): Promise<T[]> {
    const rows = (await this.table(name).toArray()) as unknown as T[];
    return rows.filter(isLive);
  }

  async get<T extends BaseRecord>(name: SoftDeletableTable, id: string): Promise<T | undefined> {
    return (await this.table(name).get(id)) as unknown as T | undefined;
  }

  /** Soft delete: mark deleted, never remove (Part 3 §12). Returns an undo fn. */
  async softDelete(name: SoftDeletableTable, id: string): Promise<() => Promise<void>> {
    await this.table(name).update(id, { deleted_at: now() });
    await this.journal(name, 'put', id, 0);
    return async () => {
      await this.table(name).update(id, { deleted_at: null, updated_at: now() });
      await this.journal(name, 'put', id, 0);
    };
  }

  /** Restore a soft-deleted record from Recently Deleted. */
  async restore(name: SoftDeletableTable, id: string): Promise<void> {
    await this.table(name).update(id, { deleted_at: null, updated_at: now() });
    await this.journal(name, 'put', id, 0);
  }

  /**
   * Permanently remove a record. The ONLY hard delete — reachable only from an
   * explicit user action in Recently Deleted, never automatically (Part 2 §4.4).
   */
  async purge(name: SoftDeletableTable, id: string): Promise<void> {
    await this.table(name).delete(id);
    await this.journal(name, 'delete', id, 0);
  }

  /** Recently Deleted, unified across tables and sorted newest-first. */
  async recentlyDeleted(): Promise<DeletedItem[]> {
    const tables: SoftDeletableTable[] = ['relationships', 'answers', 'memories', 'journalEntries'];
    const out: DeletedItem[] = [];
    for (const t of tables) {
      const rows = (await this.db[t].toArray()) as unknown as BaseRecord[];
      for (const r of rows) {
        if (r.deleted_at !== null) {
          out.push({ table: t, id: r.id, deleted_at: r.deleted_at, label: labelFor(t, r) });
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
    await this.db.relationships.add(rec);
    await this.journal('relationships', 'put', rec.id, rec.version);
    return rec;
  }
  async getRelationship(): Promise<Relationship | undefined> {
    const all = (await this.db.relationships.toArray()).filter(isLive);
    return all[0];
  }
  async updateRelationship(id: string, patch: Partial<Relationship>): Promise<void> {
    const existing = await this.db.relationships.get(id);
    const version = (existing?.version ?? 0) + 1;
    await this.db.relationships.update(id, { ...patch, updated_at: now(), version });
    await this.journal('relationships', 'put', id, version);
  }

  // ---- Answer ------------------------------------------------------------
  async createAnswer(fields: CreatableFields<Answer>): Promise<Answer> {
    const rec = stamp<Answer>(fields);
    await this.db.answers.add(rec);
    await this.journal('answers', 'put', rec.id, rec.version);
    return rec;
  }

  // ---- Memory ------------------------------------------------------------
  async createMemory(fields: CreatableFields<Memory>): Promise<Memory> {
    const rec = stamp<Memory>(fields);
    await this.db.memories.add(rec);
    await this.journal('memories', 'put', rec.id, rec.version);
    return rec;
  }

  // ---- Journal -----------------------------------------------------------
  async createJournalEntry(fields: CreatableFields<JournalEntry>): Promise<JournalEntry> {
    const rec = stamp<JournalEntry>(fields);
    await this.db.journalEntries.add(rec);
    await this.journal('journalEntries', 'put', rec.id, rec.version);
    return rec;
  }
  async updateJournalEntry(id: string, patch: Partial<JournalEntry>): Promise<void> {
    const existing = await this.db.journalEntries.get(id);
    const version = (existing?.version ?? 0) + 1;
    await this.db.journalEntries.update(id, { ...patch, updated_at: now(), version });
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
