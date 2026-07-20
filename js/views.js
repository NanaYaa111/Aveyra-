/* ============================================================================
   views.js — Feature screens. Each export returns a DOM node for the router
   to mount. Views read from `state`, mutate via helpers, and call commit().
   ========================================================================== */
import { state, uid, commit, touchStreak, todayISO, photos, exportBackup, importBackup, wipeAll } from './store.js';
import { el, frag, icon, toast, modal, confirmDialog, go, refresh, esc, daysBetween, fmtDate, nextOccurrence } from './ui.js';
import { DECK, DAILY_PROMPTS, COUPON_IDEAS, DATE_IDEAS, COMPLIMENTS, MOODS, BUCKET_IDEAS } from './seed.js';

const p = () => state.profile;

// Object URLs we create for photos — revoked between renders to avoid leaks.
let objectUrls = [];
function photoURL(id, imgEl) {
  photos.get(id).then(blob => { if (blob) { const u = URL.createObjectURL(blob); objectUrls.push(u); imgEl.src = u; } });
}
export function revokePhotos() { objectUrls.forEach(URL.revokeObjectURL); objectUrls = []; }

function head(eyebrow, title, lede, action) {
  return el('div.page-head', {}, [
    el('div', {}, [
      eyebrow && el('div.eyebrow', { text: eyebrow }),
      el('h1', { text: title }),
      lede && el('p.lede', { text: lede }),
    ]),
    action,
  ]);
}
function emptyState(emoji, title, sub, cta) {
  return el('div.empty.card.card-pad', {}, [
    el('div.big', { text: emoji }),
    el('h3', { text: title }),
    el('p.muted', { text: sub }),
    cta && el('div.mt-4', {}, cta),
  ]);
}
const addBtn = (label, onclick) => el('button.btn.btn-primary', { onclick }, [el('span.ic', { html: icon.plus }), label]);

/* ── DASHBOARD ────────────────────────────────────────────────────────── */
export function Dashboard() {
  touchStreak();
  const days = daysBetween(p().anniversary);
  const prompt = DAILY_PROMPTS[new Date().getDate() % DAILY_PROMPTS.length];

  // Next upcoming important date
  let nextUp = null;
  for (const d of state.dates) {
    const n = nextOccurrence(d.date, d.recurring);
    if (n.days >= 0 && (!nextUp || n.days < nextUp.days)) nextUp = { ...d, ...n };
  }

  const todaysCheckin = state.checkins.find(c => c.date === todayISO());
  const openGoals = state.goals.filter(g => !g.done).length;

  const hero = el('div.hero', {}, [
    el('div.heart-bg', { html: icon.heart }),
    el('div.eyebrow', { text: `${p().you || 'You'}  &  ${p().partner || 'Them'}`, style: 'color:#fff;opacity:.85' }),
    el('h2', { text: days != null ? `${days.toLocaleString()} days together` : 'Welcome to Ours' }),
    el('div.hero-sub', { text: days != null ? `Since ${fmtDate(p().anniversary)} — and counting.` : 'Set your anniversary in Settings to begin the count.' }),
    el('div.prompt', { text: '“' + prompt + '”' }),
  ]);

  const stats = el('div.grid.grid-3', {}, [
    stat('Connection streak', `${state.streak.count}`, 'days in a row', icon.sparkle),
    stat('Memories saved', `${state.memories.length}`, 'moments kept', icon.photo),
    stat('Open goals', `${openGoals}`, 'to chase together', icon.target),
  ]);

  const checkinCard = el('div.card.card-pad', {}, [
    el('div.row.between', {}, [el('h3', { text: 'Daily check-in' }), el('span.ic', { html: icon.smile })]),
    todaysCheckin
      ? el('p.muted.mt-2', { text: `Today you felt ${MOODS.find(m => m.emoji === todaysCheckin.mood)?.label || ''} ${todaysCheckin.mood}. See you tomorrow 💛` })
      : frag(
          el('p.muted.mt-2', { text: 'How are you feeling about us today?' }),
          el('div.mood-row.mt-3', {}, MOODS.map(m =>
            el('button.mood-btn', { text: m.emoji, title: m.label, 'aria-label': m.label, onclick: () => { quickCheckin(m.emoji); } })
          )),
        ),
  ]);

  const nextCard = el('div.card.card-pad', {}, [
    el('div.row.between', {}, [el('h3', { text: 'Next up' }), el('span.ic', { html: icon.clock })]),
    nextUp
      ? frag(
          el('div.stat-value.mt-2', {}, [nextUp.days === 0 ? 'Today! 🎉' : `${nextUp.days} `, nextUp.days === 0 ? '' : el('small', { text: nextUp.days === 1 ? 'day' : 'days' })]),
          el('div.stat-sub', { text: `${nextUp.label} · ${nextUp.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}` }),
        )
      : el('p.muted.mt-2', { text: 'Add anniversaries and birthdays to see countdowns here.' }),
    el('button.btn.btn-soft.btn-sm.mt-4', { text: 'Manage dates', onclick: () => go('dates') }),
  ]);

  const quick = el('div.card.card-pad', {}, [
    el('h3', { text: 'A little something' }),
    el('div.row.wrap.mt-3', { style: 'gap:8px' }, [
      quickAction('💌', 'Write a note', () => go('notes')),
      quickAction('🃏', 'Draw a card', () => go('deck')),
      quickAction('✨', 'Compliment me', () => {
        const c = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
        modal({ title: 'For you', body: el('p', { style: 'font-family:var(--font-display);font-size:1.3rem;line-height:1.4', text: '“' + c + '”' }), actions: [{ label: 'Aw', variant: 'btn-primary' }] });
      }),
    ]),
  ]);

  return el('div.view', {}, [
    hero,
    el('div.grid.grid-3.mt-5', {}, stats.children ? [...stats.children] : []),
    el('div.grid.grid-2.mt-4', {}, [checkinCard, nextCard]),
    el('div.mt-4', {}, quick),
  ]);
}
function stat(label, value, sub, ic) {
  return el('div.card.stat', {}, [
    el('div.row.between', {}, [el('div.stat-label', { text: label }), el('span.ic', { html: ic, style: 'color:var(--primary)' })]),
    el('div.stat-value', { text: value }),
    el('div.stat-sub', { text: sub }),
  ]);
}
function quickAction(emoji, label, onclick) {
  return el('button.chip.selectable', { onclick }, [el('span', { text: emoji }), label]);
}
function quickCheckin(mood) {
  const today = todayISO();
  const existing = state.checkins.find(c => c.date === today);
  if (existing) existing.mood = mood;
  else state.checkins.unshift({ id: uid(), date: today, mood, gratitude: '', createdAt: Date.now() });
  commit(); toast('Check-in saved 💛'); refresh();
}

/* ── MEMORIES / TIMELINE ──────────────────────────────────────────────── */
export function Memories() {
  const wrap = el('div.view');
  wrap.append(head('Shared timeline', 'Memories', 'The moments worth keeping, together.', addBtn('Add memory', memoryModal)));

  if (!state.memories.length) {
    wrap.append(emptyState('📸', 'No memories yet', 'Capture your first moment — a date, a trip, a tiny ordinary Tuesday.', addBtn('Add your first memory', memoryModal)));
    return wrap;
  }
  const grid = el('div.grid.grid-auto.mt-2');
  [...state.memories].sort((a, b) => (b.date || '').localeCompare(a.date || '')).forEach(m => {
    const card = el('div.card.memory', {}, [
      m.hasPhoto ? (() => { const img = el('img.memory-photo', { alt: m.title }); photoURL('mem_' + m.id, img); return img; })() : el('div.memory-photo', { style: 'display:grid;place-items:center;font-size:2.4rem', text: '💞' }),
      el('div.memory-body', {}, [
        el('div.memory-date', { text: fmtDate(m.date) }),
        el('div.item-title.mt-2', { text: m.title }),
        m.note && el('p.muted.small.mt-2', { text: m.note }),
        el('div.row.mt-3', { style: 'gap:8px' }, [
          el('button.btn.btn-ghost.btn-sm', { text: 'Edit', onclick: () => memoryModal(m) }),
          el('button.btn.btn-danger.btn-sm', { text: 'Delete', onclick: () => confirmDialog('Delete this memory forever?', async () => { if (m.hasPhoto) await photos.del('mem_' + m.id); state.memories = state.memories.filter(x => x.id !== m.id); commit(); toast('Memory removed'); refresh(); }) }),
        ]),
      ]),
    ]);
    grid.append(card);
  });
  wrap.append(grid);
  return wrap;
}
function memoryModal(existing) {
  const m = existing?.id ? existing : { id: uid(), title: '', note: '', date: todayISO(), hasPhoto: false, createdAt: Date.now() };
  let pendingBlob = null;
  const titleIn = el('input.input.input-lg', { value: m.title, placeholder: 'A morning by the sea…', maxlength: 80 });
  const dateIn = el('input.input', { type: 'date', value: m.date });
  const noteIn = el('textarea.textarea', { value: m.note, placeholder: 'What made this one matter?' });
  const preview = el('img.memory-photo', { style: 'border-radius:14px;margin-top:8px' + (m.hasPhoto ? '' : ';display:none') });
  if (m.hasPhoto) photoURL('mem_' + m.id, preview);
  const fileIn = el('input', { type: 'file', accept: 'image/*', style: 'display:none', onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    pendingBlob = await downscale(f);
    preview.src = URL.createObjectURL(pendingBlob); preview.style.display = 'block';
  }});
  const body = el('div', {}, [
    el('div.field', {}, [el('label', { text: 'Title' }), titleIn]),
    el('div.field', {}, [el('label', { text: 'Date' }), dateIn]),
    el('div.field', {}, [el('label', { text: 'Note (optional)' }), noteIn]),
    el('button.btn.btn-ghost', { text: '📷 Choose photo', onclick: () => fileIn.click() }), fileIn, preview,
  ]);
  modal({ title: existing?.id ? 'Edit memory' : 'New memory', body, actions: [
    { label: 'Cancel', variant: 'btn-ghost' },
    { label: 'Save', variant: 'btn-primary', onClick: async (close) => {
      m.title = titleIn.value.trim() || 'Untitled memory'; m.note = noteIn.value.trim(); m.date = dateIn.value || todayISO();
      if (pendingBlob) { await photos.put('mem_' + m.id, pendingBlob); m.hasPhoto = true; }
      if (!existing?.id) state.memories.unshift(m);
      touchStreak(); commit(); toast('Memory saved 💞'); close(); refresh();
    }},
  ]});
}
// Downscale images to keep storage lean and the app fast.
function downscale(file, max = 1280) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => resolve(b), 'image/jpeg', 0.82);
    };
    img.src = URL.createObjectURL(file);
  });
}

/* ── NOTES & LETTERS ──────────────────────────────────────────────────── */
export function Notes() {
  const wrap = el('div.view');
  wrap.append(head('Love notes & letters', 'Notes', 'Little words and long letters — say the things out loud.', addBtn('New note', () => noteModal())));
  if (!state.notes.length) {
    wrap.append(emptyState('💌', 'Nothing written yet', 'Leave a note your partner will find later. A thank-you, a memory, a promise.', addBtn('Write the first note', () => noteModal())));
    return wrap;
  }
  const list = el('div.card.mt-2');
  [...state.notes].sort((a, b) => b.updatedAt - a.updatedAt).forEach(n => {
    list.append(el('div.item', { onclick: () => noteModal(n) }, [
      el('div.grow', {}, [
        el('div.row', { style: 'gap:8px' }, [el('span.item-title', { text: n.title || 'Untitled' }), el('span.tag', { text: n.type })]),
        el('p.muted.small.mt-2', { text: (n.body || '').replace(/\n/g, ' ').slice(0, 120) || 'No content yet' }),
        el('div.item-meta.mt-2', { text: fmtDate(new Date(n.updatedAt).toISOString().slice(0, 10)) }),
      ]),
      el('span.ic.muted', { html: icon.arrow }),
    ]));
  });
  wrap.append(list);
  return wrap;
}
function noteModal(existing) {
  const n = existing || { id: uid(), title: '', body: '', type: 'Note', createdAt: Date.now(), updatedAt: Date.now() };
  const titleIn = el('input.input.input-lg', { value: n.title, placeholder: 'Title', maxlength: 100 });
  const bodyIn = el('textarea.textarea', { value: n.body, placeholder: 'Write from the heart…', style: 'min-height:200px' });
  const typeSel = el('select.input', {}, ['Note', 'Letter', 'Future letter', 'Promise', 'Thank you'].map(t => el('option', { value: t, selected: n.type === t, text: t })));
  const body = el('div', {}, [
    el('div.field', {}, [el('label', { text: 'Kind' }), typeSel]),
    el('div.field', {}, [el('label', { text: 'Title' }), titleIn]),
    el('div.field', {}, [el('label', { text: 'Message' }), bodyIn]),
  ]);
  const actions = [
    existing && { label: 'Delete', variant: 'btn-danger', onClick: (close) => confirmDialog('Delete this note?', () => { state.notes = state.notes.filter(x => x.id !== n.id); commit(); toast('Note deleted'); close(); refresh(); }) },
    { label: 'Save', variant: 'btn-primary', onClick: (close) => {
      n.title = titleIn.value.trim(); n.body = bodyIn.value; n.type = typeSel.value; n.updatedAt = Date.now();
      if (!existing) state.notes.unshift(n);
      touchStreak(); commit(); toast('Saved 💌'); close(); refresh();
    }},
  ].filter(Boolean);
  modal({ title: existing ? 'Edit note' : 'New note', body, actions });
}

/* ── CHECK-IN & MOOD ──────────────────────────────────────────────────── */
export function Checkin() {
  const wrap = el('div.view');
  wrap.append(head('Daily check-in', 'Check-in', 'A gentle daily pulse on how you feel — and what you are grateful for.'));

  const today = todayISO();
  const todays = state.checkins.find(c => c.date === today);
  let mood = todays?.mood || '';
  const gratIn = el('textarea.textarea', { value: todays?.gratitude || '', placeholder: 'One thing you appreciated about them today…' });

  const moodRow = el('div.mood-row.mt-2');
  MOODS.forEach(m => {
    const b = el('button.mood-btn' + (mood === m.emoji ? '.on' : ''), { text: m.emoji, title: m.label, 'aria-label': m.label });
    b.onclick = () => { mood = m.emoji; moodRow.querySelectorAll('.mood-btn').forEach(x => x.classList.remove('on')); b.classList.add('on'); };
    moodRow.append(b);
  });

  const card = el('div.card.card-pad', {}, [
    el('h3', { text: 'How do you feel about us today?' }),
    moodRow,
    el('div.field.mt-4', {}, [el('label', { text: 'Gratitude (optional)' }), gratIn]),
    el('button.btn.btn-primary', { text: todays ? 'Update today' : 'Save check-in', onclick: () => {
      if (!mood) return toast('Pick a mood first');
      if (todays) { todays.mood = mood; todays.gratitude = gratIn.value.trim(); }
      else state.checkins.unshift({ id: uid(), date: today, mood, gratitude: gratIn.value.trim(), createdAt: Date.now() });
      touchStreak(); commit(); toast('Check-in saved 💛'); refresh();
    }}),
  ]);

  // Insights: last 14 days mood sparkline + average
  const recent = [...state.checkins].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  const insight = el('div.card.card-pad.mt-4', {}, [
    el('div.row.between', {}, [el('h3', { text: 'Recent mood' }), el('span.stat-sub', { text: `${state.checkins.length} check-ins logged` })]),
    recent.length
      ? el('div.row.mt-3', { style: 'gap:6px;align-items:flex-end;height:80px' }, recent.map(c => {
          const s = MOODS.find(m => m.emoji === c.mood)?.score ?? 3;
          return el('div', { title: `${fmtDate(c.date)} · ${c.mood}`, style: `flex:1;background:var(--rose-300);border-radius:6px 6px 0 0;height:${15 + s * 13}px` });
        }))
      : el('p.muted.mt-2', { text: 'Your mood trend will appear here after a few check-ins.' }),
  ]);

  // History with gratitude
  const history = state.checkins.filter(c => c.gratitude);
  const grats = history.length ? el('div.card.mt-4', {}, [
    el('div.card-pad', { style: 'padding-bottom:0' }, el('h3', { text: 'Gratitude journal' })),
    ...history.slice(0, 20).map(c => el('div.item', {}, [
      el('div.grow', {}, [el('p', { text: '“' + c.gratitude + '”' }), el('div.item-meta.mt-2', { text: `${c.mood} · ${fmtDate(c.date)}` })]),
    ])),
  ]) : null;

  wrap.append(card, insight, grats);
  return wrap;
}

/* ── IMPORTANT DATES ──────────────────────────────────────────────────── */
export function Dates() {
  const wrap = el('div.view');
  wrap.append(head('Countdowns', 'Important dates', 'Never miss the days that matter.', addBtn('Add date', () => dateModal())));
  if (!state.dates.length) {
    wrap.append(emptyState('📅', 'No dates yet', 'Add your anniversary, birthdays, or a trip to count down to.', addBtn('Add a date', () => dateModal())));
    return wrap;
  }
  const enriched = state.dates.map(d => ({ ...d, ...nextOccurrence(d.date, d.recurring) })).sort((a, b) => a.days - b.days);
  const grid = el('div.grid.grid-2.mt-2');
  enriched.forEach(d => grid.append(el('div.card.card-pad', {}, [
    el('div.row.between', {}, [el('div.stat-label', { text: d.recurring ? 'Recurring' : 'One-time' }), el('button.btn.btn-icon.btn-ghost', { html: icon.x, 'aria-label': 'Delete', onclick: () => confirmDialog('Remove this date?', () => { state.dates = state.dates.filter(x => x.id !== d.id); commit(); toast('Date removed'); refresh(); }) })]),
    el('div.stat-value.mt-2', {}, [d.days === 0 ? 'Today!' : `${d.days} `, d.days === 0 ? '' : el('small', { text: d.days === 1 ? 'day' : 'days' })]),
    el('div.item-title.mt-2', { text: d.label }),
    el('div.stat-sub', { text: d.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) }),
  ])));
  wrap.append(grid);
  return wrap;
}
function dateModal() {
  const labelIn = el('input.input.input-lg', { placeholder: 'Our anniversary', maxlength: 60 });
  const dateIn = el('input.input', { type: 'date', value: todayISO() });
  const recIn = el('input', { type: 'checkbox', checked: true, id: 'rec' });
  const body = el('div', {}, [
    el('div.field', {}, [el('label', { text: 'What is it?' }), labelIn]),
    el('div.field', {}, [el('label', { text: 'Date' }), dateIn]),
    el('label.row', { style: 'gap:8px;cursor:pointer' }, [recIn, el('span', { text: 'Repeats every year' })]),
  ]);
  modal({ title: 'New date', body, actions: [
    { label: 'Cancel', variant: 'btn-ghost' },
    { label: 'Add', variant: 'btn-primary', onClick: (close) => {
      if (!labelIn.value.trim()) return toast('Give it a name');
      state.dates.push({ id: uid(), label: labelIn.value.trim(), date: dateIn.value, recurring: recIn.checked, createdAt: Date.now() });
      commit(); toast('Date added 📅'); close(); refresh();
    }},
  ]});
}

/* ── GOALS / BUCKET LIST ──────────────────────────────────────────────── */
export function Goals() {
  const wrap = el('div.view');
  wrap.append(head('Together', 'Goals & bucket list', 'Dream it, then do it — side by side.', addBtn('Add goal', () => goalModal())));

  const inputRow = el('div.card.card-pad.mb-4', {}, [
    el('div.row', { style: 'gap:8px' }, [
      (() => { const i = el('input.input.grow', { placeholder: 'Add something to do together…', onkeydown: (e) => { if (e.key === 'Enter' && i.value.trim()) { addGoal(i.value.trim()); i.value = ''; } } }); return i; })(),
    ]),
    el('div.row.wrap.mt-3', { style: 'gap:6px' }, BUCKET_IDEAS.map(s => el('button.chip.selectable', { text: '+ ' + s, onclick: () => { addGoal(s); toast('Added to your list'); } }))),
  ]);
  wrap.append(inputRow);

  if (!state.goals.length) { wrap.append(emptyState('🎯', 'Your list is empty', 'Add a shared goal above, or tap a suggestion to start.')); return wrap; }
  const done = state.goals.filter(g => g.done).length;
  wrap.append(el('div.row.between.mb-3', {}, [el('span.muted.small', { text: `${done} of ${state.goals.length} done` }), el('div', { style: 'flex:1;max-width:200px;height:8px;background:var(--bg-soft);border-radius:999px;overflow:hidden' }, el('div', { style: `height:100%;width:${state.goals.length ? done / state.goals.length * 100 : 0}%;background:var(--sage-500)` }))]));

  const list = el('div.card');
  [...state.goals].sort((a, b) => a.done - b.done || b.createdAt - a.createdAt).forEach(g => {
    list.append(el('div.item', {}, [
      el('button.check' + (g.done ? '.done' : ''), { html: g.done ? icon.check : '', 'aria-label': 'Toggle done', onclick: () => { g.done = !g.done; if (g.done) touchStreak(); commit(); toast(g.done ? 'Nice — done! 🎉' : 'Back on the list'); refresh(); } }),
      el('span.grow' + (g.done ? '.strike' : ''), { text: g.text }),
      el('button.btn.btn-icon.btn-ghost', { html: icon.x, 'aria-label': 'Delete', onclick: () => { state.goals = state.goals.filter(x => x.id !== g.id); commit(); refresh(); } }),
    ]));
  });
  wrap.append(list);
  return wrap;
}
function addGoal(text) { state.goals.unshift({ id: uid(), text, done: false, createdAt: Date.now() }); commit(); refresh(); }
function goalModal() { const i = el('input.input.input-lg', { placeholder: 'Something to do together' }); modal({ title: 'New goal', body: el('div.field', {}, [el('label', { text: 'Goal' }), i]), actions: [{ label: 'Cancel', variant: 'btn-ghost' }, { label: 'Add', variant: 'btn-primary', onClick: (c) => { if (i.value.trim()) addGoal(i.value.trim()); c(); } }] }); }

/* ── CONNECTION DECK ──────────────────────────────────────────────────── */
export function Deck() {
  const wrap = el('div.view');
  wrap.append(head('Grow closer', 'Connection deck', 'Evidence-informed questions to spark real conversation.'));

  const cats = ['All', ...new Set(DECK.map(d => d.cat))];
  let activeCat = 'All';
  const pool = () => DECK.map((d, i) => ({ ...d, i })).filter(d => activeCat === 'All' || d.cat === activeCat);

  const cardWrap = el('div.deck.mt-4');
  const drawOne = () => {
    const options = pool();
    let choices = options.filter(o => !state.seenDeck.includes(o.i));
    if (!choices.length) { state.seenDeck = []; choices = options; }
    const pick = choices[Math.floor(Math.random() * choices.length)];
    state.seenDeck.push(pick.i); commit();
    cardWrap.innerHTML = '';
    cardWrap.append(el('div.deck-card', {}, [
      el('div.cat', { text: pick.cat }),
      el('div.q', { text: pick.q }),
      el('div.small', { style: 'opacity:.8', text: 'Take turns. Listen to understand, not to reply.' }),
    ]));
  };

  const catRow = el('div.row.wrap', { style: 'gap:8px' }, cats.map(c => {
    const b = el('button.chip.selectable' + (c === 'All' ? '.on' : ''), { text: c, onclick: () => { activeCat = c; catRow.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); b.classList.add('on'); drawOne(); } });
    return b;
  }));

  wrap.append(catRow, cardWrap, el('div.center.mt-5', {}, el('button.btn.btn-primary', { onclick: drawOne }, [el('span.ic', { html: icon.cards }), 'Draw another card'])));
  drawOne();
  return wrap;
}

/* ── LOVE COUPONS ─────────────────────────────────────────────────────── */
export function Coupons() {
  const wrap = el('div.view');
  wrap.append(head('Give a little', 'Love coupons', 'Promises they can cash in whenever they like.', addBtn('New coupon', () => couponModal())));

  const ideas = el('div.card.card-pad.mb-4', {}, [
    el('h3', { text: 'Quick add' }),
    el('div.row.wrap.mt-3', { style: 'gap:6px' }, COUPON_IDEAS.map(c => el('button.chip.selectable', { text: '+ ' + c.title, onclick: () => { state.coupons.unshift({ id: uid(), title: c.title, note: c.note, redeemed: false, createdAt: Date.now() }); commit(); toast('Coupon added 🎁'); refresh(); } }))),
  ]);
  wrap.append(ideas);

  if (!state.coupons.length) { wrap.append(emptyState('🎟️', 'No coupons yet', 'Create a coupon your partner can redeem — a massage, a chore, a night off.')); return wrap; }
  const grid = el('div.grid.grid-2');
  [...state.coupons].sort((a, b) => a.redeemed - b.redeemed || b.createdAt - a.createdAt).forEach(c => {
    grid.append(el('div.coupon' + (c.redeemed ? '.redeemed' : ''), {}, [
      el('div.coupon-cut.l'), el('div.coupon-cut.r'),
      el('div.row.between', {}, [el('span.ic', { html: icon.gift }), c.redeemed && el('span.tag', { style: 'background:rgba(255,255,255,.25);color:#fff', text: 'Redeemed' })]),
      el('h3.mt-2', { text: c.title }),
      c.note && el('div.coupon-note', { text: c.note }),
      el('div.row.mt-4', { style: 'gap:8px' }, [
        !c.redeemed && el('button.btn.btn-sm', { style: 'background:#fff;color:var(--rose-700)', text: 'Redeem', onclick: () => { c.redeemed = true; commit(); toast('Enjoy 💛'); refresh(); } }),
        el('button.btn.btn-sm', { style: 'background:rgba(255,255,255,.2);color:#fff', text: 'Delete', onclick: () => { state.coupons = state.coupons.filter(x => x.id !== c.id); commit(); refresh(); } }),
      ]),
    ]));
  });
  wrap.append(grid);
  return wrap;
}
function couponModal() {
  const t = el('input.input.input-lg', { placeholder: 'One home-cooked dinner', maxlength: 60 });
  const note = el('input.input', { placeholder: 'A little note (optional)', maxlength: 100 });
  modal({ title: 'New coupon', body: el('div', {}, [el('div.field', {}, [el('label', { text: 'Coupon' }), t]), el('div.field', {}, [el('label', { text: 'Note' }), note])]), actions: [
    { label: 'Cancel', variant: 'btn-ghost' },
    { label: 'Create', variant: 'btn-primary', onClick: (close) => { if (!t.value.trim()) return toast('Add a title'); state.coupons.unshift({ id: uid(), title: t.value.trim(), note: note.value.trim(), redeemed: false, createdAt: Date.now() }); commit(); toast('Coupon created 🎁'); close(); } },
  ]});
}

/* ── DATE PLANNER (bonus, lives under Deck-ish) ───────────────────────── */
export function Plans() {
  const wrap = el('div.view');
  wrap.append(head('Date planner', 'Date ideas', 'A shortlist of things to do next — pick one and make it real.'));
  const suggest = el('div.card.card-pad.mb-4', {}, [
    el('h3', { text: 'Need inspiration?' }),
    el('div.row.wrap.mt-3', { style: 'gap:6px' }, DATE_IDEAS.map(idea => el('button.chip.selectable', { text: '+ Add', title: idea, onclick: () => { state.plans.unshift({ id: uid(), idea, done: false, createdAt: Date.now() }); commit(); toast('Added to your dates'); refresh(); } }, [document.createTextNode(idea.length > 40 ? idea.slice(0, 40) + '…' : idea)]))),
  ]);
  wrap.append(suggest);
  if (!state.plans.length) { wrap.append(emptyState('🌙', 'No date plans yet', 'Tap an idea above to add it to your shortlist.')); return wrap; }
  const list = el('div.card');
  state.plans.forEach(pl => list.append(el('div.item', {}, [
    el('button.check' + (pl.done ? '.done' : ''), { html: pl.done ? icon.check : '', 'aria-label': 'Mark as done', onclick: () => { pl.done = !pl.done; commit(); refresh(); } }),
    el('span.grow' + (pl.done ? '.strike' : ''), { text: pl.idea }),
    el('button.btn.btn-icon.btn-ghost', { html: icon.x, 'aria-label': 'Remove', onclick: () => { state.plans = state.plans.filter(x => x.id !== pl.id); commit(); refresh(); } }),
  ])));
  wrap.append(list);
  return wrap;
}

/* ── SETTINGS ─────────────────────────────────────────────────────────── */
export function Settings() {
  const wrap = el('div.view');
  wrap.append(head('Settings', 'Settings', 'Your relationship, your data — always on your device.'));

  // Profile
  const youIn = el('input.input', { value: p().you, placeholder: 'Your name' });
  const partIn = el('input.input', { value: p().partner, placeholder: 'Their name' });
  const annIn = el('input.input', { type: 'date', value: p().anniversary });
  const profileCard = el('div.card.card-pad', {}, [
    el('h3', { text: 'Your relationship' }),
    el('div.grid.grid-2.mt-3', {}, [
      el('div.field', {}, [el('label', { text: 'You' }), youIn]),
      el('div.field', {}, [el('label', { text: 'Partner' }), partIn]),
    ]),
    el('div.field', {}, [el('label', { text: 'Anniversary' }), annIn]),
    el('button.btn.btn-primary', { text: 'Save', onclick: () => { p().you = youIn.value.trim(); p().partner = partIn.value.trim(); p().anniversary = annIn.value; commit(); toast('Saved'); refresh(); } }),
  ]);

  // Theme
  const themeCard = el('div.card.card-pad', {}, [
    el('h3', { text: 'Appearance' }),
    el('div.row.wrap.mt-3', { style: 'gap:8px' }, ['auto', 'light', 'dark'].map(t =>
      el('button.chip.selectable' + (p().theme === t ? '.on' : ''), { text: t[0].toUpperCase() + t.slice(1), onclick: () => { p().theme = t; commit(); applyTheme(); refresh(); } })
    )),
  ]);

  // Data & backup
  const importFile = el('input', { type: 'file', accept: 'application/json,.json', style: 'display:none', onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { await importBackup(await f.text()); applyTheme(); toast('Backup restored 💛'); go('home'); }
    catch (err) { toast('Import failed: ' + err.message); }
  }});
  const dataCard = el('div.card.card-pad', {}, [
    el('h3', { text: 'Backup & data' }),
    el('p.muted.small.mt-2', { text: 'Everything lives on this device. Export a single backup file you can keep safe or move to another device.' }),
    el('div.row.wrap.mt-4', { style: 'gap:8px' }, [
      el('button.btn.btn-ghost', { text: '⬇ Export backup', onclick: async () => {
        const json = await exportBackup();
        const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
        const a = el('a', { href: url, download: `ours-backup-${todayISO()}.json` }); a.click(); URL.revokeObjectURL(url); toast('Backup downloaded');
      }}),
      el('button.btn.btn-ghost', { text: '⬆ Import backup', onclick: () => importFile.click() }), importFile,
    ]),
    el('div.divider'),
    el('button.btn.btn-danger', { text: 'Reset everything', onclick: () => confirmDialog('This erases all your memories, notes and settings on this device. Export a backup first if you want to keep them.', async () => { await wipeAll(); location.hash = ''; location.reload(); }, { yes: 'Erase all' }) }),
  ]);

  // Privacy note
  const privacy = el('div.card.card-pad', {}, [
    el('div.row', { style: 'gap:8px' }, [el('span.ic', { html: icon.heart, style: 'color:var(--primary)' }), el('h3', { text: 'Private by design' })]),
    el('p.muted.small.mt-2', { text: 'Ours never sends your data anywhere. There are no accounts, no servers, and no tracking. Your memories are yours alone. Cloud sync between partners is on the roadmap and will be end-to-end encrypted and fully optional.' }),
  ]);

  wrap.append(el('div.grid.grid-2', {}, [profileCard, themeCard]), el('div.mt-4', {}, dataCard), el('div.mt-4', {}, privacy));
  return wrap;
}

// Theme application shared with app.js
export function applyTheme() {
  const t = state.profile.theme || 'auto';
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
