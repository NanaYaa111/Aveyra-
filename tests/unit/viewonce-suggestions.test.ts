import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { addToVault, consumeViewOnce, listVault, MAX_VIDEO_SECONDS } from '@/lib/vault';
import { forgetVaultKeys } from '@/lib/e2ee';
import { suggestionForDate, SUGGESTIONS } from '@/lib/suggestions';

let service: DatabaseService;
const REL = 'rel_1';

beforeEach(() => {
  __setDB(new AveyraDB('aveyra-vo-' + crypto.randomUUID()));
  service = new DatabaseService();
  // Each test gets a fresh device, so the derived key must not carry over.
  forgetVaultKeys();
});

const photo = () => new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'image/jpeg' });

describe('view-once media', () => {
  it('keeps a normal item after opening it', async () => {
    await addToVault(REL, photo(), {}, service);
    const [item] = await listVault(REL, service);
    expect(item!.viewOnce).toBe(false);

    await consumeViewOnce(REL, item!, service);
    expect(await listVault(REL, service)).toHaveLength(1);
  });

  it('marks a view-once item as such', async () => {
    await addToVault(REL, photo(), { viewOnce: true }, service);
    const [item] = await listVault(REL, service);
    expect(item!.viewOnce).toBe(true);
  });

  it('the sender can check their own without spending it', async () => {
    await addToVault(REL, photo(), { viewOnce: true }, service);
    const [item] = await listVault(REL, service);
    expect(item!.mine).toBe(true);

    await consumeViewOnce(REL, item!, service);
    // Still there: only the recipient's viewing consumes it.
    expect(await listVault(REL, service)).toHaveLength(1);
  });

  it("the recipient's viewing destroys it for good", async () => {
    await addToVault(REL, photo(), { viewOnce: true }, service);
    const [stored] = await listVault(REL, service);

    // Same row, seen from the other side.
    const theirs = { ...stored!, mine: false };
    const url = await consumeViewOnce(REL, theirs, service);
    expect(url).toMatch(/^blob:|^data:/);

    expect(await listVault(REL, service)).toHaveLength(0);
    // Gone, not soft-deleted — nothing to restore.
    await expect(consumeViewOnce(REL, theirs, service)).rejects.toThrow(/no longer here/i);
  });

  it('refuses a file that is neither photo nor video', async () => {
    const doc = new Blob(['hello'], { type: 'application/pdf' });
    await expect(addToVault(REL, doc, {}, service)).rejects.toThrow(/photos and video/i);
  });

  it('refuses an oversized photo', async () => {
    const big = new Blob([new Uint8Array(13 * 1024 * 1024)], { type: 'image/jpeg' });
    await expect(addToVault(REL, big, {}, service)).rejects.toThrow(/12MB/i);
  });

  it('caps video at a minute', () => {
    expect(MAX_VIDEO_SECONDS).toBe(60);
  });
});

describe('daily suggestions', () => {
  it('gives both devices the same suggestion for a day', () => {
    const day = new Date('2026-08-08T09:00:00Z');
    expect(suggestionForDate(REL, day).id).toBe(suggestionForDate(REL, day).id);
  });

  it('moves the next day', () => {
    const a = suggestionForDate(REL, new Date('2026-08-08T12:00:00Z')).id;
    const b = suggestionForDate(REL, new Date('2026-08-09T12:00:00Z')).id;
    expect(a).not.toBe(b);
  });

  it('does not move in lockstep with the question rotation', () => {
    // Different seed, so the two sequences are unrelated.
    const day = new Date('2026-08-08T12:00:00Z');
    const a = suggestionForDate('rel_a', day).id;
    const b = suggestionForDate('rel_b', day).id;
    expect(a).not.toBe(b);
  });

  it('every suggestion is an invitation, not an instruction or a diagnosis', () => {
    for (const s of SUGGESTIONS) {
      expect(s.text.trim()).toBeTruthy();
      // Nothing that implies something is wrong, or that this is clinical.
      expect(s.text).not.toMatch(/you should|you must|your problem|fix your|therapy|disorder/i);
      // Nothing that frames it as a task with a score.
      expect(s.text).not.toMatch(/streak|complete|challenge|points|level/i);
    }
  });

  it('carries no completion state — there is nothing to mark done', () => {
    const s = suggestionForDate(REL);
    expect(Object.keys(s).sort()).toEqual(['id', 'text']);
  });
});
