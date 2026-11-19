import { describe, expect, it } from 'vitest';

import { isThemeMode, makeTheme, resolveThemeMode } from '@/theme/tokens';

describe('isThemeMode', () => {
  it('accepts the three modes', () => {
    expect(isThemeMode('system')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('light')).toBe(true);
  });

  it('rejects anything else, so a corrupted stored pref cannot flow through', () => {
    expect(isThemeMode('blue')).toBe(false);
    expect(isThemeMode('')).toBe(false);
    expect(isThemeMode(undefined)).toBe(false);
    expect(isThemeMode(null)).toBe(false);
  });
});

describe('resolveThemeMode', () => {
  it('passes explicit modes through untouched', () => {
    expect(resolveThemeMode('dark', 'light')).toBe('dark');
    expect(resolveThemeMode('light', 'dark')).toBe('light');
  });

  it("'system' follows the phone's scheme", () => {
    expect(resolveThemeMode('system', 'light')).toBe('light');
    expect(resolveThemeMode('system', 'dark')).toBe('dark');
  });

  it("'system' falls back to Night when the OS scheme is unknown", () => {
    expect(resolveThemeMode('system', null)).toBe('dark');
    expect(resolveThemeMode('system', undefined)).toBe('dark');
  });
});

describe('makeTheme', () => {
  it('marks the resolved mode and palette on the theme', () => {
    expect(makeTheme('dark').dark).toBe(true);
    expect(makeTheme('dark').mode).toBe('dark');
    expect(makeTheme('light').dark).toBe(false);
    expect(makeTheme('light').mode).toBe('light');
  });
});
