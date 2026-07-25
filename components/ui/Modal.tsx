'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Use role="alertdialog" for confirmations/errors that need attention. */
  alert?: boolean;
}


export function Modal({ open, onClose, title, children, footer, alert }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* pointer-events-none so a click on the visible backdrop falls through to
          the overlay container above, which handles dismiss (target === self). */}
      <div className="absolute inset-0 bg-scrim backdrop-blur-sm pointer-events-none" aria-hidden />
      <div
        ref={trapRef}
        role={alert ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative w-full max-w-[32rem] max-h-[90dvh] overflow-y-auto',
          'bg-surface rounded-xl shadow-lg',
        )}
      >
        <div className="flex items-center justify-between gap-3 p-5 pb-3">
          <h2 id={titleId} className="text-heading">
            {title}
          </h2>
          <Button variant="quiet" size="sm" aria-label="Close" onClick={onClose}>
            <span aria-hidden>✕</span>
          </Button>
        </div>
        <div className="px-5 pb-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 p-4 border-t border-border sticky bottom-0 bg-surface">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
