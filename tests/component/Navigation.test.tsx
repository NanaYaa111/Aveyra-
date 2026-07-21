import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// next/navigation's usePathname drives the active-destination marking.
vi.mock('next/navigation', () => ({
  usePathname: () => '/story',
}));

import { Navigation, type NavItem } from '@/components/ui/Navigation';

afterEach(cleanup);

const items: NavItem[] = [
  { href: '/today', label: 'Today', icon: <span aria-hidden>t</span> },
  { href: '/story', label: 'Story', icon: <span aria-hidden>s</span> },
  { href: '/write', label: 'Write', icon: <span aria-hidden>w</span> },
  { href: '/settings', label: 'Settings', icon: <span aria-hidden>g</span> },
];

describe('Navigation', () => {
  it('renders a labelled primary nav with every destination', () => {
    render(<Navigation items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toBeInTheDocument();
    for (const item of items) {
      expect(screen.getByRole('link', { name: new RegExp(item.label) })).toBeInTheDocument();
    }
  });

  it('marks exactly the current destination with aria-current="page"', () => {
    render(<Navigation items={items} />);
    const current = screen.getByRole('link', { name: /Story/ });
    expect(current).toHaveAttribute('aria-current', 'page');

    const others = ['Today', 'Write', 'Settings'];
    for (const label of others) {
      expect(screen.getByRole('link', { name: new RegExp(label) })).not.toHaveAttribute(
        'aria-current',
      );
    }
  });

  it('treats nested paths as within their destination', () => {
    // usePathname is mocked to '/story', and '/story' should be active.
    render(<Navigation items={items} />);
    expect(screen.getByRole('link', { name: /Story/ })).toHaveAttribute('aria-current', 'page');
  });
});
