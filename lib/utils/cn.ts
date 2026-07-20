/**
 * Minimal class-name joiner. Dependency-free (Constitution Part 4 §12 — avoid
 * unnecessary dependencies). Filters falsy values so conditional classes read
 * cleanly: cn('base', isActive && 'active', undefined).
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
