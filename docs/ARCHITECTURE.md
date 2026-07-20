# Technical Architecture

## Overview
Ours is a **static, offline-first Progressive Web App** built with vanilla
JavaScript (ES modules), no framework and no runtime dependencies. This keeps
startup fast, memory low, the bundle tiny, and the codebase auditable and
durable — important properties for an app meant to safeguard intimate data for
years.

```
┌───────────────────────────────────────────────────────────┐
│  Browser / Installed PWA                                   │
│                                                            │
│  index.html ──► app.js (bootstrap)                         │
│                   │                                        │
│      ┌────────────┼───────────────┐                        │
│      ▼            ▼               ▼                         │
│   ui.js        views.js        store.js                    │
│  (router,     (feature         (state + persistence)       │
│   modal,       screens)          │        │                │
│   toast,                         ▼        ▼                 │
│   icons)                   localStorage  IndexedDB          │
│                            (JSON doc)    (photo blobs)      │
│                                                            │
│  service-worker.js ── precache shell + runtime cache       │
└───────────────────────────────────────────────────────────┘
                 No network. No backend. No tracking.
```

## Modules

### `store.js` — data layer
- Single source of truth: an in-memory `state` object hydrated from one
  `localStorage` JSON document (`ours.state.v1`).
- `commit()` debounces the write and notifies subscribers (pub/sub) so views
  can react.
- **Photos** are stored as Blobs in **IndexedDB** (`ours-media/photos`), keyed
  by `mem_<id>`, so large binaries never bloat `localStorage`.
- **Backup**: `exportBackup()` serialises the whole state plus every photo
  (as a data URL) into one portable JSON file; `importBackup()` restores it,
  including re-hydrating IndexedDB. `wipeAll()` erases everything.
- `touchStreak()` implements the healthy streak rule (increment on a new day,
  reset if a day is skipped — never punitive).

### `ui.js` — presentation utilities
- `el(spec, props, children)` — a terse hyperscript-style DOM builder.
- `modal`, `confirmDialog`, `toast` — accessible overlays (focus management,
  Escape to close, `role="dialog"`/`status`).
- `icon` — inline SVG set using `currentColor` (no icon font, no network).
- Hash **router**: `route()`, `go()`, `startRouter()`, and `refresh()` (to
  re-render the current view in place after mutations).
- Date helpers: `daysBetween`, `nextOccurrence` (recurring anniversaries), etc.

### `views.js` — feature screens
One exported render function per screen returning a DOM node. Views read from
`state`, mutate through helpers, `commit()`, then `refresh()`.

### `app.js` — bootstrap
Onboarding gate → navigation shell (sidebar + mobile drawer) → route
registration → theme application → service-worker registration → install prompt.

### `seed.js` — bundled content
Evidence-informed static content (deck questions, prompts, coupon/date/bucket
ideas, compliments, mood scale) shipped with the app so it is fully functional
offline.

## Offline strategy
`service-worker.js` precaches the app shell on install and serves
**cache-first** for same-origin GET requests, falling back to network, then to
the cached shell for navigations. Bump `CACHE` to ship updates; stale caches
are pruned on `activate`. All user data is already local, so the app is fully
usable with the network switched off — verified with an automated offline
reload test.

## Reactivity model
Deliberately minimal: mutate `state` → `commit()` (persist + notify) →
`refresh()` (re-render current route). No virtual DOM; screens are small
enough that full re-render on change is instant and predictable. No view
mutates state on keystroke, so re-render never interrupts typing.

## Why no framework?
- **Offline durability** — nothing to fetch, nothing to break on upgrade.
- **Performance** — no framework runtime; excellent Lighthouse headroom.
- **Auditability** — a security-sensitive, privacy-first app benefits from a
  small, readable surface.
- **Portability** — trivially wraps in Capacitor (mobile) or Tauri (desktop).

## Extensibility
Adding a feature = add content to `seed.js` (if needed), a render function in
`views.js`, and a `NAV` entry in `app.js`. New data slices default-merge into
`state` via `freshState()`, so old backups load forward without migration
scripts.
