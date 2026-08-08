'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

/** Optional brand lockup, shown at the top of the desktop rail only. */
export interface NavigationProps {
  items: NavItem[];
  brand?: ReactNode;
}


export function Navigation({ items, brand }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // With more than five destinations the mobile bottom bar goes icon-first:
  // labels stay for screen readers (sr-only) and the desktop rail always shows
  // them. Touch targets keep their 44px minimum either way.
  const compact = items.length > 5;

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'bg-surface border-border',
        // Mobile: fixed bottom bar with safe-area padding.
        'fixed inset-x-0 bottom-0 z-40 border-t pb-safe',
        // Desktop: static left rail.
        'sm:static sm:h-dvh sm:w-60 sm:border-t-0 sm:border-r sm:pb-0',
      )}
    >
      {brand && <div className="hidden sm:block px-5 pt-6 pb-2">{brand}</div>}
      <ul
        className={cn(
          'flex items-stretch',
          // Beyond ~7 destinations, dividing the width evenly pushes each target
          // under the 44px minimum on a normal phone (375px ÷ 9 ≈ 41px). So the
          // bar scrolls horizontally instead and every target keeps its size —
          // nothing is hidden behind an overflow menu, it just slides.
          compact
            ? 'justify-start overflow-x-auto max-sm:snap-x'
            : 'justify-around',
          'sm:flex-col sm:justify-start sm:gap-1 sm:p-3 sm:pt-6 sm:overflow-visible',
        )}
      >
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <li
              key={item.href}
              className={cn(
                'sm:flex-none',
                // Scrolling bar: fixed-width targets rather than shares of the
                // screen, so they never shrink below the minimum.
                compact ? 'flex-none min-w-[56px] max-sm:snap-start' : 'flex-1',
              )}
            >
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col sm:flex-row items-center sm:gap-3 gap-1',
                  'px-3 py-2 sm:py-3 rounded-md min-h-[44px] justify-center sm:justify-start',
                  'text-label sm:text-body transition-colors duration-fast ease-emphasis',
                  active
                    ? 'text-accent-strong sm:bg-accent-soft'
                    : 'text-text-mute hover:text-text hover:bg-bg-soft',
                )}
              >
                <span className={cn(active && 'text-accent-strong')}>{item.icon}</span>
                <span className={cn('font-medium', compact && 'max-sm:sr-only')}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
