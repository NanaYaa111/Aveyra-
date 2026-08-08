# Deploying Aveyra

Aveyra builds to a folder of plain static files. There is no server to run, no
runtime to install, and nothing for a visitor to download — they open a URL and
the app is there.

```bash
pnpm install
pnpm build      # everything lands in out/
```

Upload the contents of `out/` to any static host. That's the whole deployment.

## Opens anywhere, on anything

**No installation for visitors.** It's a website. Any modern browser on any
phone, tablet, laptop or desktop opens it — Chrome, Safari, Firefox, Edge,
Samsung Internet. Installing it to the home screen is *offered* (it's a PWA) but
never required; the app is fully usable in a normal browser tab.

**No external services at runtime.** The build embeds everything it needs:

| Thing | How it's handled |
| --- | --- |
| Fonts | Downloaded at build time and served from your own domain (`next/font`). No call to Google Fonts. |
| Icons, logo | Inline SVG in the bundle. |
| CSS/JS | Hashed files under `_next/static`, served by your host. |
| Analytics/trackers | None. There are none to block. |

This matters for reach: there is no CDN, font host, or third-party script that a
national firewall, a corporate proxy, or a privacy blocker could cut off. If the
visitor can reach your domain, the app works. Verified after each build — the
exported bundle contains no external fetches.

**Any country, any continent.** No geographic restrictions in the app itself.
Two things are worth choosing deliberately:

- *Where you host.* Any global static host or CDN puts the files near your
  users. A single-region origin still works, just with more latency far away.
- *Where Supabase lives* (only if you enable the backend). Pick the region
  closest to the two people using it. Aveyra also runs with **no backend at
  all** on a local stub, which needs nothing but the browser.

**Slow or flaky connections.** A service worker caches the app shell, so repeat
visits open instantly and a dropped connection shows a calm notice instead of an
error page. Total size is about 2 MB, once.

## Hosting under a sub-path

At a domain root (`example.com`) nothing extra is needed. To serve from a
sub-path — a GitHub Pages project site at `user.github.io/justforfun/`, say —
build with the base path so every asset, the manifest and the service worker
resolve correctly:

```bash
NEXT_PUBLIC_BASE_PATH=/justforfun pnpm build
```

## Optional backend

Without Supabase credentials the app runs on a local stub: everything works on
one device, and sign-in shows its code on screen. To connect two real devices,
set the two public env vars and apply the migrations in `supabase/migrations/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

These are public values by design — row-level security is what protects the
data, and every table is scoped to the two members of a relationship.

## Preview the production build locally

```bash
pnpm build && pnpm start     # serves out/ at http://localhost:3000
```
