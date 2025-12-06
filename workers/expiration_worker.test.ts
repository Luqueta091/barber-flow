import { describe, expect, it, vi } from "vitest";
import { createExpirationWorker } from "./expiration_worker";
import { ReservationsStore } from "../src/server/reservationsStore";
import { InMemoryAvailabilityCache } from "../src/modules/availability/cache/memoryCache";

describe("expiration worker", () => {
  it("limpa reservas expiradas, invalida cache e publica evento", async () => {
    vi.useFakeTimers();
    const store = new ReservationsStore();
    const cache = new InMemoryAvailabilityCache();
    const published: any[] = [];
    const worker = createExpirationWorker({
      store,
      cache,
      publish: (event) => {
        published.push(event);
      },
    });

    // cria lock com ttl 1s
    const resv = store.lock({
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T10:00:00Z"),
      endAt: new Date("2024-01-01T10:30:00Z"),
      ttlSeconds: 1,
    });

    // adiciona cache para validar invalidação
    await cache.set({ unitId: "u1", serviceId: "s1", date: "2024-01-01" }, {
      slots: [{ start: resv.startAt.toISOString(), end: resv.endAt.toISOString() }],
      generatedAt: new Date().toISOString(),
    });

    vi.advanceTimersByTime(1500);

    const cleaned = await worker.runOnce();
    expect(cleaned).toBe(1);
    expect(published).toHaveLength(1);
    expect(published[0].type).toBe("ReservationExpired");

    const after = await cache.get({ unitId: "u1", serviceId: "s1", date: "2024-01-01" });
    expect(after).toBeNull();
    vi.useRealTimers();
  });
});
