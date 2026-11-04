import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';

export type Currency = 'USD' | 'IQD';
export const CURRENCIES: Currency[] = ['USD', 'IQD'];

/** Every field except id/createdAt is optional. */
export type Listing = {
  id: string;
  createdAt: number;
  title?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  pricePerDay?: number;
  currency?: Currency;
  location?: string;
  /** ISO date strings (YYYY-MM-DD). */
  availableFrom?: string;
  availableTo?: string;
  photos?: string[];
  description?: string;
  phone?: string;
};

export type NewListing = Omit<Listing, 'id' | 'createdAt'>;

const STORAGE_KEY = 'bakre.listings.v1';

const day = 24 * 60 * 60 * 1000;

const SEED: Listing[] = [
  {
    id: 'seed-1',
    createdAt: Date.now() - 1 * day,
    title: 'Porsche 911 Turbo S',
    brand: 'Porsche',
    model: '911',
    year: 2022,
    color: 'Silver',
    pricePerDay: 250,
    currency: 'USD',
    location: 'Erbil',
    photos: ['https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1200&q=80'],
    phone: '07501234567',
  },
  {
    id: 'seed-2',
    createdAt: Date.now() - 2 * day,
    brand: 'Hyundai',
    model: 'Elantra',
    year: 2021,
    color: 'Silver',
    pricePerDay: 45000,
    currency: 'IQD',
    location: 'Sulaymaniyah',
  },
  {
    id: 'seed-3',
    createdAt: Date.now() - 3 * day,
    title: 'Kia Sportage',
    brand: 'Kia',
    model: 'Sportage',
    year: 2023,
    pricePerDay: 70,
    currency: 'USD',
    location: 'Duhok',
  },
];

type ListingsCtx = {
  listings: Listing[];
  ready: boolean;
  addListing: (data: NewListing) => Listing;
};

const ListingsContext = React.createContext<ListingsCtx | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setListings(raw ? (JSON.parse(raw) as Listing[]) : SEED))
      .catch(() => setListings(SEED))
      .finally(() => setReady(true));
  }, []);

  React.useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listings)).catch(() => {});
  }, [listings, ready]);

  const addListing = React.useCallback((data: NewListing) => {
    const listing: Listing = {
      ...data,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    setListings((prev) => [listing, ...prev]);
    return listing;
  }, []);

  const value = React.useMemo(() => ({ listings, ready, addListing }), [listings, ready, addListing]);
  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const ctx = React.useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used inside ListingsProvider');
  return ctx;
}

/** Best display name for a listing, falling back through optional fields. */
export function listingName(l: Listing): string | undefined {
  return l.title?.trim() || [l.brand, l.model].filter(Boolean).join(' ').trim() || undefined;
}

export function formatPrice(amount: number, currency: Currency = 'USD', locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'IQD' ? 0 : 2,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

export function formatDate(iso: string, locale = 'en-US') {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}
