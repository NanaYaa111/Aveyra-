import { describe, it, expect } from 'vitest';
import {
  createInvitation,
  decodeInvitation,
  validateInvitation,
  isExpired,
} from '@/lib/invitation';

describe('invitation', () => {
  it('encodes and decodes losslessly', () => {
    const { payload, encoded } = createInvitation('rel-1', 'pubkey-abc');
    const decoded = decodeInvitation(encoded);
    expect(decoded.rel_id).toBe('rel-1');
    expect(decoded.inviter_public_key).toBe('pubkey-abc');
    expect(decoded.code).toBe(payload.code);
  });

  it('generates a single-use code from unambiguous characters', () => {
    const { payload } = createInvitation('rel-1', 'pub');
    expect(payload.code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/);
  });

  it('rejects an expired invitation', () => {
    const { encoded, payload } = createInvitation('rel-1', 'pub', -1000);
    expect(isExpired(payload)).toBe(true);
    expect(() => validateInvitation(encoded)).toThrow(/expired/i);
  });

  it('rejects a malformed invitation', () => {
    expect(() => decodeInvitation('not-a-real-token')).toThrow();
  });
});
