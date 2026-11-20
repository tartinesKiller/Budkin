import { describe, expect, it } from 'vitest';

import { treatmentCooldownLabel, treatmentRangeInvalid, treatmentScheduleLabel } from '@/features/treatments/treatmentLabels';
import type { Treatment } from '@/types/models';

const treatment = (over: Partial<Treatment> = {}): Treatment => ({
  id: 'treatment-1',
  childId: 'c1',
  name: 'Paracetamol',
  scheduleMode: 'timesOfDay',
  timesOfDay: ['morning', 'evening'],
  fromDate: new Date(2026, 2, 1).getTime(),
  active: true,
  ...over,
});

describe('treatmentScheduleLabel', () => {
  it('reads "As needed" for a sporadic treatment, regardless of the cooldown hours', () => {
    expect(treatmentScheduleLabel(treatment({ scheduleMode: 'sporadic', everyHours: 6, timesOfDay: undefined }))).toBe('As needed');
    expect(treatmentScheduleLabel(treatment({ scheduleMode: 'sporadic', everyHours: undefined, timesOfDay: undefined }))).toBe('As needed');
  });
});

describe('treatmentCooldownLabel', () => {
  const NOW = new Date(2026, 2, 4, 12, 0, 0).getTime();
  const M = 60000;

  it('is empty when not in cooldown', () => {
    expect(treatmentCooldownLabel({ inCooldown: false, readyAt: null }, NOW)).toBe('');
  });

  it('formats the remaining time until ready, rounded up to the minute', () => {
    expect(treatmentCooldownLabel({ inCooldown: true, readyAt: NOW + 200 * M }, NOW)).toBe('Can give again in 3h20m');
    expect(treatmentCooldownLabel({ inCooldown: true, readyAt: NOW + 30 * 1000 }, NOW)).toBe('Can give again in 1m');
  });
});

describe('treatmentRangeInvalid', () => {
  const from = new Date(2026, 10, 20).getTime(); // 20/11/2026 local midnight

  it('is false when no end date is set (open-ended)', () => {
    expect(treatmentRangeInvalid(from, undefined)).toBe(false);
  });

  it('is false when the end date is on or after the start date', () => {
    expect(treatmentRangeInvalid(from, from)).toBe(false);
    expect(treatmentRangeInvalid(from, from + 92 * 86400000)).toBe(false); // ~3 months later
  });

  it('is true when the end date is before the start date (never active)', () => {
    // the reported case: From 20/11/2026, Until 20/2/2026
    expect(treatmentRangeInvalid(from, new Date(2026, 1, 20).getTime())).toBe(true);
  });
});
