import '../../global.css';

import { I18nProvider, useI18n } from '@/lib/i18n';
import { ListingsProvider } from '@/lib/listings';
import { NAV_THEME } from '@/lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <ListingsProvider>
          <AppShell />
        </ListingsProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { colorScheme } = useColorScheme();
  const { isRTL } = useI18n();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeProvider value={NAV_THEME[scheme]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {/* Flips layout for Arabic / Kurdish without needing an app restart. */}
      <View className="bg-background flex-1" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="add" options={{ presentation: 'modal' }} />
        </Stack>
        <PortalHost />
      </View>
    </ThemeProvider>
  );
}
