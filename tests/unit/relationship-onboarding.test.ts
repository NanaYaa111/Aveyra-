import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { Outbox } from '@/lib/sync/outbox';
import {
  createInvite,
  createSpace,
  completeOnboarding,
  getOnboardingState,
  getOnboardingStep,
} from '@/lib/relationship';
import type { Relationship } from '@/lib/database/types';

function freshService() {
  const db = new AveyraDB('aveyra-test-' + crypto.randomUUID());
  return new DatabaseService(db, new Outbox(db));
}

const DEVICE_KEY = 'ZmFrZS1kZXZpY2UtcHVibGljLWtleQ=='; // base64 stand-in

let service: DatabaseService;
beforeEach(() => {
  service = freshService();
});

describe('getOnboardingStep (pure)', () => {
  const base: Relationship = {
    id: 'r1',
    creator_id: 'u1',
    partner_id: null,
    status: 'solo',
    partner_name: '',
    relationship_start_date: null,
    created_at: 0,
    updated_at: 0,
    deleted_at: null,
    schema_version: 1,
    version: 1,
  };

  it('is create-or-join with no relationship', () => {
    expect(getOnboardingStep(null)).toBe('create-or-join');
  });
  it('is awaiting-partner while solo or pending', () => {
    expect(getOnboardingStep({ ...base, status: 'solo' })).toBe('awaiting-partner');
    expect(getOnboardingStep({ ...base, status: 'pending' })).toBe('awaiting-partner');
  });
  it('is complete once linked', () => {
    expect(getOnboardingStep({ ...base, status: 'linked' })).toBe('complete');
  });
});

describe('createSpace', () => {
  it('creates a solo relationship for the creator', async () => {
    const rel = await createSpace(
      { creatorId: 'user-1', partnerName: '  Sam  ', startDate: 1000 },
      service,
    );
    expect(rel.status).toBe('solo');
    expect(rel.creator_id).toBe('user-1');
    expect(rel.partner_id).toBeNull();
    expect(rel.partner_name).toBe('Sam'); // trimmed
    expect(rel.relationship_start_date).toBe(1000);

    const state = await getOnboardingState(service);
    expect(state.step).toBe('awaiting-partner');
    expect(state.relationship?.id).toBe(rel.id);
  });
});

describe('createInvite', () => {
  it('requires a space first', async () => {
    await expect(createInvite(DEVICE_KEY, service)).rejects.toThrow(/create your space/i);
  });

  it('mints a shareable invite and moves the space to pending', async () => {
    await createSpace({ creatorId: 'user-1' }, service);
    const invite = await createInvite(DEVICE_KEY, service);
    expect(invite.encoded).toBeTruthy();
    expect(invite.code).toMatch(/^[A-Z0-9]{8}$/);
    expect(invite.expiresAt).toBeGreaterThan(Date.now());

    const rel = await service.getRelationship();
    expect(rel?.status).toBe('pending');
  });
});

describe('completeOnboarding', () => {
  it('persists the onboarded flag', async () => {
    expect((await service.getSettings()).onboarded).toBe(false);
    await completeOnboarding(service);
    expect((await service.getSettings()).onboarded).toBe(true);
  });
});
