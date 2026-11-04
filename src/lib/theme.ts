import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';

export const THEME = {
  light: {
    background: 'hsl(0 0% 98%)',
    foreground: 'hsl(222 47% 11%)',
    card: 'hsl(0 0% 100%)',
    primary: 'hsl(221 83% 53%)',
    primaryForeground: 'hsl(0 0% 100%)',
    mutedForeground: 'hsl(220 9% 46%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    border: 'hsl(220 13% 91%)',
  },
  dark: {
    background: 'hsl(222 47% 6%)',
    foreground: 'hsl(210 40% 98%)',
    card: 'hsl(222 40% 10%)',
    primary: 'hsl(217 91% 60%)',
    primaryForeground: 'hsl(0 0% 100%)',
    mutedForeground: 'hsl(215 20% 65%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(217 33% 18%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
