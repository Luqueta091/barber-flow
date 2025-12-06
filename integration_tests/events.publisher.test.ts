import { describe, expect, it } from "vitest";
import { createApp } from "../src/server/app";
import request from "supertest";
import { eventPublisher } from "../src/server/store";

const app = createApp();

describe("Event publishing on appointment create", () => {
  it("emite AppointmentCreated v1", async () => {
    // lock
    const lock = await request(app).post("/slots/lock").send({
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T10:00:00Z"),
      endAt: new Date("2024-01-01T10:30:00Z"),
    });
    const token = lock.body.reservationToken;

    await request(app).post("/appointments").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T10:00:00Z"),
      endAt: new Date("2024-01-01T10:30:00Z"),
      reservationToken: token,
    });

    const events = (eventPublisher as any).events ?? [];
    expect(events.length).toBeGreaterThan(0);
    const evt = events[events.length - 1];
    expect(evt.type).toBe("AppointmentCreated");
    expect(evt.version).toBe("v1");
    expect(evt.payload.appointmentId).toBeDefined();
  });
});
