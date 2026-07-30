'use client';

import { useEffect, useState } from 'react';

/**
 * Connection state, for graceful disconnection (Constitution: web-first drops
 * the offline-first *promise* but keeps calm, honest disconnected states — never
 * a data-loss alarm). This is a lightweight signal off the browser's own
 * online/offline events; it says "the network is up," not "the server answered."
 *
 * SSR-safe: assumes online when there's no `navigator` (server render), so the
 * first paint never flashes an offline notice.
 */
export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function useConnection(): { online: boolean } {
  const [online, setOnline] = useState(isOnline);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    // Reconcile with reality on mount in case it changed before we listened.
    setOnline(isOnline());
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return { online };
}
