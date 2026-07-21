import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingState } from '@/components/ui/LoadingState';
import { Card } from '@/components/ui/Card';

afterEach(cleanup);

describe('EmptyState', () => {
  it('renders a heading, description, and optional action', () => {
    render(
      <EmptyState
        symbol="🌤️"
        title="Nothing here yet"
        description="Your first entry will appear here."
        action={<button>Start</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
    expect(screen.getByText('Your first entry will appear here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('hides the decorative symbol from assistive tech', () => {
    render(<EmptyState symbol="📖" title="T" description="D" />);
    // The emoji is aria-hidden, so it is not part of the accessible tree name.
    expect(screen.getByText('📖')).toHaveAttribute('aria-hidden');
  });
});

describe('ErrorMessage', () => {
  it('announces politely by default', () => {
    render(<ErrorMessage>Something gentle went wrong.</ErrorMessage>);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Something gentle went wrong.')).toBeInTheDocument();
  });

  it('announces assertively when urgent', () => {
    render(<ErrorMessage urgent>Import failed.</ErrorMessage>);
    const region = screen.getByRole('alert');
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });
});

describe('LoadingState', () => {
  it('exposes a labelled polite status', () => {
    render(<LoadingState label="Preparing your export" />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Preparing your export')).toBeInTheDocument();
  });
});

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>Inside a calm surface</p>
      </Card>,
    );
    expect(screen.getByText('Inside a calm surface')).toBeInTheDocument();
  });
});
