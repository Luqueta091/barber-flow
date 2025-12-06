import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/server/app";

const app = createApp();

describe("Reservations API", () => {
  it("cria lock e retorna token", async () => {
    const res = await request(app)
      .post("/slots/lock")
      .send({
        unitId: "u1",
        serviceId: "s1",
        startAt: new Date("2024-01-01T10:00:00Z"),
        endAt: new Date("2024-01-01T10:30:00Z"),
      });

    expect(res.status).toBe(200);
    expect(res.body.reservationToken).toBeDefined();
    expect(res.body.status).toBe("locked");
  });

  it("retorna 409 se houver conflito para o mesmo slot", async () => {
    const payload = {
      unitId: "u1",
      serviceId: "s1",
      startAt: new Date("2024-01-01T11:00:00Z"),
      endAt: new Date("2024-01-01T11:30:00Z"),
    };

    const first = await request(app).post("/slots/lock").send(payload);
    expect(first.status).toBe(200);

    const second = await request(app).post("/slots/lock").send(payload);
    expect(second.status).toBe(409);
  });

  it("permite liberar um slot via token", async () => {
    const lock = await request(app)
      .post("/slots/lock")
      .send({
        unitId: "u1",
        serviceId: "s2",
        startAt: new Date("2024-01-01T12:00:00Z"),
        endAt: new Date("2024-01-01T12:30:00Z"),
      });

    const token = lock.body.reservationToken;
    const release = await request(app).post("/slots/release").send({ token });
    expect(release.status).toBe(200);
  });
});
