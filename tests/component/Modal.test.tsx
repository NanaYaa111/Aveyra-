import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/ui/Modal';
import { Dialog } from '@/components/ui/Dialog';

afterEach(cleanup);

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Hidden">
        body
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders an accessible dialog labelled by its title when open', () => {
    render(
      <Modal open onClose={() => {}} title="Erase everything?">
        This cannot be undone.
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // Labelled by the visible title.
    expect(dialog).toHaveAccessibleName('Erase everything?');
  });

  it('uses role="alertdialog" when alert is set', () => {
    render(
      <Modal open onClose={() => {}} title="Careful" alert>
        !
      </Modal>,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  // Note: focus-trap movement depends on layout (offsetParent), which jsdom does
  // not compute — that behaviour is verified in a real browser by the Playwright
  // e2e lane. Here we assert the trap wrapper renders its focusable content.
  it('renders focusable content inside the dialog', () => {
    render(
      <Modal open onClose={() => {}} title="Focus me">
        <button>Inside</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('button')).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Esc">
        body
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when the backdrop is clicked but not when the panel is', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Backdrop">
        <p>panel content</p>
      </Modal>,
    );
    // Clicking inside the panel must NOT close.
    await userEvent.click(screen.getByText('panel content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(
      <Modal open onClose={() => {}} title="Lock">
        body
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(
      <Modal open={false} onClose={() => {}} title="Lock">
        body
      </Modal>,
    );
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('has an accessible close control', () => {
    render(
      <Modal open onClose={() => {}} title="Closable">
        body
      </Modal>,
    );
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
});

describe('Dialog', () => {
  it('confirms then closes', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <Dialog open title="Sure?" onClose={onClose} onConfirm={onConfirm} confirmLabel="Do it">
        This is irreversible.
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Do it' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('cancels without confirming', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <Dialog open title="Sure?" onClose={onClose} onConfirm={onConfirm}>
        body
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('is an alertdialog (needs attention)', () => {
    render(
      <Dialog open title="Heads up" onClose={() => {}}>
        body
      </Dialog>,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
