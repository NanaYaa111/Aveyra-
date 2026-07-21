import type { Config } from 'tailwindcss';

/**
 * Tailwind theme maps utility classes onto design tokens (CSS variables defined
 * in app/globals.css). Components reference tokens through these utilities —
 * never a literal colour/size value (Constitution Part 4 §2.3).
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bg: {
        DEFAULT: 'var(--color-bg)',
        soft: 'var(--color-bg-soft)',
      },
      surface: {
        DEFAULT: 'var(--color-surface)',
        raised: 'var(--color-surface-raised)',
      },
      border: 'var(--color-border)',
      text: {
        DEFAULT: 'var(--color-text)',
        soft: 'var(--color-text-soft)',
        mute: 'var(--color-text-mute)',
        onAccent: 'var(--color-text-on-accent)',
      },
      accent: {
        DEFAULT: 'var(--color-accent)',
        strong: 'var(--color-accent-strong)',
        soft: 'var(--color-accent-soft)',
      },
      gold: 'var(--color-gold)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      focus: 'var(--color-focus)',
    },
    borderRadius: {
      none: '0',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
      pill: 'var(--radius-pill)',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
    },
    fontFamily: {
      display: 'var(--font-display)',
      body: 'var(--font-body)',
    },
    extend: {
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
      },
      fontSize: {
        label: ['var(--text-label)', { lineHeight: '1.4' }],
        body: ['var(--text-body)', { lineHeight: '1.6' }],
        heading: ['var(--text-heading)', { lineHeight: '1.25' }],
        display: ['var(--text-display)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      transitionTimingFunction: {
        emphasis: 'var(--ease)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
      },
      maxWidth: {
        prose: '68ch',
        app: 'var(--app-max-width)',
      },
    },
  },
  plugins: [],
};

export default config;
