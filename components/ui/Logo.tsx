import { cn } from '@/lib/utils/cn';

export function AveyraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-7 w-7', className)}
      fill="none"
      role="img"
      aria-label="Aveyra"
    >
      <defs>
        <linearGradient id="aveyra-heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </linearGradient>
      </defs>
      {/* The A */}
      <g stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
        <path d="M9.5 24 L16 9.5" />
        <path d="M22.5 24 L16 9.5" />
      </g>
      {/* Heart cradled inside the A (rose → rose-gold) */}
      <path
        d="M16 21.6 C 13.2 19.1 12.7 17.4 14.4 16.5 C 15.4 16 16 16.9 16 16.9 C 16 16.9 16.6 16 17.6 16.5 C 19.3 17.4 18.8 19.1 16 21.6 Z"
        fill="url(#aveyra-heart)"
        stroke="none"
      />
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-accent', className)}>
      <AveyraMark />
      <span className="font-display text-heading tracking-[0.01em] text-text">Aveyra</span>
    </div>
  );
}
