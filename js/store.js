/* ============================================================================
   store.js — Offline-first data layer.

   Design:
   • Structured app state lives in localStorage as one JSON document
     (small, synchronous, easy to export/import as a single backup file).
   • Large binary blobs (memory photos) live in IndexedDB, keyed by id, so
     we never bloat localStorage and stay well within quota.
   • A tiny pub/sub lets views re-render on change.
   • All data stays on-device. Nothing is transmitted anywhere.
   ========================================================================== */

const LS_KEY = 'ours.state.v1';
const IDB_NAME = 'ours-media';
const IDB_STORE = 'photos';

// ── Default document ───────────────────────────────────────────────────────
function freshState() {
  return {
    profile: {
      onboarded: false,
      you: '',
      partner: '',
      anniversary: '',        // ISO date string
      loveLanguageYou: '',
      loveLanguagePartner: '',
      theme: 'auto',          // 'auto' | 'light' | 'dark'
    },
    notes: [],        // {id,title,body,type,createdAt,updatedAt}
    memories: [],     // {id,title,note,date,hasPhoto,createdAt}
    dates: [],        // {id,label,date,recurring,createdAt}  (countdowns/anniversaries)
    goals: [],        // {id,text,done,createdAt}
    coupons: [],      // {id,title,note,redeemed,createdAt}
    checkins: [],     // {id,date,mood,gratitude,createdAt}
    plans: [],        // {id,idea,done,createdAt}  (date planner)
    streak: { count: 0, last: '' },
    seenDeck: [],     // indices already drawn (avoid repeats until exhausted)
    meta: { created: Date.now(), version: 1 },
  };
}

// ── Load / migrate ─────────────────────────────────────────────────────────
function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    // shallow-merge to tolerate future additions
    return { ...freshState(), ...parsed, profile: { ...freshState().profile, ...parsed.profile } };
  } catch {
    return freshState();
  }
}

export const state = load();

// ── Pub/sub ────────────────────────────────────────────────────────────────
const subs = new Set();
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }

let saveTimer = null;
export function commit() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Save failed (quota?)', e); }
  }, 120);
  subs.forEach(fn => fn());
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* Streak: increment when the couple engages on a new day; reset if a day is
   skipped. Healthy-by-design — it never punishes, only celebrates continuity. */
export function touchStreak() {
  const today = todayISO();
  const { last, count } = state.streak;
  if (last === today) return;
  const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  state.streak.count = (last === yest) ? count + 1 : 1;
  state.streak.last = today;
  commit();
}

// ── IndexedDB (photos) ──────────────────────────────────────────────────────
let dbPromise = null;
function db() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
async function idbTx(mode, fn) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction(IDB_STORE, mode);
    const store = tx.objectStore(IDB_STORE);
    const out = fn(store);
    tx.oncomplete = () => resolve(out?.result);
    tx.onerror = () => reject(tx.error);
  });
}
export const photos = {
  put: (id, blob) => idbTx('readwrite', s => s.put(blob, id)),
  get: (id) => idbTx('readonly', s => s.get(id)),
  del: (id) => idbTx('readwrite', s => s.delete(id)),
  async all() {
    const d = await db();
    return new Promise((resolve, reject) => {
      const out = {};
      const tx = d.transaction(IDB_STORE, 'readonly');
      const cur = tx.objectStore(IDB_STORE).openCursor();
      cur.onsuccess = () => {
        const c = cur.result;
        if (c) { out[c.key] = c.value; c.continue(); } else resolve(out);
      };
      cur.onerror = () => reject(cur.error);
    });
  },
  async clear() { return idbTx('readwrite', s => s.clear()); },
};

// ── Backup: export / import as a single file ────────────────────────────────
// Photos are embedded as data URLs so a backup is one portable JSON file.
function blobToDataURL(blob) {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(blob);
  });
}
function dataURLtoBlob(url) {
  const [meta, b64] = url.split(',');
  const mime = /:(.*?);/.exec(meta)?.[1] || 'image/jpeg';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export async function exportBackup() {
  const media = {};
  const all = await photos.all();
  for (const [id, blob] of Object.entries(all)) media[id] = await blobToDataURL(blob);
  return JSON.stringify({ app: 'ours', exportedAt: new Date().toISOString(), state, media }, null, 2);
}

export async function importBackup(json) {
  const data = JSON.parse(json);
  if (data.app !== 'ours' || !data.state) throw new Error('Not an Ours backup file.');
  Object.assign(state, data.state);
  await photos.clear();
  if (data.media) {
    for (const [id, url] of Object.entries(data.media)) {
      await photos.put(id, dataURLtoBlob(url));
    }
  }
  commit();
}

export async function wipeAll() {
  localStorage.removeItem(LS_KEY);
  await photos.clear();
  Object.assign(state, freshState());
  commit();
}
