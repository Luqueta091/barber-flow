import { describe, expect, it } from "vitest";
import { createApp } from "../src/server/app";
import request from "supertest";
import { queueLength, drainQueue } from "../workers/notifications/worker";

const app = createApp();

describe("Notifications worker subscription", () => {
  it("enfileira Reminder ao criar appointment", async () => {
    const lock = await request(app).post("/slots/lock").send({
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T09:00:00Z"),
      endAt: new Date("2024-01-01T09:30:00Z"),
    });
    const token = lock.body.reservationToken;

    await request(app).post("/appointments").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T09:00:00Z"),
      endAt: new Date("2024-01-01T09:30:00Z"),
      reservationToken: token,
    });

    expect(queueLength()).toBeGreaterThan(0);

    let processed = 0;
    drainQueue((_job) => {
      processed += 1;
    });
    expect(processed).toBeGreaterThan(0);
  });
});
