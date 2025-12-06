import { AvailabilityCache, CacheKeyInput, CachedAvailability } from "./types.js";
import { recordCacheResult } from "./metrics.js";

type Entry = {
  value: CachedAvailability;
  expiresAt: number;
};

export class InMemoryAvailabilityCache implements AvailabilityCache {
  private store = new Map<string, Entry>();
  private ttlSeconds: number;
  private prefix: string;

  constructor(options: { ttlSeconds?: number; prefix?: string } = {}) {
    this.ttlSeconds = options.ttlSeconds ?? 300;
    this.prefix = options.prefix ?? "availability";
  }

  private buildKey(key: CacheKeyInput): string {
    return `${this.prefix}:${key.unitId}:${key.serviceId}:${key.date}`;
  }

  async get(key: CacheKeyInput): Promise<CachedAvailability | null> {
    this.cleanup();
    const entry = this.store.get(this.buildKey(key));
    if (!entry) {
      recordCacheResult("miss");
      return null;
    }
    recordCacheResult("hit");
    return entry.value;
  }

  async set(key: CacheKeyInput, value: CachedAvailability): Promise<void> {
    const expiresAt = Date.now() + this.ttlSeconds * 1000;
    this.store.set(this.buildKey(key), { value, expiresAt });
  }

  async invalidate(key: CacheKeyInput): Promise<void> {
    this.store.delete(this.buildKey(key));
  }

  async invalidateUnit(unitId: string): Promise<void> {
    for (const key of this.store.keys()) {
      if (key.startsWith(`${this.prefix}:${unitId}:`)) {
        this.store.delete(key);
      }
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }
}
