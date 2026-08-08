import { describe, it, expect, beforeEach } from 'vitest';
import { AveyraDB, __setDB } from '@/lib/database/db';
import { DatabaseService } from '@/lib/database/service';
import { getTodayCheckIns, submitCheckIn, todayKey, MOOD_LABELS } from '@/lib/checkins';
import { MOODS } from '@/lib/database/types';

let service: DatabaseService;
const REL = 'rel_1';

beforeEach(() => {
  const db = new AveyraDB('aveyra-checkins-' + crypto.randomUUID());
  __setDB(db);
  service = new DatabaseService(db);
});

describe('daily check-in', () => {
  it('starts with nothing from either person', async () => {
    const { mine, partner } = await getTodayCheckIns(REL, service);
    expect(mine).toBeNull();
    expect(partner).toBeNull();
  });

  it('records my feeling and optional note for today', async () => {
    await submitCheckIn(REL, 'grateful', '  slept well  ', service);
    const { mine } = await getTodayCheckIns(REL, service);
    expect(mine!.mood).toBe('grateful');
    expect(mine!.note).toBe('slept well');
    expect(mine!.date_key).toBe(todayKey());
  });

  it('re-submitting the same day edits rather than adding a second check-in', async () => {
    await submitCheckIn(REL, 'tired', 'long shift', service);
    await submitCheckIn(REL, 'calm', 'better now', service);

    const { mine } = await getTodayCheckIns(REL, service);
    expect(mine!.mood).toBe('calm');
    expect(mine!.note).toBe('better now');

    const all = await service.listLive('checkIns');
    expect(all).toHaveLength(1);
  });

  it('a note is optional', async () => {
    await submitCheckIn(REL, 'happy', '', service);
    const { mine } = await getTodayCheckIns(REL, service);
    expect(mine!.note).toBe('');
  });

  it('every mood has a label — nothing renders as a bare enum', () => {
    for (const mood of MOODS) {
      expect(MOOD_LABELS[mood].label).toBeTruthy();
      expect(MOOD_LABELS[mood].emoji).toBeTruthy();
    }
  });

  it('carries no score, streak, or count anywhere in the record', async () => {
    await submitCheckIn(REL, 'calm', 'fine', service);
    const { mine } = await getTodayCheckIns(REL, service);
    const keys = Object.keys(mine!);
    expect(keys).not.toContain('score');
    expect(keys).not.toContain('streak');
    expect(keys).not.toContain('points');
  });
});
