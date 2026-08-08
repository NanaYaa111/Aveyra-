/**
 * Private-beta allowlist.
 *
 * While Aveyra is just the two of you, only listed addresses may sign in. Set
 * `NEXT_PUBLIC_ALLOWED_EMAILS` to a comma-separated list at build time; leave it
 * unset and the door is open to anyone, which is the right behaviour once the
 * app goes public.
 *
 * This is a **front-door lock, not a wall.** The value is public (anything
 * NEXT_PUBLIC_ is), and a determined person could call the backend directly.
 * What actually protects content is row-level security: every table is scoped to
 * the members of a relationship, so even an account that got in would see only
 * its own empty space. The allowlist exists to stop strangers wandering in and
 * creating accounts, not to defend the data — and the Supabase dashboard
 * setting, where available, is the version with teeth.
 */

/** Addresses permitted to sign in, lowercased. Empty means no restriction. */
export function allowedEmails(): string[] {
  const raw = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_ALLOWED_EMAILS : undefined;
  if (!raw) return [];
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowlistActive(): boolean {
  return allowedEmails().length > 0;
}

/** True when this address may sign in (always true with no allowlist set). */
export function isEmailAllowed(email: string): boolean {
  const list = allowedEmails();
  if (list.length === 0) return true;
  return list.includes(email.trim().toLowerCase());
}
