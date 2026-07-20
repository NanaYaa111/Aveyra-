import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  /** Hide the visible label but keep it for screen readers. */
  hideLabel?: boolean;
}

const fieldClass =
  'w-full min-h-[44px] px-3 rounded-md bg-surface text-text placeholder:text-text-mute ' +
  'border border-border transition-[border-color,box-shadow] duration-fast ease-emphasis ' +
  'focus:border-accent focus:outline-none focus-visible:outline-none ' +
  'aria-[invalid=true]:border-error';

/** Labelled text input with accessible hint/error wiring (aria-describedby). */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn('text-label font-medium text-text-soft', hideLabel && 'sr-only')}
      >
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-label text-text-mute">
          {hint}
        </p>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(fieldClass, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-label text-error">
          {error}
        </p>
      )}
    </div>
  );
});
