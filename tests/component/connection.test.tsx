import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useConnection, isOnline } from '@/lib/net/connection';

afterEach(cleanup);

function setOnLine(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { value, configurable: true });
}

describe('useConnection', () => {
  it('starts from navigator.onLine', () => {
    setOnLine(true);
    const { result } = renderHook(() => useConnection());
    expect(result.current.online).toBe(true);
  });

  it('flips to offline and back as the browser fires events', () => {
    setOnLine(true);
    const { result } = renderHook(() => useConnection());

    act(() => {
      setOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.online).toBe(false);

    act(() => {
      setOnLine(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.online).toBe(true);
  });

  it('isOnline reflects navigator.onLine', () => {
    setOnLine(false);
    expect(isOnline()).toBe(false);
    setOnLine(true);
    expect(isOnline()).toBe(true);
  });
});
