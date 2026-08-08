import type { SVGProps } from 'react';


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

// Sunrise — a new day's question; discovery.
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

// Calendar with a small star — a day set aside.
export const DatesIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
    <path d="m12 13.6.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3Z" />
  </Base>
);

// A single quiet speech bubble.
export const MessagesIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M21 12a8 8 0 0 1-8 8H4l2.2-2.6A8 8 0 1 1 21 12Z" />
    <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
  </Base>
);

// A heart at rest — the daily emotional weather report.
export const CheckInIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M12 20.5C6.4 16 4 13.2 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.5 0 2.8.7 3.6 1.9a4.34 4.34 0 0 1 3.6-1.9A4.4 4.4 0 0 1 20 9.9c0 3.3-2.4 6.1-8 10.6Z" />
  </Base>
);

// An open book.
export const ScriptureIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M12 6.5C10.5 5.2 8.6 4.5 6 4.5H3v13h3c2.6 0 4.5.7 6 2 1.5-1.3 3.4-2 6-2h3v-13h-3c-2.6 0-4.5.7-6 2Z" />
    <path d="M12 6.5v12" />
  </Base>
);

// A folded note.
export const NotesIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M4 4h16v11l-5 5H4Z" />
    <path d="M20 15h-5v5" />
    <path d="M8 9h8M8 12.5h5" />
  </Base>
);

// A key — the vault.
export const VaultIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <rect x="3" y="10" width="18" height="11" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    <circle cx="12" cy="15.5" r="1.4" />
  </Base>
);

export const SettingsIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </Base>
);
