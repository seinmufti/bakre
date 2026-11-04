import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/lib/i18n';
import { formatDate } from '@/lib/listings';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CalendarDays, X } from 'lucide-react-native';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

function toIso(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type Props = { value?: string; onChange: (iso?: string) => void; minimumDate?: string };

/** Optional date input: native picker on iOS/Android, plain text (YYYY-MM-DD) on web. */
export function DateField({ value, onChange, minimumDate }: Props) {
  const { t, locale } = useI18n();
  const [iosOpen, setIosOpen] = React.useState(false);
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  const min = minimumDate ? new Date(`${minimumDate}T00:00:00`) : undefined;

  if (Platform.OS === 'web') {
    return (
      <Input
        value={value ?? ''}
        onChangeText={(s) => onChange(s.trim() || undefined)}
        placeholder="YYYY-MM-DD"
        className="text-start"
      />
    );
  }

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        minimumDate: min,
        onChange: (e, d) => {
          if (e.type === 'set' && d) onChange(toIso(d));
        },
      });
    } else {
      setIosOpen((o) => !o);
    }
  };

  return (
    <View className="gap-2">
      <Pressable
        onPress={open}
        className="border-input bg-background dark:bg-input/30 h-10 flex-row items-center gap-2 rounded-md border px-3"
      >
        <Icon as={CalendarDays} size={16} className="text-muted-foreground" />
        <Text className={value ? 'flex-1 text-start' : 'text-muted-foreground/60 flex-1 text-start'}>
          {value ? formatDate(value, locale) : t.pickDate}
        </Text>
        {value ? (
          <Pressable hitSlop={10} accessibilityLabel={t.clear} onPress={() => onChange(undefined)}>
            <Icon as={X} size={16} className="text-muted-foreground" />
          </Pressable>
        ) : null}
      </Pressable>
      {Platform.OS === 'ios' && iosOpen ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="inline"
          minimumDate={min}
          onChange={(_, d) => {
            if (d) onChange(toIso(d));
            setIosOpen(false);
          }}
        />
      ) : null}
    </View>
  );
}
