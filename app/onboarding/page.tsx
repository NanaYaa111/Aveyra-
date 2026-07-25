'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Logo } from '@/components/ui';
import { useOnboarding } from '@/lib/relationship/context';
import { isSupabaseConfigured } from '@/lib/auth';
import type { Invite } from '@/lib/relationship';

type Step = 'name' | 'choose' | 'details' | 'join' | 'invite';


export default function OnboardingPage() {
  const router = useRouter();
  const { createSpace, joinSpace, createInvite, finish, devSimulatePartnerJoined, relationship } =
    useOnboarding();

  const [step, setStep] = useState<Step>('name');
  const [yourName, setYourName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [invite, setInvite] = useState<Invite | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const linked = relationship?.status === 'linked';

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const start = startDate ? new Date(startDate).getTime() : null;
      await createSpace({ yourName, partnerName, startDate: start });
      setInvite(await createInvite());
      setStep('invite');
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await joinSpace({ yourName, encoded: joinCode.trim() });
      setStep('invite');
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleFinish() {
    if (busy) return;
    setBusy(true);
    await finish();
    router.replace('/today');
  }

  async function copyLink() {
    if (!invite) return;
    const link = `${window.location.origin}/onboarding?invite=${invite.encoded}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable; the code is shown regardless */
    }
  }

  return (
    <section aria-labelledby="onb-heading" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo />
        {step !== 'invite' && <StepDots step={step} />}
      </div>

      {step === 'name' && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (yourName.trim()) setStep('choose');
          }}
        >
          <h1 id="onb-heading" className="text-display text-center">
            Let&apos;s set up your space
          </h1>
          <p className="text-text-soft text-center">
            Aveyra is a private home for the two of you. First — what should we call you?
          </p>
          <Input
            label="Your name"
            value={yourName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setYourName(e.target.value)}
            placeholder="e.g. Alex"
            autoFocus
            required
          />
          <Button type="submit" fullWidth disabled={yourName.trim() === ''}>
            Continue
          </Button>
        </form>
      )}

      {step === 'choose' && (
        <div className="flex flex-col gap-4">
          <h1 id="onb-heading" className="text-display text-center">
            Are you starting, or joining?
          </h1>
          <p className="text-text-soft text-center">
            One of you creates your shared space; the other joins with an invite.
          </p>
          <Button fullWidth onClick={() => setStep('details')}>
            Start our space
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setStep('join')}>
            Join my partner
          </Button>
        </div>
      )}

      {step === 'details' && (
        <form className="flex flex-col gap-4" onSubmit={handleCreate}>
          <h1 id="onb-heading" className="text-display text-center">
            A few gentle details
          </h1>
          <p className="text-text-soft text-center">
            All optional — you can add these later in Settings.
          </p>
          <Input
            label="Your partner's name"
            value={partnerName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPartnerName(e.target.value)}
            placeholder="e.g. Sam"
          />
          <Input
            label="When did your story begin?"
            type="date"
            value={startDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
            hint="Used to mark anniversaries — never a countdown or a score."
          />
          {error && <p className="text-label text-error text-center">{error}</p>}
          <Button type="submit" fullWidth disabled={busy}>
            {busy ? 'Creating your space…' : 'Create our space'}
          </Button>
        </form>
      )}

      {step === 'join' && (
        <form className="flex flex-col gap-4" onSubmit={handleJoin}>
          <h1 id="onb-heading" className="text-display text-center">
            Join your partner&apos;s space
          </h1>
          <p className="text-text-soft text-center">
            Paste the invite link or enter the code they shared with you.
          </p>
          <Input
            label="Invite link or code"
            value={joinCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setJoinCode(e.target.value)}
            placeholder="Paste link or code"
            autoFocus
            required
            error={error ?? undefined}
          />
          <Button type="submit" fullWidth disabled={busy || joinCode.trim() === ''}>
            {busy ? 'Connecting…' : 'Continue'}
          </Button>
          <Button variant="quiet" size="sm" onClick={() => setStep('choose')} type="button">
            Back
          </Button>
        </form>
      )}

      {step === 'invite' && (
        <div className="flex flex-col gap-5">
          <h1 id="onb-heading" className="text-display text-center">
            {linked ? "You're connected" : 'Invite your partner'}
          </h1>

          {invite && !linked && (
            <Card className="flex flex-col items-center gap-3 text-center">
              <p className="text-text-soft text-label">Share this code with your partner:</p>
              <p className="text-display tracking-[0.3em]" data-testid="invite-code">
                {invite.code}
              </p>
              <Button variant="secondary" size="sm" onClick={copyLink}>
                {copied ? 'Link copied ✓' : 'Copy invite link'}
              </Button>
            </Card>
          )}

          <p className="text-text-soft text-center" role="status" aria-live="polite">
            {linked
              ? 'Your partner has joined. Everything you keep here is just for the two of you.'
              : "Once they join on their device, you'll be connected. You can start now — your partner will catch up when they join."}
          </p>

          {!isSupabaseConfigured() && !linked && (
            <Card className="text-center">
              <p className="text-label text-text-mute">
                No backend yet — simulate your partner joining to preview the connected state.
              </p>
              <Button
                variant="quiet"
                size="sm"
                className="mt-2"
                onClick={devSimulatePartnerJoined}
              >
                Simulate partner joined
              </Button>
            </Card>
          )}

          <Button fullWidth onClick={handleFinish} disabled={busy}>
            {busy ? 'Taking you in…' : 'Continue to Aveyra'}
          </Button>
        </div>
      )}
    </section>
  );
}

function StepDots({ step }: { step: Step }) {
  const index = step === 'name' ? 0 : step === 'choose' ? 1 : 2;
  const total = 3;
  return (
    <p className="text-label text-text-mute" aria-label={`Step ${index + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (i <= index ? '●' : '○')).join(' ')}
    </p>
  );
}

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong. Please try again.';
}
