'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * Top-level error boundary. A render error anywhere below shows a calm, honest
 * recovery surface instead of a blank white screen (Constitution Part 4 §9 —
 * never expose stack traces; always offer a way forward). Local data is
 * untouched by a render error, so reloading is safe.
 *
 * Deliberately dependency-free and class-based (the only way to catch render
 * errors in React) and styled with tokens only.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="min-h-dvh grid place-items-center p-6 bg-bg text-text"
      >
        <div className="max-w-prose text-center flex flex-col items-center gap-4">
          <span aria-hidden className="text-4xl">
            🌥️
          </span>
          <h1 className="text-heading">Something went quiet</h1>
          <p className="text-text-soft">
            The app hit an unexpected snag. Nothing you&apos;ve saved is affected — it&apos;s
            safely stored. Reloading usually sets things right.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-pill bg-accent text-onAccent font-medium shadow-sm hover:bg-accent-strong"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
