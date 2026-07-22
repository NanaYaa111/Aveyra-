'use client';

import { useEffect } from 'react';
import { requestPersistentStorage } from '@/lib/platform/storage';
import { getService } from '@/lib/database';

/**
 * Client-side platform init: registers the offline service worker and requests
 * durable storage. Renders nothing. Failures are swallowed — the app is fully
 * usable without either (Constitution Part 2 §5, Part 3 §4).
 */
export function PwaInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    // Ask once; browsers may defer granting until the app earns engagement.
    // Record the outcome so Settings can reflect it honestly.
    requestPersistentStorage()
      .then((granted) => getService().updateSettings({ persistent_storage_granted: granted }))
      .catch(() => {});
  }, []);

  return null;
}
