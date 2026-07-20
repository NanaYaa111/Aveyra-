import { cn } from '@/lib/utils/cn';

export interface LoadingStateProps {
  /** Screen-reader label for what is loading. */
  label: string;
  className?: string;
}

/**
 * A quiet, accessible busy indicator. Used ONLY for genuinely slow local work
 * — image decoding, export, import — never for operations under 200ms
 * (Constitution Part 2 §4.3).
 */
export function LoadingState({ label, className }: LoadingStateProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-3 py-6 text-text-soft', className)}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden
        className="h-4 w-4 rounded-full border-2 border-border border-t-accent animate-spin motion-reduce:animate-none"
      />
      <span className="text-label">{label}</span>
    </div>
  );
}
