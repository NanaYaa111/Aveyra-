import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'default' | 'lavender' | 'coral';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Remove default padding (e.g. for full-bleed media). */
  flush?: boolean;
  /** Colour block, matching the flatter, tinted card language (default: plain surface). */
  tone?: Tone;
  children?: ReactNode;
}

const tones: Record<Tone, string> = {
  default: 'bg-surface border border-border',
  lavender: 'bg-accent-soft border-none',
  coral: 'bg-[color:var(--color-gold)]/25 border-none',
};

/** A calm surface container. */
export function Card({ flush, tone = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl shadow-sm', tones[tone], !flush && 'p-5', className)}
      {...props}
    />
  );
}
