import { describe, it, expect } from 'vitest';
import { verseForDate, textOf, VERSES, TRANSLATION_NAMES } from '@/lib/scripture';

const REL = 'rel_1';

describe('scripture rotation', () => {
  it('gives both devices the same verse for the same day', () => {
    const day = new Date('2026-08-08T09:00:00Z');
    expect(verseForDate(REL, day).ref).toBe(verseForDate(REL, day).ref);
  });

  it('is stable across repeated reads on the same day', () => {
    const day = new Date('2026-08-08T23:00:00Z');
    const refs = Array.from({ length: 5 }, () => verseForDate(REL, day).ref);
    expect(new Set(refs).size).toBe(1);
  });

  it('moves on the next day', () => {
    const a = verseForDate(REL, new Date('2026-08-08T12:00:00Z')).ref;
    const b = verseForDate(REL, new Date('2026-08-09T12:00:00Z')).ref;
    expect(a).not.toBe(b);
  });

  it('gives different couples different sequences', () => {
    const day = new Date('2026-08-08T12:00:00Z');
    const mine = Array.from({ length: 8 }, (_, i) =>
      verseForDate('rel_a', new Date(day.getTime() + i * 86_400_000)).ref,
    );
    const theirs = Array.from({ length: 8 }, (_, i) =>
      verseForDate('rel_b', new Date(day.getTime() + i * 86_400_000)).ref,
    );
    expect(mine).not.toEqual(theirs);
  });

  it('works through a full cycle without repeating early', () => {
    const start = new Date('2026-01-01T12:00:00Z');
    const seen = Array.from({ length: VERSES.length }, (_, i) =>
      verseForDate(REL, new Date(start.getTime() + i * 86_400_000)).ref,
    );
    expect(new Set(seen).size).toBe(VERSES.length);
  });
});

describe('verse data', () => {
  it('every verse has a reference and both translations', () => {
    for (const v of VERSES) {
      expect(v.ref).toBeTruthy();
      expect(v.kjv.trim()).toBeTruthy();
      expect(v.web.trim()).toBeTruthy();
    }
  });

  it('references are unique — the rotation sequences over them', () => {
    const refs = VERSES.map((v) => v.ref);
    expect(new Set(refs).size).toBe(refs.length);
  });

  it('selects the requested translation', () => {
    const v = VERSES.find((x) => x.ref === '1 Corinthians 13:4')!;
    expect(textOf(v, 'kjv')).toMatch(/Charity/);
    expect(textOf(v, 'web')).toMatch(/Love is patient/);
  });

  it('only bundles public-domain translations', () => {
    expect(Object.keys(TRANSLATION_NAMES).sort()).toEqual(['kjv', 'web']);
  });

  it('stays small enough to bundle — a full Bible would not', () => {
    const bytes = JSON.stringify(VERSES).length;
    expect(bytes).toBeLessThan(200_000);
  });
});
