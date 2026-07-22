'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { getService } from '@/lib/database';
import { serializeBackup, parseBackup, downloadBackup, suggestedFilename } from '@/lib/backup';

/**
 * Export / import controls (Constitution Part 3 §4). Export downloads a
 * decrypted JSON backup the user owns; import restores one, re-encrypting on
 * this device. Functional-minimal — visual design is deliberately restrained
 * pending the Settings design pass.
 */
export function DataControls() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    try {
      const snapshot = await getService().exportSnapshot();
      downloadBackup(serializeBackup(snapshot), suggestedFilename());
      setStatus({ text: 'Your backup has been downloaded.', error: false });
    } catch {
      setStatus({ text: 'Something went wrong preparing your backup. Please try again.', error: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const data = parseBackup(await file.text());
      const { imported } = await getService().importSnapshot(data);
      setStatus({
        text: `Restored ${imported} item${imported === 1 ? '' : 's'} from your backup.`,
        error: false,
      });
    } catch (err) {
      setStatus({
        text: err instanceof Error ? err.message : 'That backup could not be read.',
        error: true,
      });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={handleExport} disabled={busy}>
          Export a backup
        </Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={busy}>
          Import a backup
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={handleImport}
          tabIndex={-1}
          aria-hidden
        />
      </div>
      {status && (
        <p
          role={status.error ? 'alert' : 'status'}
          aria-live={status.error ? 'assertive' : 'polite'}
          className="text-label text-text-soft"
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
