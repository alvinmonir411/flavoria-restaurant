import { revalidatePath, revalidateTag } from 'next/cache';
import { after } from 'next/server';

export const CACHE_TAGS = {
  menu: 'db:menu',
  reservations: 'db:reservations',
  tables: 'db:tables',
  orders: 'db:orders',
  inventory: 'db:inventory',
  waitlist: 'db:waitlist',
  staff: 'db:staff',
  guests: 'db:guests',
  promo: 'db:promo',
  giftCards: 'db:gift-cards',
  drivers: 'db:drivers',
  zones: 'db:delivery-zones',
  recipes: 'db:recipes',
  suppliers: 'db:suppliers',
  purchaseOrders: 'db:purchase-orders',
  expenses: 'db:expenses',
  reviews: 'db:reviews',
  auditLogs: 'db:audit-logs',
  tableCalls: 'db:table-calls',
  settings: 'db:settings',
  all: 'db:all',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const STOREFRONT_PATHS = ['/', '/menu', '/order', '/reservation'] as const;

interface InvalidateCacheOptions {
  tags: readonly string[];
  paths?: readonly string[];
  rewarm?: () => Promise<unknown>;
}

/**
 * Purges matching Next.js Data Cache tags and routes immediately (`expire: 0`),
 * then schedules background re-warming via `after()` so the fresh DB state
 * is immediately re-cached.
 */
export function invalidateCache({ tags, paths = [], rewarm }: InvalidateCacheOptions): void {
  const uniqueTags = Array.from(new Set(tags));
  for (const tag of uniqueTags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Ignore outside Next.js request context (e.g. CLI verification scripts)
    }
  }

  const uniquePaths = Array.from(new Set(paths));
  for (const path of uniquePaths) {
    try {
      revalidatePath(path);
    } catch {
      // Ignore outside Next.js request context
    }
  }

  if (rewarm) {
    try {
      after(async () => {
        try {
          await rewarm();
        } catch {
          // Swallow background rewarm errors so the mutation response is unaffected
        }
      });
    } catch {
      // Ignore when called outside Next.js request lifecycle
    }
  }
}

/**
 * Purges every entity tag and storefront path and optionally re-warms immediately.
 */
export async function purgeAndRewarmAll(rewarmers: Array<() => Promise<unknown>>): Promise<void> {
  const allTags = Object.values(CACHE_TAGS);
  invalidateCache({ tags: allTags, paths: [...STOREFRONT_PATHS, '/about', '/contact'] });

  await Promise.allSettled(rewarmers.map((fn) => fn()));
}
