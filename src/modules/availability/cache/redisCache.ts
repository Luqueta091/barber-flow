import Redis from "ioredis";
import { recordCacheResult } from "./metrics.js";
import { AvailabilityCache, CacheKeyInput, CachedAvailability } from "./types.js";

export type RedisCacheOptions = {
  ttlSeconds?: number;
  prefix?: string;
};

export class RedisAvailabilityCache implements AvailabilityCache {
  private readonly ttlSeconds: number;
  private readonly prefix: string;

  constructor(private readonly client: Redis, options: RedisCacheOptions = {}) {
    this.ttlSeconds = options.ttlSeconds ?? 300;
    this.prefix = options.prefix ?? "availability";
  }

  private buildKey(key: CacheKeyInput): string {
    return `${this.prefix}:${key.unitId}:${key.serviceId}:${key.date}`;
  }

  async get(key: CacheKeyInput): Promise<CachedAvailability | null> {
    const raw = await this.client.get(this.buildKey(key));
    if (!raw) {
      recordCacheResult("miss");
      return null;
    }

    recordCacheResult("hit");
    return JSON.parse(raw) as CachedAvailability;
  }

  async set(key: CacheKeyInput, value: CachedAvailability): Promise<void> {
    await this.client.set(this.buildKey(key), JSON.stringify(value), "EX", this.ttlSeconds);
  }

  async invalidate(key: CacheKeyInput): Promise<void> {
    await this.client.del(this.buildKey(key));
  }

  async invalidateUnit(unitId: string): Promise<void> {
    const pattern = `${this.prefix}:${unitId}:*`;
    let cursor = "0";
    do {
      const [nextCursor, keys] = await this.client.scan(cursor, "MATCH", pattern, "COUNT", 50);
      cursor = nextCursor;
      if (keys.length) {
        await this.client.del(...keys);
      }
    } while (cursor !== "0");
  }
}
