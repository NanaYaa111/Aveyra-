import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
}

const fieldClass =
  'w-full min-h-[120px] p-3 rounded-md bg-surface text-text placeholder:text-text-mute ' +
  'border border-border leading-relaxed resize-y ' +
  'transition-[border-color] duration-fast ease-emphasis ' +
  'focus:border-accent focus:outline-none focus-visible:outline-none ' +
  'aria-[invalid=true]:border-error';

/** Labelled multiline input for entries and answers. Optimised for reading. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, hideLabel, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className={cn('text-label font-medium text-text-soft', hideLabel && 'sr-only')}
      >
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-label text-text-mute">
          {hint}
        </p>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        className={cn(fieldClass, 'max-w-prose', className)}
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
