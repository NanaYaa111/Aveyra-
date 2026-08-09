'use client';

import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Button, Card, EmptyState } from '@/components/ui';
import { useOnboarding } from '@/lib/relationship/context';
import {
  addToVault,
  consumeViewOnce,
  listVault,
  openVaultItem,
  removeFromVault,
  MAX_VIDEO_SECONDS,
  type VaultItem,
} from '@/lib/vault';
import { NoPartnerKeyError, publishPublicKey } from '@/lib/e2ee';
import { cn } from '@/lib/utils/cn';

export default function VaultPage() {
  const { relationship } = useOnboarding();
  const relId = relationship?.id ?? null;
  const partnerName = relationship?.partner_name || 'your partner';

  const [items, setItems] = useState<VaultItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingOnPartner, setWaitingOnPartner] = useState(false);
  const [viewOnce, setViewOnce] = useState(false);

  const refresh = useCallback(async () => {
    setItems(await listVault(relId));
  }, [relId]);

  useEffect(() => {
    // Publishing our public key is what lets the other device complete the key
    // agreement. Safe to repeat; public keys are not secret. A failure here is
    // worth surfacing rather than swallowing: silently unpublished, the partner
    // can never derive the key and the vault just appears broken to them.
    publishPublicKey().catch(() => {
      setError('Couldn’t set this device up for sharing. Reload and try again.');
    });
    void refresh();
  }, [refresh]);

  async function handleAdd(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !relId || busy) return;
    setBusy(true);
    setError(null);
    setWaitingOnPartner(false);
    try {
      await addToVault(relId, file, { viewOnce });
      await refresh();
    } catch (err) {
      if (err instanceof NoPartnerKeyError) setWaitingOnPartner(true);
      else setError(err instanceof Error ? err.message : 'Could not add that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="vault-heading" className="flex flex-col gap-5">
      <div>
        <h1 id="vault-heading" className="text-display mb-2">
          Vault
        </h1>
        <p className="text-text-soft">
          Photos only the two of you can open. These are encrypted on your device before they go
          anywhere, with a key only your two phones share.
        </p>
      </div>

      <Card className="flex flex-col gap-2 bg-bg-soft">
        <p className="text-label font-medium">What this does and doesn&apos;t protect</p>
        <ul className="text-label text-text-soft flex flex-col gap-1 list-disc pl-4">
          <li>The server stores these as scrambled bytes. Nobody running Aveyra Flow can open them.</li>
          <li>It can&apos;t stop a screenshot, or anyone holding an unlocked phone.</li>
          <li>
            If you both lose every device, these are gone for good — no one holds a spare key.
          </li>
          <li>Deleting here is permanent. There&apos;s no Recently Deleted for the vault.</li>
          <li>
            &ldquo;Show once&rdquo; really does delete it from Aveyra Flow after one view — but nothing
            can stop a screenshot. Videos up to {MAX_VIDEO_SECONDS} seconds.
          </li>
        </ul>
      </Card>

      {relId && (
        <div className="flex flex-col gap-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-label font-medium text-text-soft mb-1">How to send it</legend>
            <div className="flex flex-wrap gap-2">
              {[
                { v: false, label: 'Keep it here', hint: 'Stays until one of you removes it' },
                { v: true, label: 'Show once', hint: 'Disappears after they open it' },
              ].map((opt) => (
                <label
                  key={String(opt.v)}
                  className={cn(
                    'flex flex-col rounded-md border px-3 py-2 min-h-[44px] cursor-pointer',
                    'transition-colors duration-fast ease-emphasis',
                    'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
                    'focus-within:outline-[var(--color-focus)]',
                    viewOnce === opt.v
                      ? 'border-accent bg-accent-soft text-accent-strong'
                      : 'border-border bg-surface text-text-soft hover:bg-bg-soft',
                  )}
                >
                  <input
                    type="radio"
                    name="send-mode"
                    checked={viewOnce === opt.v}
                    onChange={() => setViewOnce(opt.v)}
                    className="sr-only"
                  />
                  <span className="text-label font-medium">{opt.label}</span>
                  <span className="text-label text-text-mute">{opt.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="inline-flex">
            <span className="sr-only">Add a photo or video to the vault</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleAdd}
              disabled={busy}
              className="text-label file:mr-3 file:rounded-pill file:border-0 file:bg-accent file:px-4 file:py-2 file:text-text-on-accent file:font-semibold file:min-h-[44px]"
            />
          </label>
          {busy && (
            <p className="text-label text-text-mute" role="status">
              Encrypting…
            </p>
          )}
          {waitingOnPartner && (
            <p className="text-text-soft" role="status">
              {partnerName} needs to open the vault once on their device before you can share here —
              that&apos;s how your two phones agree on a key.
            </p>
          )}
          {error && (
            <p className="text-error text-label" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {items !== null && items.length === 0 && (
        <EmptyState
          symbol="🤍"
          title="Nothing here yet"
          description="Whatever you put here stays between the two of you."
        />
      )}

      {items !== null && items.length > 0 && relId && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <VaultTile
                relId={relId}
                item={item}
                partnerName={partnerName}
                onRemoved={refresh}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * One vault item.
 *
 * A view-once item from the other person is **never** auto-opened: it would be
 * spent just by scrolling past it. It waits behind a tap, and once tapped it is
 * gone — from this device and from the server.
 *
 * Decrypted bytes live in an object URL only while the tile is mounted and are
 * released on unmount; nothing decrypted is written to disk.
 */
function VaultTile({
  relId,
  item,
  partnerName,
  onRemoved,
}: {
  relId: string;
  item: VaultItem;
  partnerName: string;
  onRemoved: () => Promise<void>;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [spent, setSpent] = useState(false);

  // Theirs + view-once means it must be opened deliberately, never on render.
  const holdForTap = item.viewOnce && !item.mine;

  useEffect(() => {
    if (holdForTap) return;
    let active = true;
    let created: string | null = null;
    openVaultItem(relId, item.id)
      .then((u) => {
        if (!active) {
          release(u);
          return;
        }
        created = u;
        setUrl(u);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
      release(created);
    };
  }, [relId, item.id, holdForTap]);

  // Release the revealed view-once URL when the tile goes away.
  useEffect(() => () => release(url), [url]);

  async function reveal() {
    try {
      const u = await consumeViewOnce(relId, item);
      setUrl(u);
      setSpent(true);
      await onRemoved();
    } catch {
      setFailed(true);
    }
  }

  return (
    <Card className="flex flex-col gap-2 p-2">
      <div className="aspect-square rounded-md bg-bg-soft grid place-items-center overflow-hidden">
        {holdForTap && !url ? (
          <button
            type="button"
            onClick={reveal}
            className="w-full h-full flex flex-col items-center justify-center gap-1 px-2 text-center hover:bg-border/40 min-h-[44px]"
          >
            <span aria-hidden className="text-2xl">
              {item.isVideo ? '🎬' : '🤍'}
            </span>
            <span className="text-label font-medium">Tap to view once</span>
            <span className="text-label text-text-mute">From {partnerName}</span>
          </button>
        ) : url ? (
          item.isVideo ? (
            <video
              src={url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              aria-label={item.mine ? 'A video you added' : `A video from ${partnerName}`}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- decrypted blob URL; no optimizer in a static export.
            <img
              src={url}
              alt={item.mine ? 'A photo you added' : `A photo from ${partnerName}`}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <span className="text-label text-text-mute">{failed ? 'Locked' : 'Opening…'}</span>
        )}
      </div>

      {item.viewOnce && (
        <p className="text-label text-text-mute">
          {spent
            ? 'Gone now — this was the one look.'
            : item.mine
              ? `Shows once, then it's gone`
              : 'One look only'}
        </p>
      )}

      {spent ? null : confirming ? (
        <div className="flex flex-col gap-1">
          <p className="text-label text-text-soft">Delete for good?</p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="danger"
              onClick={async () => {
                await removeFromVault(item.id);
                await onRemoved();
              }}
            >
              Delete
            </Button>
            <Button size="sm" variant="quiet" onClick={() => setConfirming(false)}>
              Keep
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="quiet" onClick={() => setConfirming(true)}>
          Remove
        </Button>
      )}
    </Card>
  );
}

/** Guarded: revokeObjectURL is missing in some environments. */
function release(url: string | null | undefined) {
  if (!url?.startsWith('blob:')) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // The blob goes when the document does.
  }
}
