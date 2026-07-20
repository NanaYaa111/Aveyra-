import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Remove default padding (e.g. for full-bleed media). */
  flush?: boolean;
}

/** A calm surface container. */
export function Card({ flush, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg shadow-sm',
        !flush && 'p-5',
        className,
      )}
      {...props}
    />
  );
}
