import { describe, expect, it } from "vitest";
import { InMemoryCounterService, type CounterWindow } from "./counterService";

const baseWindow: CounterWindow = {
  unitId: "u1",
  serviceId: "s1",
  windowStart: new Date("2024-01-01T10:00:00Z"),
  windowEnd: new Date("2024-01-01T10:30:00Z"),
  capacity: 2,
};

describe("InMemoryCounterService", () => {
  it("incrementa até a capacidade e bloqueia acima", async () => {
    const svc = new InMemoryCounterService();
    expect(await svc.increment(baseWindow)).toBe(true);
    expect(await svc.increment(baseWindow)).toBe(true);
    expect(await svc.increment(baseWindow)).toBe(false); // capacity reached
  });

  it("decrementa liberando espaço", async () => {
    const svc = new InMemoryCounterService();
    await svc.increment(baseWindow);
    await svc.increment(baseWindow);
    await svc.decrement(baseWindow);

    const usage = await svc.getUsage(baseWindow);
    expect(usage.used).toBe(1);
    expect(await svc.increment(baseWindow)).toBe(true); // should allow again
  });

  it("mantém contadores por janela isolados", async () => {
    const svc = new InMemoryCounterService();
    const window2: CounterWindow = { ...baseWindow, windowStart: new Date("2024-01-01T11:00:00Z"), windowEnd: new Date("2024-01-01T11:30:00Z") };

    await svc.increment(baseWindow);
    await svc.increment(window2);

    const usage1 = await svc.getUsage(baseWindow);
    const usage2 = await svc.getUsage(window2);

    expect(usage1.used).toBe(1);
    expect(usage2.used).toBe(1);
  });
});
