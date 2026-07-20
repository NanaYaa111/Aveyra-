'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils/cn';

type ToastTone = 'neutral' | 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  /** Optional single action, e.g. Undo (Constitution Part 2 §4.4). */
  action?: { label: string; onAction: () => void };
}

interface ToastContextValue {
  show: (message: string, opts?: { tone?: ToastTone; action?: ToastItem['action']; durationMs?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Access the toast API. Must be used under <ToastProvider>. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback<ToastContextValue['show']>(
    (message, opts) => {
      const id = nextId.current++;
      const tone = opts?.tone ?? 'neutral';
      // Undo needs a generous window (>= 10s per Part 2 §4.4).
      const duration = opts?.durationMs ?? (opts?.action ? 10_000 : 4_000);
      setToasts((list) => [...list, { id, message, tone, action: opts?.action }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Live region is always present in the DOM (Constitution Part 3 §13). */}
      <div
        className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 pb-safe pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 max-w-[28rem] w-full',
              'px-4 py-3 rounded-md shadow-md border text-body',
              'bg-surface-raised border-border',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'h-2 w-2 rounded-full shrink-0',
                t.tone === 'success' && 'bg-success',
                t.tone === 'error' && 'bg-error',
                t.tone === 'neutral' && 'bg-accent',
              )}
            />
            <span className="flex-1 text-text">{t.message}</span>
            {t.action && (
              <button
                className="text-label font-medium text-accent-strong min-h-[44px] px-1"
                onClick={() => {
                  t.action!.onAction();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
