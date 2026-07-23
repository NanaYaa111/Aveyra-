/**
 * Aveyra — Next.js configuration.
 *
 * Static export: the frontend ships as pure static assets with no server
 * runtime and no API routes (Constitution Part 3; Milestone 1 §3). The
 * Milestone-2 backend (Supabase — web-first, staged privacy) is a SEPARATE
 * service the static client talks to; it never becomes part of this build.
 *
 * `basePath` supports hosting under a sub-path (e.g. GitHub Pages project
 * sites). Set NEXT_PUBLIC_BASE_PATH at build time; defaults to root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // No image optimization server exists in a static export.
    unoptimized: true,
  },
};

export default nextConfig;
