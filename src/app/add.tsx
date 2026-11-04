import { DateField } from '@/components/date-field';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/lib/i18n';
import { CURRENCIES, useListings, type Currency, type NewListing } from '@/lib/listings';
import { pickPhotos } from '@/lib/photos';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ImagePlus, X } from 'lucide-react-native';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Form = {
  title: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  price: string;
  currency: Currency;
  location: string;
  availableFrom?: string;
  availableTo?: string;
  photos: string[];
  description: string;
  phone: string;
};

const EMPTY: Form = {
  title: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  price: '',
  currency: 'USD',
  location: '',
  photos: [],
  description: '',
  phone: '',
};

/** Converts the form to a listing, dropping anything left empty. */
function toListing(f: Form): NewListing {
  const str = (s: string) => s.trim() || undefined;
  const num = (s: string) => {
    const n = Number(s.replace(/[^\d.]/g, ''));
    return s.trim() && Number.isFinite(n) ? n : undefined;
  };
  const price = num(f.price);
  return {
    title: str(f.title),
    brand: str(f.brand),
    model: str(f.model),
    year: num(f.year),
    color: str(f.color),
    pricePerDay: price,
    currency: price != null ? f.currency : undefined,
    location: str(f.location),
    availableFrom: f.availableFrom,
    availableTo: f.availableTo,
    photos: f.photos.length ? f.photos : undefined,
    description: str(f.description),
    phone: str(f.phone),
  };
}

export default function AddListingScreen() {
  const { t } = useI18n();
  const { addListing } = useListings();
  const insets = useSafeAreaInsets();
  const [form, setForm] = React.useState<Form>(EMPTY);
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onAddPhotos = async () => {
    const uris = await pickPhotos();
    if (uris.length) setForm((f) => ({ ...f, photos: [...f.photos, ...uris].slice(0, 8) }));
  };

  const onSave = () => {
    addListing(toListing(form));
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="bg-background flex-1">
      <View
        className="border-border flex-row items-center justify-between border-b px-4 pb-3"
        style={{ paddingTop: Platform.OS === 'ios' ? 16 : insets.top + 12 }}
      >
        <Button variant="ghost" size="icon" onPress={() => router.back()} accessibilityLabel={t.cancel}>
          <Icon as={X} size={22} />
        </Button>
        <Text className="text-lg font-semibold">{t.newListing}</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 24 }}
      >
        <Text className="text-muted-foreground text-start text-sm">{t.allOptional}</Text>

        <Section title={t.sectionCar}>
          <Field label={t.title}>
            <Input value={form.title} onChangeText={(v) => set('title', v)} placeholder={t.titlePh} className="text-start" />
          </Field>
          <Row>
            <Field label={t.brand}>
              <Input value={form.brand} onChangeText={(v) => set('brand', v)} placeholder={t.brandPh} className="text-start" />
            </Field>
            <Field label={t.model}>
              <Input value={form.model} onChangeText={(v) => set('model', v)} placeholder={t.modelPh} className="text-start" />
            </Field>
          </Row>
          <Row>
            <Field label={t.year}>
              <Input
                value={form.year}
                onChangeText={(v) => set('year', v.replace(/\D/g, '').slice(0, 4))}
                placeholder={t.yearPh}
                keyboardType="number-pad"
                className="text-start"
              />
            </Field>
            <Field label={t.color}>
              <Input value={form.color} onChangeText={(v) => set('color', v)} placeholder={t.colorPh} className="text-start" />
            </Field>
          </Row>
        </Section>

        <Section title={t.sectionRental}>
          <Field label={t.price}>
            <View className="flex-row gap-2">
              <Input
                value={form.price}
                onChangeText={(v) => set('price', v.replace(/[^\d.]/g, ''))}
                placeholder={t.pricePh}
                keyboardType="decimal-pad"
                className="flex-1 text-start"
              />
              <View accessibilityLabel={t.currency} className="bg-secondary flex-row rounded-md p-1">
                {CURRENCIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => set('currency', c)}
                    className={cn('justify-center rounded px-3', form.currency === c && 'bg-background shadow-sm shadow-black/10')}
                  >
                    <Text className={cn('text-sm font-semibold', form.currency === c ? 'text-foreground' : 'text-muted-foreground')}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Field>
          <Field label={t.location}>
            <Input value={form.location} onChangeText={(v) => set('location', v)} placeholder={t.locationPh} className="text-start" />
          </Field>
          <Field label={t.availableFrom}>
            <DateField value={form.availableFrom} onChange={(v) => set('availableFrom', v)} />
          </Field>
          <Field label={t.availableTo}>
            <DateField value={form.availableTo} onChange={(v) => set('availableTo', v)} minimumDate={form.availableFrom} />
          </Field>
        </Section>

        <Section title={t.sectionPhotos}>
          <Field label={t.photos}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {form.photos.map((uri) => (
                <View key={uri} className="h-24 w-24 overflow-hidden rounded-lg">
                  <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  <Pressable
                    onPress={() => set('photos', form.photos.filter((p) => p !== uri))}
                    hitSlop={6}
                    className="absolute end-1 top-1 rounded-full bg-black/60 p-1"
                  >
                    <Icon as={X} size={12} className="text-white" />
                  </Pressable>
                </View>
              ))}
              {form.photos.length < 8 ? (
                <Pressable
                  onPress={onAddPhotos}
                  className="border-input active:bg-accent h-24 w-24 items-center justify-center gap-1 rounded-lg border border-dashed"
                >
                  <Icon as={ImagePlus} size={22} className="text-muted-foreground" />
                  <Text className="text-muted-foreground text-center text-xs">{t.addPhotos}</Text>
                </Pressable>
              ) : null}
            </ScrollView>
          </Field>
          <Field label={t.description}>
            <Textarea
              value={form.description}
              onChangeText={(v) => set('description', v)}
              placeholder={t.descriptionPh}
              className="text-start"
            />
          </Field>
          <Field label={t.phone}>
            <Input
              value={form.phone}
              onChangeText={(v) => set('phone', v)}
              placeholder={t.phonePh}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              className="text-start"
            />
          </Field>
        </Section>

        <Button size="lg" className="h-12 rounded-full" onPress={onSave}>
          <Text className="text-base font-semibold">{t.save}</Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-4">
      <Text className="text-start text-base font-semibold">{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View className="flex-row gap-3">{children}</View>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="flex-1 gap-1.5">
      <Label className="text-start">{label}</Label>
      {children}
    </View>
  );
}
