import type { ReactNode } from 'react';

export interface EmptyStateProps {
  /** A quiet visual anchor (emoji or icon). Decorative only. */
  symbol?: string;
  title: string;
  description: string;
  /** Exactly one small next action (Constitution Part 2 §9). */
  action?: ReactNode;
}


export function EmptyState({ symbol, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-8 px-4">
      {symbol && (
        <span className="text-4xl" aria-hidden>
          {symbol}
        </span>
      )}
      <h2 className="text-heading">{title}</h2>
      <p className="text-text-soft max-w-prose">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
