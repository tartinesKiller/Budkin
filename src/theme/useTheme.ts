import { useEffect, useMemo, useState } from 'react';
import { Appearance, AppState, useColorScheme } from 'react-native';

import { useAppStore } from '@/store/useAppStore';
import { makeTheme, resolveThemeMode, type Theme } from '@/theme/tokens';

/** Resolve the active theme from the global theme mode (default: Night); 'system'
 *  follows the phone's light/dark setting and re-renders when it changes.
 *
 *  `useColorScheme` only refreshes while the app is in the foreground: if the phone's
 *  theme changes while Budkin is backgrounded (e.g. the app is then opened from the
 *  widget), the hook keeps the stale value until a kill/relaunch. So on every return
 *  to the foreground we bump a counter and read `Appearance.getColorScheme()` directly
 *  during render, which always holds the current value. */
export function useTheme(): Theme {
  const mode = useAppStore((s) => s.themeMode);
  const hookScheme = useColorScheme();
  const [, bump] = useState(0);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') bump((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  const systemScheme = Appearance.getColorScheme() ?? hookScheme;
  return useMemo(() => makeTheme(resolveThemeMode(mode, systemScheme)), [mode, systemScheme]);
}
