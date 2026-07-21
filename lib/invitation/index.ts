/**
 * Invitation foundation (backend-agnostic). Milestone 1 can GENERATE and PARSE
 * a secure, single-use, expiring invitation that carries the inviter's device
 * public key — everything that can be done without a server. The network
 * handshake that actually links two devices (and enforces single-use across
 * them) is Milestone 2, when a backend exists.
 */

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars

export interface InvitationPayload {
  v: 1;
  rel_id: string;
  /** Inviter device public key (base64) — for future E2EE key exchange. */
  inviter_public_key: string;
  /** Short human-typable single-use code. */
  code: string;
  /** Epoch ms after which the invitation is invalid. */
  expires_at: number;
}

function randomCode(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = '';
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

export function createInvitation(
  relId: string,
  inviterPublicKey: string,
  ttlMs: number = DEFAULT_TTL_MS,
): { payload: InvitationPayload; encoded: string } {
  const payload: InvitationPayload = {
    v: 1,
    rel_id: relId,
    inviter_public_key: inviterPublicKey,
    code: randomCode(),
    expires_at: Date.now() + ttlMs,
  };
  return { payload, encoded: encodeInvitation(payload) };
}

/** Base64url of the JSON payload — shareable as a link or QR code. */
export function encodeInvitation(payload: InvitationPayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeInvitation(encoded: string): InvitationPayload {
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  const parsed = JSON.parse(json) as InvitationPayload;
  if (parsed.v !== 1 || !parsed.rel_id || !parsed.inviter_public_key || !parsed.code) {
    throw new Error('This invitation is not valid.');
  }
  return parsed;
}

export function isExpired(payload: InvitationPayload, at: number = Date.now()): boolean {
  return at > payload.expires_at;
}

/** Validate an encoded invitation, throwing a human message on failure. */
export function validateInvitation(encoded: string): InvitationPayload {
  const payload = decodeInvitation(encoded);
  if (isExpired(payload)) {
    throw new Error('This invitation has expired. Ask your partner for a new one.');
  }
  return payload;
}
