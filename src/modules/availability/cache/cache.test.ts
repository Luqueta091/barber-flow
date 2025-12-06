import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RedisMock from "ioredis-mock";
import { createRedisAvailabilityCache, getCacheRegistry, availabilityCache } from "./index.js";

const sampleKey = { unitId: "u1", serviceId: "s1", date: "2024-01-01" };
const sampleValue = {
  slots: [
    { start: "2024-01-01T10:00:00Z", end: "2024-01-01T10:30:00Z" },
  ],
  generatedAt: "2024-01-01T09:00:00Z",
};

describe("RedisAvailabilityCache", () => {
  const redis = new RedisMock();
  const cache = createRedisAvailabilityCache(redis, { ttlSeconds: 1 });

  afterEach(async () => {
    await redis.flushall();
  });

  it("registra hit/miss e retorna payload", async () => {
    const registry = getCacheRegistry();
    await cache.set(sampleKey, sampleValue);

    const hit = await cache.get(sampleKey);
    expect(hit?.slots.length).toBe(1);

    await cache.invalidate(sampleKey);
    const miss = await cache.get(sampleKey);
    expect(miss).toBeNull();

    const metrics = await registry.metrics();
    expect(metrics).toContain('availability_cache_requests_total{status="hit"} 1');
    expect(metrics).toContain('availability_cache_requests_total{status="miss"} 1');
  });

  it("expira chave após TTL", async () => {
    vi.useFakeTimers();
    await cache.set(sampleKey, sampleValue);
    vi.advanceTimersByTime(1500);
    const val = await cache.get(sampleKey);
    expect(val).toBeNull();
    vi.useRealTimers();
  });
});

describe("InMemoryAvailabilityCache (default export)", () => {
  beforeEach(async () => {
    await availabilityCache.invalidateUnit("u1");
  });

  it("invalida por unidade", async () => {
    await availabilityCache.set(sampleKey, sampleValue);
    await availabilityCache.invalidateUnit("u1");
    const val = await availabilityCache.get(sampleKey);
    expect(val).toBeNull();
  });
});
