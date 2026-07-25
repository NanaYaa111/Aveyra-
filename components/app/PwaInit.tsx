'use client';

import { useEffect } from 'react';
import { requestPersistentStorage } from '@/lib/platform/storage';
import { getService } from '@/lib/database';


export function PwaInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      } else {
        // Dev: a cached worker can serve stale HTML/chunks across restarts and
        // look like a broken app. Clear any prior registration + caches instead
        // of registering a new one.
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister());
        });
        if (typeof caches !== 'undefined') {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
      }
    }
    // Ask once; browsers may defer granting until the app earns engagement.
    // Record the outcome so Settings can reflect it honestly.
    requestPersistentStorage()
      .then((granted) => getService().updateSettings({ persistent_storage_granted: granted }))
      .catch(() => {});
  }, []);

  return null;
}
