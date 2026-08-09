'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOnboarding } from '../relationship/context';
import { acknowledgeNote, createNote, getNotes, subscribeNotes } from './index';
import type { Note, NoteKind } from '../database/types';

export function useNotes() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState<NoteKind | null>(null);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const n = await getNotes(relId);
    setNotes(n);
    setLoading(false);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!relId) return;
    return subscribeNotes(relId, () => void refresh());
  }, [relId, refresh]);

  const saveNote = useCallback(async () => {
    if (!relId || !writing || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createNote(relId, writing, content);
      setContent('');
      setWriting(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }, [relId, writing, content, busy, refresh]);

  const acknowledgeNoteAction = useCallback(async (noteId: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await acknowledgeNote(noteId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not acknowledge.');
    } finally {
      setBusy(false);
    }
  }, [busy, refresh]);

  return {
    notes,
    loading,
    writing,
    setWriting,
    content,
    setContent,
    saveNote,
    acknowledgeNote: acknowledgeNoteAction,
    busy,
    error,
    partnerName,
  };
}
