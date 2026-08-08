import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'quiet' | 'danger';
type Size = 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

// Labels sit in the body face, not the display serif: a serif at button size
// reads heavy and slightly formal, and controls should feel plain to press.
const base =
  'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-pill ' +
  'transition-[background-color,box-shadow,transform] duration-fast ease-emphasis ' +
  'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ' +
  'min-h-[44px]'; // primary touch target (Constitution Part 2 §6)

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-onAccent hover:bg-accent-strong shadow-sm hover:shadow-md',
  secondary: 'bg-surface text-text border border-border hover:bg-bg-soft',
  quiet: 'bg-transparent text-text-soft hover:bg-bg-soft hover:text-text',
  danger: 'bg-transparent text-error border border-border hover:border-error',
};

const sizes: Record<Size, string> = {
  md: 'px-6 min-h-[52px] text-body',
  sm: 'px-4 min-h-[36px] text-label',
};

/** Accessible button built on a native <button>. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    />
  );
});
