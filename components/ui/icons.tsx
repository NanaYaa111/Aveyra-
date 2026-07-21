import type { SVGProps } from 'react';

/**
 * Inline SVG icons (currentColor, no external assets → fully offline).
 * Decorative by default; the nav labels carry the accessible name.
 */
function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={22}
      height={22}
      aria-hidden
      {...props}
    />
  );
}

// Sunrise — first light; discovery. (No hearts anywhere in Aveyra.)
export const TodayIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M3 18h18" />
    <path d="M7 18a5 5 0 0 1 10 0" />
    <path d="M12 4v2M5.2 8.2l1.4 1.4M18.8 8.2l-1.4 1.4M2 13h2M20 13h2" />
  </Base>
);

export const StoryIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <path d="M14 3v6h6M8 13h8M8 17h5" />
  </Base>
);

export const WriteIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M14 4 20 10 8 22H2v-6L14 4Z" />
    <path d="m12 6 6 6" />
  </Base>
);

export const SettingsIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </Base>
);
