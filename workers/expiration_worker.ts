import { ReservationsStore } from "../src/server/reservationsStore.js";
import { availabilityCache } from "../src/modules/availability/cache/index.js";

type EventPublisher = (event: { type: string; payload: unknown }) => Promise<void> | void;

export type ExpirationWorkerDeps = {
  store?: ReservationsStore;
  cache?: typeof availabilityCache;
  publish?: EventPublisher;
};

export function createExpirationWorker(deps: ExpirationWorkerDeps = {}) {
  const store = deps.store ?? new ReservationsStore();
  const cache = deps.cache ?? availabilityCache;
  const publish: EventPublisher = deps.publish ?? (() => {});

  async function runOnce() {
    const expired = store.expireAndCollect();
    for (const resv of expired) {
      const dateKey = resv.startAt.toISOString().slice(0, 10);
      await cache.invalidate({ unitId: resv.unitId, serviceId: resv.serviceId, date: dateKey });
      await publish({
        type: "ReservationExpired",
        payload: {
          token: resv.token,
          unitId: resv.unitId,
          serviceId: resv.serviceId,
          startAt: resv.startAt,
          endAt: resv.endAt,
        },
      });
    }
    return expired.length;
  }

  return { runOnce };
}

// Executável simples: node workers/expiration_worker.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  const worker = createExpirationWorker();
  const intervalMs = Number(process.env.EXPIRATION_INTERVAL_MS ?? 60_000);
  // eslint-disable-next-line no-console
  console.log(`Starting expiration worker every ${intervalMs} ms`);
  setInterval(() => {
    worker.runOnce().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("expiration_worker_error", err);
    });
  }, intervalMs);
}
