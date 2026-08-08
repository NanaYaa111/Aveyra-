// Injects the hashed build assets into the exported service worker so a cold,
// offline reload can find the shared entry chunks (which load on the first visit
// before the worker controls the page). Runs after `next build` (postbuild).
//
// Scans out/_next/static for .js/.css, then replaces the `/*__PRECACHE_ASSETS__*/`
// marker in out/sw.js with the real URL list. Zero runtime deps — Node built-ins
// only. No-op (with a warning) if out/ or the marker is missing.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = 'out';
const STATIC_DIR = join(OUT, '_next', 'static');
const SW = join(OUT, 'sw.js');
const MARKER = '/*__PRECACHE_ASSETS__*/';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function main() {
  try {
    await stat(STATIC_DIR);
  } catch {
    console.warn('[sw-precache] out/_next/static not found — skipping (nothing to inject).');
    return;
  }

  // Match however the site is deployed: '' at a domain root, '/justforfun' on a
  // project sub-path. Trailing slashes are trimmed so we never emit '//_next'.
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

  const files = await walk(STATIC_DIR);
  const urls = files
    .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
    .map((f) => base + '/' + f.slice(OUT.length + 1).split(/[\\/]/).join('/'));

  let sw = await readFile(SW, 'utf8');
  if (!sw.includes(MARKER)) {
    console.warn('[sw-precache] marker not found in out/sw.js — skipping.');
    return;
  }
  sw = sw.replace(MARKER, urls.map((u) => `  ${JSON.stringify(u)},`).join('\n').trim());
  await writeFile(SW, sw);
  console.log(`[sw-precache] injected ${urls.length} assets into out/sw.js`);
}

main().catch((err) => {
  console.error('[sw-precache] failed:', err);
  process.exit(1);
});
