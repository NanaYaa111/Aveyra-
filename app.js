'use strict';

const STORE_KEY = 'journal_entries';

// ── State ──────────────────────────────────────────────────────────────────
let entries = load();
let activeId = null;
let saveTimer = null;

// ── DOM refs ───────────────────────────────────────────────────────────────
const entryList   = document.getElementById('entry-list');
const emptyState  = document.getElementById('empty-state');
const editorWrap  = document.getElementById('editor-wrap');
const entryTitle  = document.getElementById('entry-title');
const entryBody   = document.getElementById('entry-body');
const entryDate   = document.getElementById('entry-date');
const newBtn      = document.getElementById('new-btn');
const deleteBtn   = document.getElementById('delete-btn');
const searchInput = document.getElementById('search');

// ── Persistence ────────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch { return []; }
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(entries));
}

// ── Helpers ────────────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function fmt(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function fmtShort(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function byUpdated(a, b) { return b.updatedAt - a.updatedAt; }

// ── Render sidebar list ────────────────────────────────────────────────────
function renderList(filter) {
  const q = (filter || '').trim().toLowerCase();
  const visible = entries
    .filter(e => !q || e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q))
    .sort(byUpdated);

  entryList.innerHTML = '';

  if (!visible.length) {
    const li = document.createElement('li');
    li.className = 'no-results';
    li.textContent = q ? 'No entries match.' : 'No entries yet.';
    entryList.appendChild(li);
    return;
  }

  visible.forEach(e => {
    const li = document.createElement('li');
    li.className = 'entry-item' + (e.id === activeId ? ' active' : '');
    li.dataset.id = e.id;

    const title   = document.createElement('div');
    title.className = 'entry-item-title';
    title.textContent = e.title || 'Untitled';

    const meta    = document.createElement('div');
    meta.className = 'entry-item-meta';
    meta.textContent = fmtShort(e.updatedAt);

    const preview = document.createElement('div');
    preview.className = 'entry-item-preview';
    preview.textContent = e.body.replace(/\n/g, ' ').slice(0, 80);

    li.append(title, meta, preview);
    li.addEventListener('click', () => openEntry(e.id));
    entryList.appendChild(li);
  });
}

// ── Open an entry in the editor ────────────────────────────────────────────
function openEntry(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  activeId = id;
  emptyState.classList.add('hidden');
  editorWrap.classList.remove('hidden');

  entryTitle.value = entry.title;
  entryBody.value  = entry.body;
  entryDate.textContent = fmt(entry.updatedAt);

  renderList(searchInput.value);
  entryTitle.focus();
}

function showEmpty() {
  activeId = null;
  emptyState.classList.remove('hidden');
  editorWrap.classList.add('hidden');
  renderList(searchInput.value);
}

// ── Create new entry ───────────────────────────────────────────────────────
function createEntry() {
  const now = Date.now();
  const entry = { id: uid(), title: '', body: '', createdAt: now, updatedAt: now };
  entries.unshift(entry);
  save();
  openEntry(entry.id);
}

// ── Delete current entry ───────────────────────────────────────────────────
function deleteEntry() {
  if (!activeId) return;
  if (!confirm('Delete this entry?')) return;
  entries = entries.filter(e => e.id !== activeId);
  save();
  showEmpty();
}

// ── Auto-save on editor input ──────────────────────────────────────────────
function scheduleAutoSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveActive, 600);
}

function saveActive() {
  if (!activeId) return;
  const entry = entries.find(e => e.id === activeId);
  if (!entry) return;
  entry.title     = entryTitle.value;
  entry.body      = entryBody.value;
  entry.updatedAt = Date.now();
  save();
  entryDate.textContent = fmt(entry.updatedAt);
  renderList(searchInput.value);
}

// ── Event listeners ────────────────────────────────────────────────────────
newBtn.addEventListener('click', createEntry);
deleteBtn.addEventListener('click', deleteEntry);
entryTitle.addEventListener('input', scheduleAutoSave);
entryBody.addEventListener('input', scheduleAutoSave);
searchInput.addEventListener('input', () => renderList(searchInput.value));

// Keyboard shortcut: Ctrl/Cmd+N → new entry
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    createEntry();
  }
});

// ── Init ───────────────────────────────────────────────────────────────────
renderList();
if (entries.length) openEntry(entries.sort(byUpdated)[0].id);
