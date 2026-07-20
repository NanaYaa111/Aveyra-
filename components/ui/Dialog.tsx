'use client';

import type { ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  destructive?: boolean;
}

/**
 * A focused confirm/alert dialog built on Modal (role="alertdialog").
 *
 * Note: the Constitution prefers *undo over confirm* for destructive user
 * content (Part 2 §4.4). Reserve this for the rare irreversible action that
 * genuinely warrants a stop (e.g. erasing all local data).
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  destructive,
}: DialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      alert
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button
              variant={destructive ? 'danger' : 'primary'}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmLabel}
            </Button>
          )}
        </>
      }
    >
      <p className="text-text-soft">{children}</p>
    </Modal>
  );
}
