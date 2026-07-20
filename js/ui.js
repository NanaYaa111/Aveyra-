/* ============================================================================
   ui.js — Tiny DOM utilities, icon set, toast, modal, and a hash router.
   Kept dependency-free and small for fast startup and low memory use.
   ========================================================================== */

// ── Element builder: el('div.card', {onclick}, [children]) ─────────────────
export function el(spec, props = {}, children = []) {
  const [tag, ...classes] = spec.split('.');
  const node = document.createElement(tag || 'div');
  if (classes.length) node.className = classes.join(' ');
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k in node && k !== 'list') { try { node[k] = v; } catch { node.setAttribute(k, v); } }
    else node.setAttribute(k, v);
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}
export const frag = (...nodes) => { const f = document.createDocumentFragment(); f.append(...nodes.flat().filter(Boolean)); return f; };
export const $ = (sel, root = document) => root.querySelector(sel);

// Escape untrusted user text before inserting as HTML.
export function esc(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Icons (inline SVG, currentColor) ───────────────────────────────────────
const P = (d) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const icon = {
  home:     P('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>'),
  heart:    P('<path d="M12 21s-7.5-4.6-10-9.3C.6 8.3 2.3 4.8 5.7 4.8c2 0 3.4 1.2 4.3 2.6.9-1.4 2.3-2.6 4.3-2.6 3.4 0 5.1 3.5 3.7 6.9C19.5 16.4 12 21 12 21Z"/>'),
  clock:    P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  photo:    P('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m4 18 5-5 4 3 3-2 4 4"/>'),
  pen:      P('<path d="M14 4 20 10 8 22H2v-6L14 4Z"/><path d="m12 6 6 6"/>'),
  target:   P('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
  cards:    P('<rect x="3" y="5" width="12" height="16" rx="2"/><path d="M8 5V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-1"/>'),
  ticket:   P('<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z"/><path d="M12 6v12" stroke-dasharray="2 3"/>'),
  smile:    P('<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>'),
  calendar: P('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>'),
  gear:     P('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  plus:     P('<path d="M12 5v14M5 12h14"/>'),
  x:        P('<path d="M6 6l12 12M18 6 6 18"/>'),
  menu:     P('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  check:    P('<path d="M20 6 9 17l-5-5"/>'),
  arrow:    P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  gift:     P('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8S9 8 8 6.5 8.5 3 10 4s2 4 2 4Zm0 0s3 0 4-1.5S15.5 3 14 4s-2 4-2 4Z"/>'),
  sparkle:  P('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>'),
};

// ── Toast ──────────────────────────────────────────────────────────────────
let toastWrap;
export function toast(msg) {
  if (!toastWrap) { toastWrap = el('div.toast-wrap'); document.body.append(toastWrap); }
  const t = el('div.toast', { text: msg, role: 'status' });
  toastWrap.append(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .25s'; setTimeout(() => t.remove(), 260); }, 2200);
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function modal({ title, body, actions = [] }) {
  const back = el('div.modal-back', { role: 'dialog', 'aria-modal': 'true', 'aria-label': title || 'Dialog' });
  const close = () => { back.style.opacity = '0'; setTimeout(() => back.remove(), 180); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const foot = actions.length ? el('div.modal-foot', {}, actions.map(a =>
    el('button.btn.' + (a.variant || 'btn-ghost'), { onclick: () => a.onClick?.(close) ?? close(), text: a.label })
  )) : null;
  const box = el('div.modal', {}, [
    el('div.modal-head', {}, [
      el('h2', { text: title || '' }),
      el('button.btn.btn-icon.btn-ghost', { html: icon.x, 'aria-label': 'Close', onclick: close }),
    ]),
    el('div.modal-body', {}, [body]),
    foot,
  ]);
  back.append(box);
  back.addEventListener('click', e => { if (e.target === back) close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(back);
  setTimeout(() => box.querySelector('input,textarea,button')?.focus(), 40);
  return close;
}

export function confirmDialog(message, onYes, { danger = true, yes = 'Delete' } = {}) {
  modal({
    title: 'Are you sure?',
    body: el('p.muted', { text: message }),
    actions: [
      { label: 'Cancel', variant: 'btn-ghost' },
      { label: yes, variant: danger ? 'btn-danger' : 'btn-primary', onClick: (close) => { onYes(); close(); } },
    ],
  });
}

// ── Router (hash based, offline-friendly) ──────────────────────────────────
const routes = new Map();
let notFound = null;
export function route(name, render) { routes.set(name, render); }
export function setNotFound(fn) { notFound = fn; }
export function go(name) { location.hash = '#/' + name; }
export function current() { return (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0]; }
let _handle = null;
export function startRouter(onChange) {
  _handle = () => {
    const name = current();
    const render = routes.get(name) || notFound;
    onChange?.(name);
    return render?.();
  };
  window.addEventListener('hashchange', _handle);
  return _handle;
}
// Re-render the current route in place (setting the same hash won't fire
// hashchange, so views call this after add/edit/delete to refresh).
export function refresh() { _handle?.(); }

// ── Date helpers ───────────────────────────────────────────────────────────
export function daysBetween(iso) {
  if (!iso) return null;
  const then = new Date(iso + 'T00:00:00');
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.round((now - then) / 864e5);
}
export function fmtDate(iso, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, opts);
}
export function nextOccurrence(iso, recurring = true) {
  // days until the next anniversary/birthday of a date (recurring yearly).
  const d = new Date(iso + 'T00:00:00');
  const now = new Date(); now.setHours(0, 0, 0, 0);
  if (!recurring) { const diff = Math.round((d - now) / 864e5); return { days: diff, date: d }; }
  const next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return { days: Math.round((next - now) / 864e5), date: next };
}
