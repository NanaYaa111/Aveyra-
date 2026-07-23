/**
 * Onboarding & relationship-space orchestration (Milestone 2).
 *
 * Composes the M1 foundations — {@link DatabaseService} (relationship CRUD +
 * settings), the device key (for a future E2EE handshake), and the invitation
 * encoder — into the operations the onboarding screens call. Backend-agnostic:
 * the same functions run against the local stub today and Supabase later.
 *
 * HONESTY (Constitution Part 2 §5): a real cross-device *link* requires the
 * server, so this module does NOT fake two devices joining. It can create a
 * space and mint a shareable invitation now; the partner-join handshake and the
 * transition to `linked` land with the Supabase stage. `getOnboardingStep`
 * therefore reports `awaiting-partner` until the backend confirms a real link.
 */
import { getService, type DatabaseService } from '../database/service';
import { createInvitation, validateInvitation } from '../invitation';
import type { Relationship } from '../database/types';

/** Where the couple is in setup, derived from the relationship + link status. */
export type OnboardingStep = 'create-or-join' | 'awaiting-partner' | 'complete';

export interface OnboardingState {
  step: OnboardingStep;
  relationship: Relationship | null;
}

/** Pure derivation — no I/O, so it is trivially testable and UI-driving. */
export function getOnboardingStep(relationship: Relationship | null): OnboardingStep {
  if (!relationship) return 'create-or-join';
  if (relationship.status === 'linked') return 'complete';
  return 'awaiting-partner';
}

export interface CreateSpaceInput {
  /** The self user's id (the account holder creating the space). */
  creatorId: string;
  /** Optional partner display name (partner-forward copy; not required). */
  partnerName?: string;
  /** Optional relationship start date (epoch ms) — a real timeline anchor. */
  startDate?: number | null;
}

/** Create the couple's space. Starts `solo` — no partner linked yet. */
export async function createSpace(
  input: CreateSpaceInput,
  service: DatabaseService = getService(),
): Promise<Relationship> {
  return service.createRelationship({
    creator_id: input.creatorId,
    partner_id: null,
    status: 'solo',
    partner_name: input.partnerName?.trim() ?? '',
    relationship_start_date: input.startDate ?? null,
  });
}

export interface Invite {
  /** Base64url token — shareable as a link or QR code. */
  encoded: string;
  /** Short, human-typable single-use code. */
  code: string;
  /** Epoch ms after which the invitation is invalid. */
  expiresAt: number;
}

/**
 * Mint an invitation for the current space and mark it `pending` (an invite is
 * outstanding). `devicePublicKey` comes from the KeyManager, carried for the
 * future E2EE key exchange. Throws (calm message) if there is no space yet.
 */
export async function createInvite(
  devicePublicKey: string,
  service: DatabaseService = getService(),
): Promise<Invite> {
  const relationship = await service.getRelationship();
  if (!relationship) {
    throw new Error('Create your space before inviting your partner.');
  }
  const { payload, encoded } = createInvitation(relationship.id, devicePublicKey);
  if (relationship.status === 'solo') {
    await service.updateRelationship(relationship.id, { status: 'pending' });
  }
  return { encoded, code: payload.code, expiresAt: payload.expires_at };
}

/**
 * Join a partner's space from an invitation. Validates the token (calm throw on
 * invalid/expired), then records a LOCAL `pending` space so the joiner can enter
 * and use Aveyra while the real cross-device merge is completed server-side (M2
 * backend). Honest state: `pending`, never `linked`, until the backend confirms.
 */
export async function joinWithInvite(
  encoded: string,
  joinerId: string,
  service: DatabaseService = getService(),
): Promise<Relationship> {
  validateInvitation(encoded); // throws a human message if malformed or expired
  return service.createRelationship({
    creator_id: joinerId,
    partner_id: null,
    status: 'pending',
    partner_name: '',
    relationship_start_date: null,
  });
}

/** The current onboarding state (relationship + derived step). */
export async function getOnboardingState(
  service: DatabaseService = getService(),
): Promise<OnboardingState> {
  const relationship = (await service.getRelationship()) ?? null;
  return { step: getOnboardingStep(relationship), relationship };
}

/** Mark first-run onboarding complete (persists the flag in settings). */
export async function completeOnboarding(service: DatabaseService = getService()): Promise<void> {
  await service.updateSettings({ onboarded: true });
}
