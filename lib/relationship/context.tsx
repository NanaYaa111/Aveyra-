'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../auth/context';
import { ensureSelfUser } from '../identity';
import { getKeyManager } from '../encryption';
import { getService } from '../database/service';
import {
  completeOnboarding as completeOnboardingSvc,
  createInvite as createInviteSvc,
  createSpace as createSpaceSvc,
  joinWithInvite as joinWithInviteSvc,
  type Invite,
} from './onboarding';
import { isSupabaseConfigured } from '../auth';
import { spCreateInvite, spCreateSpace, spGetRelationship, spJoin } from './supabaseRepo';
import type { Relationship } from '../database/types';

/** Pull the raw code/token from a pasted invite link or return the input as-is. */
function inviteCodeFrom(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/[?&]invite=([^&\s]+)/);
  return match ? decodeURIComponent(match[1]!) : trimmed;
}

interface CreateSpaceArgs {
  yourName: string;
  partnerName?: string;
  startDate?: number | null;
}

interface OnboardingContextValue {
  /** null while resolving; then whether first-run setup is finished. */
  onboarded: boolean | null;
  relationship: Relationship | null;
  createSpace: (args: CreateSpaceArgs) => Promise<void>;
  joinSpace: (args: { yourName: string; encoded: string }) => Promise<void>;
  createInvite: () => Promise<Invite>;
  finish: () => Promise<void>;
  /** DEV ONLY (no backend): locally mark the partner as linked so the flow demos. */
  devSimulatePartnerJoined: () => Promise<void>;
  refresh: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

async function deviceKey(): Promise<string> {
  try {
    return (await getKeyManager().devicePublicKey()) ?? '';
  } catch {
    return '';
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [relationship, setRelationship] = useState<Relationship | null>(null);

  const refresh = useCallback(async () => {
    const rel = isSupabaseConfigured()
      ? await spGetRelationship()
      : ((await getService().getRelationship()) ?? null);
    // Returning device: a fully-linked server space means setup is already done,
    // so don't force a re-run of onboarding on a second device.
    if (isSupabaseConfigured() && rel?.status === 'linked') {
      const s = await getService().getSettings();
      if (s.onboarded !== true) await getService().updateSettings({ onboarded: true });
    }
    const settings = await getService().getSettings();
    setRelationship(rel);
    setOnboarded(settings.onboarded === true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      void refresh();
    } else if (status === 'unauthenticated') {
      setOnboarded(null);
      setRelationship(null);
    }
  }, [status, refresh]);

  const createSpace = useCallback(
    async ({ yourName, partnerName, startDate }: CreateSpaceArgs) => {
      if (isSupabaseConfigured()) {
        await spCreateSpace({ yourName, startDate });
      } else {
        const self = await ensureSelfUser(yourName.trim());
        await createSpaceSvc({ creatorId: self.id, partnerName, startDate });
      }
      await refresh();
    },
    [refresh],
  );

  const joinSpace = useCallback(
    async ({ yourName, encoded }: { yourName: string; encoded: string }) => {
      const code = inviteCodeFrom(encoded);
      if (isSupabaseConfigured()) {
        await spJoin({ yourName, code });
      } else {
        const self = await ensureSelfUser(yourName.trim());
        await joinWithInviteSvc(code, self.id);
      }
      await refresh();
    },
    [refresh],
  );

  const createInvite = useCallback(async () => {
    const invite = isSupabaseConfigured()
      ? await spCreateInvite()
      : await createInviteSvc(await deviceKey());
    await refresh();
    return invite;
  }, [refresh]);

  const finish = useCallback(async () => {
    await completeOnboardingSvc();
    await refresh();
  }, [refresh]);

  const devSimulatePartnerJoined = useCallback(async () => {
    const rel = await getService().getRelationship();
    if (rel) {
      await getService().updateRelationship(rel.id, { status: 'linked', partner_id: 'partner-stub' });
      await refresh();
    }
  }, [refresh]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      onboarded,
      relationship,
      createSpace,
      joinSpace,
      createInvite,
      finish,
      devSimulatePartnerJoined,
      refresh,
    }),
    [
      onboarded,
      relationship,
      createSpace,
      joinSpace,
      createInvite,
      finish,
      devSimulatePartnerJoined,
      refresh,
    ],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within <OnboardingProvider>');
  return ctx;
}
