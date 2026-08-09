'use client';

import { LoadingState, EmptyState, ILock } from './primitives';
import { useOnboarding } from '@/lib/relationship/context';
import { useState, useEffect, useCallback } from 'react';
import { listVault, type VaultItem } from '@/lib/vault';

export function VaultScreenAdapter() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;

  const [items, setItems] = useState<VaultItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!relId) {
      setLoading(false);
      return;
    }
    const v = await listVault(relId);
    setItems(v);
    setLoading(false);
  }, [relId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 py-8 md:py-12">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Vault
        </h1>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', marginTop: 4 }}>Private, encrypted storage for the two of you.</div>
      </div>

      {items && items.length === 0 && (
        <EmptyState
          icon="🔐"
          title="Nothing in the vault yet"
          body="Share private moments you both want to keep safe."
        />
      )}

      {items && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-edge)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div style={{ fontSize: 20 }}>
                    {item.isVideo ? '🎥' : '📸'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 4 }}>
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    {item.mine && (
                      <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>You shared this</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.viewOnce && (
                    <div style={{ fontSize: 11, color: 'var(--color-alert)', fontWeight: 600, padding: '2px 6px', backgroundColor: 'var(--color-tint)', borderRadius: 4, whiteSpace: 'nowrap' }}>
                      View once
                    </div>
                  )}
                  <ILock size={16} style={{ color: 'var(--color-accent)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
