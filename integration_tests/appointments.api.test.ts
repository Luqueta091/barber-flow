import request from "supertest";
import { describe, expect, it, beforeEach } from "vitest";
import { createApp } from "../src/server/app";
import { reservationsStore, appointmentStore } from "../src/server/store";

const app = createApp();

describe("POST /appointments", () => {
  beforeEach(() => {
    // reset stores
    (reservationsStore as any).reservations?.clear?.();
    appointmentStore.clear();
  });

  it("cria appointment a partir de uma reserva válida", async () => {
    const lock = await request(app).post("/slots/lock").send({
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T10:00:00Z"),
      endAt: new Date("2024-01-01T10:30:00Z"),
    });
    expect(lock.status).toBe(200);
    const token = lock.body.reservationToken;

    const appt = await request(app).post("/appointments").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T10:00:00Z"),
      endAt: new Date("2024-01-01T10:30:00Z"),
      reservationToken: token,
    });

    expect(appt.status).toBe(201);
    expect(appt.body.status).toBe("scheduled");
  });

  it("retorna 409 se reserva for inválida ou mismatch", async () => {
    const appt = await request(app).post("/appointments").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T10:00:00Z"),
      endAt: new Date("2024-01-01T10:30:00Z"),
      reservationToken: "00000000-0000-0000-0000-000000000000",
    });
    expect(appt.status).toBe(409);
  });

  it("não permite reutilizar token já confirmado", async () => {
    const lock = await request(app).post("/slots/lock").send({
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T11:00:00Z"),
      endAt: new Date("2024-01-01T11:30:00Z"),
    });
    const token = lock.body.reservationToken;

    const first = await request(app).post("/appointments").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T11:00:00Z"),
      endAt: new Date("2024-01-01T11:30:00Z"),
      reservationToken: token,
    });
    expect(first.status).toBe(201);

    const second = await request(app).post("/appointments").send({
      userId: "user-2",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T11:00:00Z"),
      endAt: new Date("2024-01-01T11:30:00Z"),
      reservationToken: token,
    });
    expect(second.status).toBe(409);
  });

  it("responde idempotente com idempotencyKey", async () => {
    const lock = await request(app).post("/slots/lock").send({
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T12:00:00Z"),
      endAt: new Date("2024-01-01T12:30:00Z"),
    });
    const token = lock.body.reservationToken;
    const key = "00000000-0000-0000-0000-000000000999";

    const first = await request(app).post("/appointments").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T12:00:00Z"),
      endAt: new Date("2024-01-01T12:30:00Z"),
      reservationToken: token,
      idempotencyKey: key,
    });
    expect(first.status).toBe(201);

    const second = await request(app).post("/appointments").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T12:00:00Z"),
      endAt: new Date("2024-01-01T12:30:00Z"),
      reservationToken: token,
      idempotencyKey: key,
    });

    expect(second.status).toBe(200);
    expect(second.body.id).toBe(first.body.id);
  });
});
