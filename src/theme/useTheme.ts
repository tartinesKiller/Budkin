import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useAppStore } from '@/store/useAppStore';
import { makeTheme, resolveThemeMode, type Theme } from '@/theme/tokens';

/** Resolve the active theme from the global theme mode (default: Night); 'system'
 *  follows the phone's light/dark setting and re-renders when it changes. */
export function useTheme(): Theme {
  const mode = useAppStore((s) => s.themeMode);
  const systemScheme = useColorScheme();
  return useMemo(() => makeTheme(resolveThemeMode(mode, systemScheme)), [mode, systemScheme]);
}
