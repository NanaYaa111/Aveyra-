// Serves the built `out/` folder. We ship a static export, so there's no
// Next server to start — this stands in for one during local preview, and
// resolves paths the way a static host would: try the file, then `.html`,
// then `index.html`, else the 404 page.
//
//   node scripts/serve-static.mjs [port]   // default 3000, or $PORT
//
// Wired up as `pnpm start` / `pnpm preview`. Run `pnpm build` first.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../out', import.meta.url));
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 3000);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
};

// Return the first candidate path that's an actual file, or null.
async function firstFile(candidates) {
  for (const path of candidates) {
    try {
      if ((await stat(path)).isFile()) return path;
    } catch {
      // Doesn't exist — try the next candidate.
    }
  }
  return null;
}

// Map a request URL onto a file in out/, or null if nothing matches.
async function findFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);

  // Keep the lookup inside out/ — no climbing out with ../
  const rel = normalize(clean).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  const base = join(ROOT, rel);
  if (!base.startsWith(ROOT)) return null;

  if (rel === '' || clean.endsWith('/')) return firstFile([join(base, 'index.html')]);
  return firstFile([base, `${base}.html`, join(base, 'index.html')]);
}

createServer(async (req, res) => {
  try {
    const hit = await findFile(req.url ?? '/');
    // Fall back to the exported 404 page when there's no match.
    const file = hit ?? (await firstFile([join(ROOT, '404.html')]));
    if (!file) {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
      return;
    }
    res.writeHead(hit ? 200 : 404, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    });
    res.end(await readFile(file));
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain' }).end('Server error');
    console.error(err);
  }
})
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is in use. Try:  node scripts/serve-static.mjs 3001\n`);
      process.exit(1);
    }
    throw err;
  })
  .listen(PORT, async () => {
    try {
      await stat(join(ROOT, 'index.html'));
    } catch {
      console.error('\nNo build found in out/. Run `pnpm build` first, then `pnpm start`.\n');
      process.exit(1);
    }
    console.log(`\n  Aveyra (static export) → http://localhost:${PORT}\n  Press Ctrl+C to stop.\n`);
  });
