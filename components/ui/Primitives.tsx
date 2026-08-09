'use client';

import React from 'react';

export function Btn({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
}: {
  variant?: 'primary' | 'secondary' | 'quiet';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}) {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'rgba(168,63,91,0.75)',
      color: '#f5dfe8',
      border: '1px solid rgba(168,63,91,0.5)',
      boxShadow: '0 0 18px rgba(168,63,91,0.22)',
    },
    secondary: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: 'rgba(245,210,225,0.75)',
      border: '1px solid rgba(245,180,200,0.15)',
    },
    quiet: {
      backgroundColor: 'transparent',
      color: 'var(--color-muted)',
      border: '1px solid var(--color-edge)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`av-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm cursor-pointer ${className}`}
      style={{
        fontFamily: 'var(--font-sans)',
        minHeight: 44,
        opacity: disabled ? 0.45 : 1,
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)' }}
    >
      {children}
    </div>
  );
}

export function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 gap-4">
      <div style={{ color: 'var(--color-edge)', fontSize: 40 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)' }}>
          {title}
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 6, maxWidth: 280, lineHeight: 1.6 }}>
          {body}
        </div>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full av-pulse"
            style={{
              backgroundColor: 'var(--color-edge)',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>One moment…</div>
    </div>
  );
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--color-muted)',
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}
