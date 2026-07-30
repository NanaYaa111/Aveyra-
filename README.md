# Aveyra

A private, calm home for two people — a meaningful question each day, and the
memories you choose to keep from answering them together.

It's a static web app: Next.js 15 (App Router, `output: 'export'`), React 19,
TypeScript, Tailwind. There's no app server — it builds down to plain static
files. Supabase is optional; without it the app runs fully on a local stub, so
you can clone and go.

## Running it

You'll need [Node.js](https://nodejs.org) 20 or newer and
[pnpm](https://pnpm.io). This repo is pnpm-only — reach for `npm` or `yarn` and
you'll fight the lockfile.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. Nothing else to configure: sign-in runs on a
local stub and prints the one-time code right on the screen. If port 3000 is
busy, `pnpm dev -- -p 3001`.

To see the real production build, generate the static site and serve it:

```bash
pnpm build     # writes the static site to out/
pnpm start     # serves out/ at http://localhost:3000
```

`pnpm start` runs a small static file server (`scripts/serve-static.mjs`)
rather than `next start` — a static export has no Next server to start, which
is the one thing that trips people up here.

## When it won't start

- **`next: command not found`, or missing modules** — you skipped
  `pnpm install`. Run it.
- **`Could not find a production build in '.next'`** — that's `next start`
  complaining. Use `pnpm dev` while developing, or `pnpm build && pnpm start`
  for a production preview.
- **Weird install or build errors** — usually npm/yarn got involved. Delete
  `node_modules` and any `package-lock.json`, then `pnpm install`.
- **`EADDRINUSE`** — something's already on the port. Pick another with
  `pnpm dev -- -p 3001`.

## The scripts

| Command | |
| --- | --- |
| `pnpm dev` | dev server with hot reload |
| `pnpm build` | static build into `out/` (plus the service-worker precache) |
| `pnpm start` · `pnpm preview` | serve the built `out/` |
| `pnpm test` · `pnpm test:e2e` | Vitest units + Playwright end-to-end |
| `pnpm lint` · `pnpm typecheck` | ESLint and `tsc` |
| `pnpm format` | Prettier |

## Turning on the backend

The app is happy without one. To wire up real two-person sync, set
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and apply the
migration under `supabase/migrations/`. Leave them unset and it quietly falls
back to the local stub. More in `docs/`.

## Hosting under a sub-path

Serving from something like `/justforfun/` (a GitHub Pages project site, say)?
Build with the base path so the assets line up:

```bash
NEXT_PUBLIC_BASE_PATH=/justforfun pnpm build
```
