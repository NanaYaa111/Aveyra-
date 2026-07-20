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

export const TodayIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M12 21s-7.5-4.6-10-9.3C.6 8.3 2.3 4.8 5.7 4.8c2 0 3.4 1.2 4.3 2.6.9-1.4 2.3-2.6 4.3-2.6 3.4 0 5.1 3.5 3.7 6.9C19.5 16.4 12 21 12 21Z" />
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
