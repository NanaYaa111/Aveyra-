import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ErrorMessageProps {
  children: ReactNode;
  /** Announce assertively for critical failures (e.g. import failed). */
  urgent?: boolean;
  className?: string;
}

/**
 * Human-friendly error surface. Never exposes stack traces or error codes
 * (Constitution Part 4 §9). Announced to assistive tech.
 */
export function ErrorMessage({ children, urgent, className }: ErrorMessageProps) {
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      aria-live={urgent ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 p-3 rounded-md text-body',
        'bg-accent-soft text-text border border-border',
        className,
      )}
    >
      <span aria-hidden className="text-error mt-0.5">
        !
      </span>
      <div className="text-text-soft">{children}</div>
    </div>
  );
}
