import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '@/components/ui/Toast';

afterEach(cleanup);

function Harness({ onShow }: { onShow: (show: ReturnType<typeof useToast>['show']) => void }) {
  const { show } = useToast();
  return (
    <button onClick={() => onShow(show)}>trigger</button>
  );
}

describe('ToastProvider', () => {
  it('throws if useToast is used outside a provider', () => {
    // Suppress the expected React error boundary noise.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bad() {
      useToast();
      return null;
    }
    expect(() => render(<Bad />)).toThrow(/within <ToastProvider>/);
    spy.mockRestore();
  });

  it('shows a message in a polite live region', async () => {
    render(
      <ToastProvider>
        <Harness onShow={(show) => show('Saved to your story')} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    expect(screen.getByText('Saved to your story')).toBeInTheDocument();
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('runs an action (Undo) and dismisses the toast', async () => {
    const onAction = vi.fn();
    render(
      <ToastProvider>
        <Harness
          onShow={(show) =>
            show('Memory deleted', { tone: 'neutral', action: { label: 'Undo', onAction } })
          }
        />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByText('Memory deleted')).not.toBeInTheDocument();
  });

  it('auto-dismisses after its duration', () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <Harness onShow={(show) => show('Ephemeral', { durationMs: 4000 })} />
        </ToastProvider>,
      );
      act(() => {
        screen.getByRole('button', { name: 'trigger' }).click();
      });
      expect(screen.getByText('Ephemeral')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(4001);
      });
      expect(screen.queryByText('Ephemeral')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
