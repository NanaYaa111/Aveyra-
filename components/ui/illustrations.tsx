import type { SVGProps } from 'react';

/**
 * Flat, duotone illustrations in Aveyra's own visual language (no hearts, per
 * the brand's existing icon rule — see icons.tsx). Original artwork, not a
 * copy of any reference app's character art.
 */

/**
 * Two simple figures standing together with a gentle idle bob. Respects
 * prefers-reduced-motion via the global rule in globals.css, which zeroes out
 * all animation durations.
 */
export function CoupleIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 160" fill="none" role="img" aria-hidden {...props}>
      <style>{`
        .aveyra-figure-a, .aveyra-figure-b {
          animation: aveyra-bob var(--dur-ambient) var(--ease-ambient) infinite;
          transform-origin: 50% 100%;
        }
        .aveyra-figure-b { animation-delay: 0.5s; }
        @keyframes aveyra-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      <ellipse cx="100" cy="150" rx="72" ry="7" fill="var(--color-accent-soft)" />
      <g className="aveyra-figure-a">
        <path d="M50 146c0-32 11-56 25-56s25 24 25 56Z" fill="var(--color-gold)" />
        <circle cx="75" cy="52" r="17" fill="var(--color-gold)" />
      </g>
      <g className="aveyra-figure-b">
        <path d="M100 146c0-32 11-56 25-56s25 24 25 56Z" fill="var(--color-accent)" />
        <circle cx="125" cy="52" r="17" fill="var(--color-accent)" />
      </g>
    </svg>
  );
}

/** The same two figures drawn closer together — used at the pairing moment. */
export function ConnectedIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 160" fill="none" role="img" aria-hidden {...props}>
      <style>{`
        .aveyra-figure-a, .aveyra-figure-b {
          animation: aveyra-bob var(--dur-ambient) var(--ease-ambient) infinite;
          transform-origin: 50% 100%;
        }
        .aveyra-figure-b { animation-delay: 0.5s; }
        @keyframes aveyra-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      <ellipse cx="100" cy="150" rx="60" ry="7" fill="var(--color-accent-soft)" />
      <g className="aveyra-figure-a">
        <path d="M62 146c0-30 10-52 23-52s23 22 23 52Z" fill="var(--color-gold)" />
        <circle cx="85" cy="55" r="16" fill="var(--color-gold)" />
      </g>
      <g className="aveyra-figure-b">
        <path d="M92 146c0-30 10-52 23-52s23 22 23 52Z" fill="var(--color-accent)" />
        <circle cx="115" cy="55" r="16" fill="var(--color-accent)" />
      </g>
    </svg>
  );
}
