import { Counter, Registry, collectDefaultMetrics } from "prom-client";

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const cacheRequests = new Counter({
  name: "availability_cache_requests_total",
  help: "Cache requests labeled by hit|miss",
  labelNames: ["status"] as const,
  registers: [registry],
});

export function recordCacheResult(status: "hit" | "miss") {
  cacheRequests.labels(status).inc();
}

export function getCacheRegistry() {
  return registry;
}
