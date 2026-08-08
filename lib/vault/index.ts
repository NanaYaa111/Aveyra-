/**
 * The private vault — photos meant only for the two of you.
 *
 * The one part of Aveyra that is genuinely end-to-end encrypted. Bytes are
 * encrypted on this device with a key derived by ECDH between the two partners
 * (see lib/e2ee); what leaves the device is ciphertext, and the server stores
 * ciphertext. A breach, a subpoena, or an administrator with full database
 * access gets bytes that decrypt to nothing.
 *
 * Three deliberate departures from the rest of the app:
 *
 * - **Hard delete, not soft.** Everywhere else, deletion sets `deleted_at` and
 *   the row is recoverable. Here "delete" means gone — the row and the object
 *   are removed. Recoverable intimate photos are not deleted photos.
 * - **No captions or titles.** There is nothing to index, search, or leak in a
 *   backup, and nothing to describe a photo to anyone who shouldn't have it.
 * - **Not in exports.** The backup file is plaintext JSON by design (it has to
 *   be portable), so vault contents stay out of it entirely.
 *
 * Honest limits, stated in the UI too: this cannot stop a screenshot, an
 * unlocked phone, or a compromised device — and if both of you lose every
 * device, the vault is unrecoverable, because no copy of the key exists
 * anywhere else.
 */
import { getVaultKey } from '../e2ee';
import { aesEncrypt, aesDecrypt, fromBase64, toBase64, type Envelope } from '../encryption/primitives';
import { isSupabaseConfigured } from '../supabase/client';
import { getService, type DatabaseService } from '../database/service';
import { spDeleteVaultItem, spListVault, spUploadVaultItem, spFetchVaultBytes } from './supabaseRepo';

/** Metadata only — never a caption, never a filename. */
export interface VaultItem {
  id: string;
  created_at: number;
  /** Who added it, so the UI can say "you" or their name. */
  mine: boolean;
  /** Disappears from Aveyra once the other person has opened it. */
  viewOnce: boolean;
  /** Video rather than photo — the UI plays it instead of showing it. */
  isVideo: boolean;
}

/** Photos. Small enough that encrypting in memory is comfortable on a phone. */
const MAX_PHOTO_BYTES = 12 * 1024 * 1024;

/**
 * Video. Encryption is single-shot, so the plaintext and the ciphertext are
 * both in memory at once — the ceiling is about what a mid-range phone can hold,
 * not about storage.
 */
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
export const MAX_VIDEO_SECONDS = 60;

/**
 * Read a video's duration without decoding the whole file. Resolves to null if
 * the browser can't tell us, in which case the size limit is the only guard —
 * refusing a video we simply couldn't measure would be worse.
 */
export function videoDuration(file: File | Blob): Promise<number | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve(null);
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const done = (value: number | null) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* nothing to release */
      }
      resolve(value);
    };
    video.preload = 'metadata';
    video.onloadedmetadata = () => done(Number.isFinite(video.duration) ? video.duration : null);
    video.onerror = () => done(null);
    video.src = url;
  });
}

/** Everything in the vault, newest first. Metadata only; bytes load on demand. */
export async function listVault(
  relId: string | null,
  service: DatabaseService = getService(),
): Promise<VaultItem[]> {
  if (!relId) return [];
  if (isSupabaseConfigured()) return spListVault(relId);

  const rows = await service.listVaultLocal(relId);
  return rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    mine: true,
    viewOnce: r.view_once === true,
    isVideo: r.is_video === true,
  }));
}

/**
 * Encrypt a photo on this device and store the ciphertext. The plaintext bytes
 * never leave this function.
 */
export async function addToVault(
  relId: string,
  file: File | Blob,
  opts: { viewOnce?: boolean } = {},
  service: DatabaseService = getService(),
): Promise<void> {
  const isVideo = (file.type || '').startsWith('video/');
  const isImage = (file.type || '').startsWith('image/');
  if (file.type && !isVideo && !isImage) {
    throw new Error('The vault holds photos and video.');
  }

  if (isVideo) {
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error('That video is too large. Keep it under about a minute.');
    }
    const seconds = await videoDuration(file);
    if (seconds !== null && seconds > MAX_VIDEO_SECONDS + 1) {
      throw new Error(`Videos can be up to ${MAX_VIDEO_SECONDS} seconds.`);
    }
  } else if (file.size > MAX_PHOTO_BYTES) {
    throw new Error('That photo is larger than 12MB. Try a smaller one.');
  }

  const key = await getVaultKey(relId);
  const envelope = await aesEncrypt(key, await file.arrayBuffer());

  // The envelope's iv and ciphertext are what get stored — the mime type rides
  // along so the file can be rebuilt, and nothing else is recorded.
  const payload = JSON.stringify({ ...envelope, mime: file.type });
  const viewOnce = opts.viewOnce === true;

  if (isSupabaseConfigured()) {
    await spUploadVaultItem(
      relId,
      new Blob([payload], { type: 'application/octet-stream' }),
      { viewOnce, isVideo },
    );
    return;
  }
  await service.addVaultLocal(relId, payload, { viewOnce, isVideo });
}

/**
 * Decrypt one item for display. Returns an object URL the caller must revoke —
 * the decrypted bytes stay in memory only, never on disk.
 */
export async function openVaultItem(
  relId: string,
  id: string,
  service: DatabaseService = getService(),
): Promise<string> {
  const key = await getVaultKey(relId);
  const payload = isSupabaseConfigured()
    ? await spFetchVaultBytes(id)
    : await service.getVaultLocal(id);
  if (!payload) throw new Error('That one is no longer here.');

  const { mime, ...envelope } = JSON.parse(payload) as Envelope & { mime: string };
  const plain = await aesDecrypt(key, envelope);
  return URL.createObjectURL(new Blob([plain], { type: mime || 'image/jpeg' }));
}

/**
 * Open a view-once item and destroy it.
 *
 * The delete runs **after** the bytes are successfully decrypted, so a failure
 * to open never silently burns the one viewing — but once it has opened it is
 * gone, whether or not you look away. Only the recipient consumes it; the
 * sender can check their own without spending it.
 *
 * What this genuinely does: removes it from Aveyra and from the server, for
 * good. What it cannot do: stop a screenshot, or a second phone pointed at the
 * screen. The UI says exactly that rather than implying otherwise.
 */
export async function consumeViewOnce(
  relId: string,
  item: VaultItem,
  service: DatabaseService = getService(),
): Promise<string> {
  const url = await openVaultItem(relId, item.id, service);
  if (item.viewOnce && !item.mine) {
    await removeFromVault(item.id, service);
  }
  return url;
}

/** Remove for good — the row and the stored object, with no recovery path. */
export async function removeFromVault(
  id: string,
  service: DatabaseService = getService(),
): Promise<void> {
  if (isSupabaseConfigured()) {
    await spDeleteVaultItem(id);
    return;
  }
  await service.deleteVaultLocal(id);
}

/** Re-exported so callers don't reach into the crypto layer directly. */
export { toBase64, fromBase64 };
