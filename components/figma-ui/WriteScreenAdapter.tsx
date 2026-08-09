'use client';

import { LoadingState, EmptyState, Btn } from './primitives';
import { useState, useEffect, useCallback } from 'react';
import { getEntries, createEntry } from '@/lib/journal';
import type { JournalEntry } from '@/lib/database/types';

export function WriteScreenAdapter() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const j = await getEntries();
    setEntries(j);
    setLoading(false);
  }, []);

  const save = useCallback(async () => {
    if (!content.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createEntry({ content });
      setContent('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save entry.');
    } finally {
      setBusy(false);
    }
  }, [content, refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Write
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>Private reflections for only you.</div>
      </div>

      <div className="mb-8 rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)' }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Your entry"
          aria-label="Your entry"
          rows={5}
          className="w-full rounded-xl px-4 py-3 text-sm mb-4"
          style={{
            backgroundColor: 'var(--color-well)',
            border: '1px solid var(--color-edge)',
            color: 'var(--color-ink)',
            fontSize: 14,
            outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--color-edge)' }}
        />
        <Btn onClick={() => void save()} disabled={busy || !content.trim()}>
          {busy ? 'Saving…' : 'Save entry'}
        </Btn>
        {error && <div style={{ fontSize: 13, color: 'var(--color-alert)', marginTop: 8 }}>{error}</div>}
      </div>

      {loading ? null : entries && entries.length === 0 ? (
        <EmptyState
          icon="✍️"
          title="Nothing written yet"
          body="Your private thoughts and reflections start here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {entries?.map((entry) => (
            <div key={entry.id} className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>
                {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
