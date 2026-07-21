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

  it('does not close when the panel is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Backdrop">
        <p>panel content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByText('panel content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when the overlay (backdrop) itself is the click target', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Backdrop">
        <p>panel content</p>
      </Modal>,
    );
    // The dismiss handler lives on the overlay container that wraps the dialog.
    const overlay = screen.getByRole('dialog').parentElement!;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('keeps the visible scrim click-transparent so backdrop clicks reach the overlay', () => {
    // Regression guard for the real bug: the scrim must not intercept clicks,
    // otherwise clicking the *visible* backdrop never reaches the dismiss
    // handler. jsdom cannot model pointer-events geometry, so we assert the
    // structural contract directly.
    render(
      <Modal open onClose={() => {}} title="Scrim">
        body
      </Modal>,
    );
    const overlay = screen.getByRole('dialog').parentElement!;
    const scrim = overlay.querySelector('[aria-hidden]')!;
    expect(scrim.className).toContain('pointer-events-none');
  });

  it('locks body scroll while open and restores the exact prior value on close', () => {
    const prior = document.body.style.overflow; // capture the real starting value
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
    expect(document.body.style.overflow).toBe(prior);
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
