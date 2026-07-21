import { cn } from '@/lib/utils/cn';

/**
 * The Aveyra mark — "The Meeting Path": two journeys converging to an apex (an
 * "A"), with the light of discovery held in the space between them. Strokes use
 * currentColor; the light-point uses the gold token. See the brand guide.
 */
export function AveyraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-7 w-7', className)}
      fill="none"
      role="img"
      aria-label="Aveyra"
    >
      <g stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
        <path d="M9.5 24 L16 9.5" />
        <path d="M22.5 24 L16 9.5" />
      </g>
      <circle cx="16" cy="19.6" r="2.4" fill="var(--color-gold)" stroke="none" />
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-accent', className)}>
      <AveyraMark />
      <span className="font-display text-heading tracking-[0.02em] text-text">aveyra</span>
    </div>
  );
}
