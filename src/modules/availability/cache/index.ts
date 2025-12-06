import Redis from "ioredis";
import { InMemoryAvailabilityCache } from "./memoryCache.js";
import { RedisAvailabilityCache, type RedisCacheOptions } from "./redisCache.js";
import type { AvailabilityCache } from "./types.js";

// Default cache instance (in-memory). Swap for Redis in real deployment.
export const availabilityCache: AvailabilityCache = new InMemoryAvailabilityCache();

export function createRedisAvailabilityCache(client: Redis, options?: RedisCacheOptions): AvailabilityCache {
  return new RedisAvailabilityCache(client, options);
}

export * from "./types.js";
export * from "./metrics.js";
