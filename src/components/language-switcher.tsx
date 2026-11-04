import { Text } from '@/components/ui/text';
import { LANGS, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <View accessibilityLabel={t.language} className="bg-secondary flex-row rounded-full p-1">
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <Pressable
            key={l.code}
            onPress={() => setLang(l.code)}
            accessibilityLabel={l.label}
            accessibilityState={{ selected: active }}
            className={cn('min-w-9 items-center rounded-full px-2.5 py-1', active && 'bg-background shadow-sm shadow-black/10')}
          >
            <Text className={cn('text-xs font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>
              {l.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
