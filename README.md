# Ours 💞

**A private, offline-first home for your relationship.**

Ours is a premium, installable web app (PWA) for couples — a relationship
companion, memory vault, journal, date planner and emotional-wellness space
rolled into one. It works with **no internet after first load**, keeps **all
data on your device**, and is architected to grow into native Android, iOS
and desktop apps.

> Every design choice answers one question: *does this make a healthy
> relationship easier, warmer, and more meaningful?* If not, it was redesigned
> until it did.

---

## ✨ What's inside

| Area | What it does |
|------|--------------|
| **Dashboard** | Days-together counter, connection streak, next countdown, a daily reflection prompt, one-tap mood check-in and little joys. |
| **Memories** | A shared timeline of moments with downscaled photos stored locally in IndexedDB. |
| **Notes & Letters** | Love notes, long letters, promises, future letters and thank-yous. |
| **Daily Check-in** | A gentle mood pulse + gratitude journal, with a 14-day mood trend. |
| **Countdowns** | Anniversaries, birthdays and trips with recurring reminders. |
| **Goals & Bucket List** | Shared goals with progress and curated suggestions. |
| **Connection Deck** | Evidence-informed conversation cards (Gottman-inspired Love Maps, Fondness, Turning Toward, Dreams, Repair, Playful). |
| **Date Ideas** | A planner seeded with thoughtful date suggestions. |
| **Love Coupons** | Redeemable little promises, one-tap templates included. |
| **Settings** | Names, anniversary, theme (light/dark/auto), and full backup export/import. Reset & privacy controls. |

Everything above is **fully implemented and functional**. The complete
long-term feature vision — voice notes, two-device end-to-end-encrypted sync,
relationship-health insights, and more — is in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## 🚀 Quick start

No build step, no dependencies. Just serve the folder over HTTP (a service
worker requires `http://` or `https://`, not `file://`):

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Open <http://localhost:8080> and complete the short onboarding. Use your
browser's **Install** option (or the in-app prompt) to add it to your home
screen / desktop — after that it runs offline like a native app.

### Deploy

It's a static site: drop the folder on any static host (GitHub Pages,
Netlify, Cloudflare Pages, Vercel, an S3 bucket). Serve over **HTTPS** so the
service worker and installability work. See
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## 🧱 Architecture at a glance

```
index.html            App shell (loads ES modules, registers SW)
manifest.webmanifest  PWA manifest (installable, standalone)
service-worker.js     Offline-first cache (precache shell + runtime cache)
css/styles.css        Full design system (tokens, components, light/dark)
icons/                App icons (SVG, incl. maskable)
js/
 ├─ store.js          State + persistence (localStorage) + photos (IndexedDB)
 │                     + backup export/import. Pub/sub for reactivity.
 ├─ seed.js           Evidence-informed static content (bundled, offline)
 ├─ ui.js             DOM builder, icons, toast, modal, hash router
 ├─ views.js          One render function per feature screen
 └─ app.js            Bootstrap: onboarding, nav shell, routing, theme, SW
```

**Principles**

- **Offline-first & local-only.** No accounts, no servers, no network calls,
  no tracking. Structured data lives in one `localStorage` document; photos
  live in IndexedDB and are downscaled to stay lean.
- **Zero dependencies.** Vanilla JS + ES modules keeps startup fast, memory
  low, and the whole thing auditable and durable.
- **One portable backup.** Export produces a single JSON file (photos
  embedded as data URLs) you can archive or move between devices; import
  restores it exactly.
- **Ready for native.** The clean data layer and view separation make a
  Capacitor/Tauri wrapper and a future encrypted sync layer straightforward.

Full detail in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md), and
[`docs/DATA_MODEL.md`](docs/DATA_MODEL.md).

---

## 🔒 Privacy & security

- **Your data never leaves your device.** There is no backend to send it to.
- No analytics, no third-party scripts, no external fonts or assets — the
  strict offline posture *is* a privacy feature.
- You own your data outright: export, import, or wipe at any time from
  Settings.
- Planned partner sync (roadmap) will be **opt-in and end-to-end encrypted**;
  the server would only ever see ciphertext.

See [`docs/SECURITY.md`](docs/SECURITY.md) for the threat model and the
encryption plan.

---

## ♿ Accessibility & performance

- Semantic landmarks, ARIA labels on icon-only controls, full keyboard
  operation, and visible focus rings.
- Respects `prefers-reduced-motion` and `prefers-color-scheme`.
- Warm, WCAG-AA-minded contrast in both light and dark themes; scalable
  type via relative units.
- No render-blocking third-party resources; images downscaled on capture.

Details and the test plan in [`docs/TESTING.md`](docs/TESTING.md).

---

## 🗺️ Docs index

- [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md) — mission, users, UVP, metrics
- [`docs/RESEARCH.md`](docs/RESEARCH.md) — competitive + psychology research
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — technical architecture
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — schema & storage
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — tokens, components, motion
- [`docs/SECURITY.md`](docs/SECURITY.md) — privacy & encryption plan
- [`docs/TESTING.md`](docs/TESTING.md) — testing strategy
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — hosting guide
- [`docs/MOBILE_MIGRATION.md`](docs/MOBILE_MIGRATION.md) — native app plan
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — full feature roadmap

---

Made with care, for two.
