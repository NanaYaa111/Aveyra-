import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

afterEach(cleanup);

describe('Input — accessible wiring', () => {
  it('associates the visible label with the field', () => {
    render(<Input label="Your name" />);
    expect(screen.getByLabelText('Your name')).toBeInTheDocument();
  });

  it('keeps the label for screen readers when hidden', () => {
    render(<Input label="Search" hideLabel />);
    // Still reachable by accessible name even though visually hidden.
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('wires hint and error through aria-describedby', () => {
    render(<Input label="Email" hint="We never share it" error="Required" />);
    const field = screen.getByLabelText('Email');
    const describedby = field.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    const ids = describedby!.split(' ');
    expect(ids.length).toBe(2);
    for (const id of ids) expect(document.getElementById(id)).toBeInTheDocument();
    expect(screen.getByText('We never share it')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('marks the field invalid only when there is an error', () => {
    const { rerender } = render(<Input label="Name" />);
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid');
    rerender(<Input label="Name" error="Nope" />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Textarea — accessible wiring', () => {
  it('associates the label and describes with hint/error', () => {
    render(<Textarea label="Your answer" hint="Take your time" error="Too short" />);
    const field = screen.getByLabelText('Your answer');
    expect(field.tagName).toBe('TEXTAREA');
    const ids = field.getAttribute('aria-describedby')!.split(' ');
    expect(ids.length).toBe(2);
    expect(field).toHaveAttribute('aria-invalid', 'true');
  });
});
