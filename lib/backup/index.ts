/**
 * Backup file format for export/import. The DatabaseService produces/consumes a
 * decrypted `BackupData` snapshot; this module wraps it in a small, versioned
 * envelope, (de)serialises it, and offers a browser download helper.
 *
 * The exported file is plaintext JSON the user owns — it is their data to keep,
 * move between devices, or archive (Constitution Part 3 §4). Because local
 * persistence is never guaranteed, export is the durability backstop.
 */
import type { BackupData } from '../database/types';

export const BACKUP_FORMAT = 'aveyra-backup';
export const BACKUP_VERSION = 1;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  exported_at: number;
  data: BackupData;
}

/** Serialise a snapshot to a pretty JSON backup string. */
export function serializeBackup(data: BackupData, at: number = Date.now()): string {
  const file: BackupFile = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exported_at: at,
    data,
  };
  return JSON.stringify(file, null, 2);
}

/** Parse and validate a backup file, returning its snapshot. Throws on invalid. */
export function parseBackup(text: string): BackupData {
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    throw new Error("This file isn't valid JSON, so it can't be an Aveyra backup.");
  }
  const f = file as Partial<BackupFile>;
  if (!f || f.format !== BACKUP_FORMAT || f.version !== BACKUP_VERSION || !f.data) {
    throw new Error("This file isn't a recognised Aveyra backup.");
  }
  // The content tables, when present, must be arrays — reject a clearly
  // malformed file up front rather than failing partway through an import.
  const d = f.data as unknown as Record<string, unknown>;
  for (const key of ['relationships', 'answers', 'memories', 'journalEntries']) {
    if (d[key] !== undefined && !Array.isArray(d[key])) {
      throw new Error('This backup file is malformed.');
    }
  }
  return f.data;
}

/** A friendly, dated filename for a backup. */
export function suggestedFilename(at: Date = new Date()): string {
  return `aveyra-backup-${at.toISOString().slice(0, 10)}.json`;
}

/** Trigger a browser download of a backup string (no-op outside the browser). */
export function downloadBackup(text: string, filename: string): void {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
