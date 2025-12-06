# AVA-003 – Cache layer e estratégia de TTL

Camada de cache para disponibilidade:
- Wrapper para Redis (`RedisAvailabilityCache`) com TTL configurável.
- Cache em memória para dev/test (`InMemoryAvailabilityCache`).
- Métricas de hit/miss via `prom-client` (`availability_cache_requests_total`).
- Invalidação ao publicar reservas (hook nos controllers de slots).

## Uso (Redis)
```ts
import Redis from "ioredis";
import { createRedisAvailabilityCache, getCacheRegistry } from "./src/modules/availability/cache";

const redis = new Redis(process.env.REDIS_URL!);
const cache = createRedisAvailabilityCache(redis, { ttlSeconds: 300, prefix: "availability" });

// set
await cache.set({ unitId, serviceId, date }, { slots, generatedAt: new Date().toISOString() });

// get
const cached = await cache.get({ unitId, serviceId, date });

// invalidate (ex: ao publicar reserva)
await cache.invalidate({ unitId, serviceId, date });

// métricas
app.get("/metrics", async (_req, res) => {
  const registry = getCacheRegistry();
  res.setHeader("Content-Type", registry.contentType);
  res.send(await registry.metrics());
});
```

## Estratégia de TTL
- TTL default 300s (configurável por `ttlSeconds`).
- Keys: `${prefix}:${unitId}:${serviceId}:${date}`.
- Invalidação por key ou por unidade (`invalidateUnit`).

## Métricas
- `availability_cache_requests_total{status="hit|miss"}` incrementa em cada `get`.
- Registry exposto via `getCacheRegistry()` para scraping Prometheus.

## Integração com reservas
- Em `src/server/controllers/slots.ts`, após `lock`, a cache de disponibilidade do dia é invalidada (`availabilityCache.invalidate`), garantindo fresh data após locks.

## Testes
- `npm test` roda Vitest, incluindo:
  - `src/modules/availability/cache/cache.test.ts` (usa `ioredis-mock` para simular Redis e validar TTL/hit/miss/invalidação).
