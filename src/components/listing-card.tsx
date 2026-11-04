import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/lib/i18n';
import { formatDate, formatPrice, listingName, type Listing } from '@/lib/listings';
import { Image } from 'expo-image';
import { CalendarDays, CarFront, MapPin, Palette, Phone } from 'lucide-react-native';
import * as React from 'react';
import { Linking, Pressable, View } from 'react-native';

export const ListingCard = React.memo(function ListingCard({ listing }: { listing: Listing }) {
  const { t, locale } = useI18n();
  const name = listingName(listing) ?? t.untitled;
  const photo = listing.photos?.[0];
  const [mountedAt] = React.useState(Date.now);
  const isNew = mountedAt - listing.createdAt < 60 * 60 * 1000;
  const subtitle = [listing.year, listing.title ? [listing.brand, listing.model].filter(Boolean).join(' ') : undefined]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <View className="bg-muted aspect-[16/10] w-full items-center justify-center">
        {photo ? (
          <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={200} />
        ) : (
          <Icon as={CarFront} size={56} className="text-muted-foreground/40" />
        )}
        {listing.photos && listing.photos.length > 1 ? (
          <View className="absolute bottom-2 end-2 rounded-full bg-black/60 px-2 py-0.5">
            <Text className="text-xs font-medium text-white">1/{listing.photos.length}</Text>
          </View>
        ) : null}
        {isNew ? (
          <Badge className="absolute start-3 top-3">
            <Text>{t.justNow}</Text>
          </Badge>
        ) : null}
      </View>

      <View className="gap-3 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-0.5">
            <Text className="text-start text-lg font-semibold leading-6" numberOfLines={1}>
              {name}
            </Text>
            {subtitle ? (
              <Text className="text-muted-foreground text-start text-sm" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View className="items-end">
            {listing.pricePerDay != null ? (
              <>
                <Text className="text-primary text-lg font-bold leading-6">
                  {formatPrice(listing.pricePerDay, listing.currency, locale)}
                </Text>
                <Text className="text-muted-foreground text-xs">{t.perDay}</Text>
              </>
            ) : (
              <Text className="text-muted-foreground text-sm">{t.priceOnRequest}</Text>
            )}
          </View>
        </View>

        <View className="flex-row flex-wrap gap-x-4 gap-y-2">
          {listing.location ? <Meta icon={MapPin} label={listing.location} /> : null}
          {listing.color ? <Meta icon={Palette} label={listing.color} /> : null}
          {listing.availableFrom || listing.availableTo ? (
            <Meta
              icon={CalendarDays}
              label={[
                listing.availableFrom ? `${t.from} ${formatDate(listing.availableFrom, locale)}` : null,
                listing.availableTo ? `${t.to} ${formatDate(listing.availableTo, locale)}` : null,
              ]
                .filter(Boolean)
                .join(' ')}
            />
          ) : null}
        </View>

        {listing.description ? (
          <Text className="text-muted-foreground text-start text-sm leading-5" numberOfLines={2}>
            {listing.description}
          </Text>
        ) : null}

        {listing.phone ? (
          <Pressable
            onPress={() => Linking.openURL(`tel:${listing.phone}`)}
            className="bg-secondary active:bg-accent flex-row items-center justify-center gap-2 rounded-md py-2.5"
          >
            <Icon as={Phone} size={16} className="text-primary" />
            <Text className="text-primary text-sm font-semibold">
              {t.call} · <Text className="text-primary text-sm font-semibold" style={{ writingDirection: 'ltr' }}>{listing.phone}</Text>
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
});

function Meta({ icon, label }: { icon: React.ComponentProps<typeof Icon>['as']; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <Icon as={icon} size={14} className="text-muted-foreground" />
      <Text className="text-muted-foreground text-sm">{label}</Text>
    </View>
  );
}
