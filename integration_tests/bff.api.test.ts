import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/server/app";

const app = createApp();

describe("BFF booking flow", () => {
  it("consulta disponibilidade e realiza booking", async () => {
    const avail = await request(app)
      .get("/bff/availability")
      .query({ unitId: "u1", serviceId: "s1", date: "2024-01-02" });
    expect(avail.status).toBe(200);
    const slot = avail.body.slots[0];

    const book = await request(app).post("/bff/book").send({
      userId: "user-1",
      unitId: "u1",
      serviceId: "s1",
      startAt: slot.start,
      endAt: slot.end,
    });

    expect(book.status).toBe(201);
    expect(book.body.appointmentId).toBeDefined();
  });
});
