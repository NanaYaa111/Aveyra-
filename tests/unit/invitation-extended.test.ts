import { describe, it, expect } from 'vitest';
import {
  createInvitation,
  encodeInvitation,
  decodeInvitation,
  validateInvitation,
  isExpired,
  type InvitationPayload,
} from '@/lib/invitation';

describe('invitation — encoding', () => {
  it('produces URL-safe base64 (no +, /, or = padding)', () => {
    const { encoded } = createInvitation('rel-1', 'pubkey-abc');
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('round-trips unicode content losslessly', () => {
    const relId = 'relación-café-💞-我们';
    const pub = 'ключ-🔑-Ω';
    const { encoded } = createInvitation(relId, pub);
    const decoded = decodeInvitation(encoded);
    expect(decoded.rel_id).toBe(relId);
    expect(decoded.inviter_public_key).toBe(pub);
  });

  it('round-trips a realistic-length public key', () => {
    const longKey = 'A'.repeat(400);
    const { encoded } = createInvitation('rel-长', longKey);
    expect(decodeInvitation(encoded).inviter_public_key).toBe(longKey);
  });
});

describe('invitation — validation', () => {
  it('validates a fresh invitation', () => {
    const { encoded, payload } = createInvitation('rel-1', 'pub');
    const ok = validateInvitation(encoded);
    expect(ok.code).toBe(payload.code);
  });

  it('detects expiry at the boundary', () => {
    const payload: InvitationPayload = {
      v: 1,
      rel_id: 'r',
      inviter_public_key: 'p',
      code: 'ABCD2345',
      expires_at: 1000,
    };
    expect(isExpired(payload, 1001)).toBe(true);
    expect(isExpired(payload, 1000)).toBe(false);
    expect(isExpired(payload, 999)).toBe(false);
  });

  it('rejects an expired invitation via validateInvitation', () => {
    const { encoded } = createInvitation('rel-1', 'pub', -1);
    expect(() => validateInvitation(encoded)).toThrow(/expired/i);
  });

  it('rejects a tampered token', () => {
    const { encoded } = createInvitation('rel-1', 'pub');
    // Corrupt the middle of the payload.
    const mid = Math.floor(encoded.length / 2);
    const swap = encoded[mid] === 'A' ? 'B' : 'A';
    const tampered = encoded.slice(0, mid) + swap + encoded.slice(mid + 1);
    expect(() => decodeInvitation(tampered)).toThrow();
  });

  it('rejects an unsupported version', () => {
    const future = encodeInvitation({
      v: 2 as unknown as 1,
      rel_id: 'r',
      inviter_public_key: 'p',
      code: 'ABCD2345',
      expires_at: Date.now() + 1000,
    });
    expect(() => decodeInvitation(future)).toThrow(/not valid/i);
  });

  it('rejects a payload missing required fields', () => {
    const partial = encodeInvitation({
      v: 1,
      rel_id: '',
      inviter_public_key: 'p',
      code: 'ABCD2345',
      expires_at: Date.now() + 1000,
    });
    expect(() => decodeInvitation(partial)).toThrow(/not valid/i);
  });
});

describe('invitation — code generation', () => {
  it('uses only unambiguous characters and is 8 long', () => {
    for (let i = 0; i < 50; i++) {
      const { payload } = createInvitation('r', 'p');
      expect(payload.code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/);
    }
  });

  it('generates distinct codes across invitations', () => {
    const codes = new Set(
      Array.from({ length: 100 }, () => createInvitation('r', 'p').payload.code),
    );
    // Collisions are astronomically unlikely; allow a tiny margin.
    expect(codes.size).toBeGreaterThan(95);
  });
});
