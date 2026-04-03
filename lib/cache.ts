interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
  ttl: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): { data: T; fetchedAt: number } | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > entry.ttl) return null;
  return { data: entry.data, fetchedAt: entry.fetchedAt };
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, fetchedAt: Date.now(), ttl: ttlMs });
}

export function getCacheStale<T>(key: string): { data: T; fetchedAt: number } | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  return { data: entry.data, fetchedAt: entry.fetchedAt };
}
