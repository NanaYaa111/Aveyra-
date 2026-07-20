/* ============================================================================
   app.js — Application bootstrap: onboarding gate, navigation shell,
   router wiring, theme, and service-worker registration.
   ========================================================================== */
import { state, commit, uid } from './store.js';
import { el, icon, route, startRouter, go, toast } from './ui.js';
import * as V from './views.js';

const root = document.getElementById('app');

// ── Navigation model ───────────────────────────────────────────────────────
const NAV = [
  { id: 'home',     label: 'Dashboard',  ic: icon.home,     view: V.Dashboard },
  { id: 'memories', label: 'Memories',   ic: icon.photo,    view: V.Memories },
  { id: 'notes',    label: 'Notes',      ic: icon.pen,      view: V.Notes },
  { id: 'checkin',  label: 'Check-in',   ic: icon.smile,    view: V.Checkin },
  { id: 'dates',    label: 'Countdowns', ic: icon.clock,    view: V.Dates },
  { id: 'goals',    label: 'Goals',      ic: icon.target,   view: V.Goals },
  { id: 'deck',     label: 'Deck',       ic: icon.cards,    view: V.Deck },
  { id: 'plans',    label: 'Date ideas', ic: icon.calendar, view: V.Plans },
  { id: 'coupons',  label: 'Coupons',    ic: icon.ticket,   view: V.Coupons },
  { id: 'settings', label: 'Settings',   ic: icon.gear,     view: V.Settings },
];

// ── Theme ──────────────────────────────────────────────────────────────────
function applyTheme() {
  const t = state.profile.theme || 'auto';
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

// ── Onboarding ─────────────────────────────────────────────────────────────
function onboarding() {
  let step = 0;
  const draft = { you: '', partner: '', anniversary: '' };
  const shell = el('div.onboard');
  const card = el('div.card.card-pad.onboard-card');
  shell.append(card);

  const steps = [
    {
      title: 'Welcome to Ours',
      sub: 'A private, offline home for your relationship — memories, notes, check-ins and little joys, all on your device.',
      body: () => el('div.center', {}, [
        el('div', { style: 'font-size:3rem', text: '💞' }),
        el('p.muted.mt-3', { text: 'No accounts. No servers. Nothing leaves this device unless you export it.' }),
      ]),
      cta: 'Get started',
    },
    {
      title: 'What are your names?',
      sub: 'We use these to make the app feel like yours.',
      body: () => {
        const y = el('input.input.input-lg', { value: draft.you, placeholder: 'Your name', oninput: e => draft.you = e.target.value });
        const pp = el('input.input.input-lg', { value: draft.partner, placeholder: "Your partner's name", oninput: e => draft.partner = e.target.value });
        setTimeout(() => y.focus(), 60);
        return el('div', {}, [el('div.field', {}, [el('label', { text: 'You' }), y]), el('div.field', {}, [el('label', { text: 'Partner' }), pp])]);
      },
      cta: 'Continue',
    },
    {
      title: 'When did it begin?',
      sub: 'Your anniversary — so we can count every day since. You can change or skip this anytime.',
      body: () => { const d = el('input.input.input-lg', { type: 'date', value: draft.anniversary, oninput: e => draft.anniversary = e.target.value }); return el('div.field', {}, [el('label', { text: 'Anniversary' }), d]); },
      cta: 'Enter Ours',
    },
  ];

  function render() {
    const s = steps[step];
    card.innerHTML = '';
    const dots = el('div.step-dots', {}, steps.map((_, i) => el('div.step-dot' + (i === step ? '.on' : ''))));
    card.append(
      dots,
      el('h1.center', { text: s.title }),
      el('p.lede.center.muted.mt-2', { text: s.sub }),
      el('div.mt-5', {}, s.body()),
      el('div.row.mt-5', { style: 'gap:8px' }, [
        step > 0 && el('button.btn.btn-ghost', { text: 'Back', onclick: () => { step--; render(); } }),
        el('button.btn.btn-primary.grow', { text: s.cta, onclick: next }),
      ]),
      step === 1 && el('button.btn.btn-ghost.btn-block.mt-3', { text: 'Skip for now', onclick: finish }),
    );
  }
  function next() { if (step < steps.length - 1) { step++; render(); } else finish(); }
  function finish() {
    Object.assign(state.profile, draft, { onboarded: true });
    commit();
    // Seed a warm first memory so the app never feels empty.
    if (!state.notes.length) state.notes.push({ id: uid(), title: 'Welcome 💞', type: 'Note', body: `This is Ours — a little home for us. Everything here stays private, on this device.\n\nTry adding your first memory, drawing a connection card, or leaving each other a note.`, createdAt: Date.now(), updatedAt: Date.now() });
    commit();
    mountApp();
    go('home');
  }

  render();
  root.innerHTML = ''; root.className = 'onboard-root'; root.append(shell);
}

// ── Main app shell ─────────────────────────────────────────────────────────
let outlet;
function mountApp() {
  const sidebar = buildSidebar();
  const scrim = el('div.scrim.hidden', { onclick: () => sidebar.classList.remove('open') });
  const mobileBar = el('div.mobile-bar', {}, [
    el('button.btn.btn-icon.btn-ghost.menu-btn', { html: icon.menu, 'aria-label': 'Menu', onclick: () => { sidebar.classList.toggle('open'); scrim.classList.toggle('hidden'); } }),
    el('div.brand-mark', { html: icon.heart, style: 'width:30px;height:30px' }),
    el('span.brand-name', { style: 'font-size:1.1rem', text: 'Ours' }),
  ]);
  outlet = el('main.main', { id: 'outlet' });

  root.innerHTML = ''; root.className = 'app';
  root.append(sidebar, scrim, el('div', { style: 'min-width:0' }, [mobileBar, outlet]));

  // Register routes
  NAV.forEach(n => route(n.id, () => renderView(n.view)));
  const handle = startRouter((name) => {
    highlightNav(sidebar, name);
    sidebar.classList.remove('open'); scrim.classList.add('hidden');
  });
  handle(); // initial render
}

function renderView(viewFn) {
  V.revokePhotos();
  outlet.innerHTML = '';
  outlet.append(viewFn());
  outlet.scrollTo?.(0, 0); window.scrollTo(0, 0);
}

function buildSidebar() {
  const sb = el('aside.sidebar');
  sb.append(
    el('div.brand', {}, [
      el('div.brand-mark', { html: icon.heart }),
      el('div', {}, [el('div.brand-name', { text: 'Ours' }), el('div.brand-sub', { text: 'For two' })]),
    ]),
    el('nav.nav', { 'aria-label': 'Primary' }, NAV.map(n =>
      el('button.nav-link', { dataset: { nav: n.id }, onclick: () => go(n.id) }, [
        el('span', { html: n.ic }), n.label,
      ])
    )),
    el('div.nav-foot', {}, el('button.couple-chip', { onclick: () => go('settings'), style: 'width:100%' }, [
      el('span.hearts', { text: '💞' }),
      el('div', { style: 'text-align:left' }, [
        el('div.couple-names', { text: `${state.profile.you || 'You'} & ${state.profile.partner || 'Them'}` }),
        el('div.couple-since', { text: state.profile.anniversary ? `Since ${new Date(state.profile.anniversary).getFullYear()}` : 'Tap to set up' }),
      ]),
    ])),
  );
  return sb;
}
function highlightNav(sb, name) {
  sb.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.nav === name));
}

// ── PWA service worker ─────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}

// Install prompt (A2HS)
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); deferredPrompt = e;
  const cta = el('button.btn.btn-primary.install-cta', { onclick: async () => { cta.remove(); deferredPrompt.prompt(); deferredPrompt = null; } }, [el('span.ic', { html: icon.sparkle }), 'Install Ours']);
  document.body.append(cta);
  setTimeout(() => cta.remove(), 12000);
});

// ── Boot ───────────────────────────────────────────────────────────────────
applyTheme();
if (state.profile.onboarded) { mountApp(); if (!location.hash) go('home'); }
else onboarding();
