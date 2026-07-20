'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

type ThemeChoice = 'system' | 'light' | 'dark';
const STORAGE_KEY = 'aveyra-theme';
const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') {
    root.removeAttribute('data-theme');
    localStorage.removeItem(STORAGE_KEY);
  } else {
    root.setAttribute('data-theme', choice);
    localStorage.setItem(STORAGE_KEY, choice);
  }
}

/**
 * Appearance control: System / Light / Dark. Dark mode is a first-class theme,
 * not an afterthought (Constitution Part 2 §3.4). Choice persists locally.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>('system');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') setChoice(stored);
  }, []);

  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex gap-1 rounded-pill bg-bg-soft p-1">
      {OPTIONS.map((opt) => {
        const selected = choice === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            onClick={() => {
              setChoice(opt.value);
              apply(opt.value);
            }}
            className={cn(
              'min-h-[44px] px-4 rounded-pill text-label font-medium transition-colors duration-fast ease-emphasis',
              selected ? 'bg-surface text-text shadow-sm' : 'text-text-mute hover:text-text',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
