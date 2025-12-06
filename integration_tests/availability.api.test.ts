import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/server/app";

const app = createApp();

describe("GET /units/:id/availability", () => {
  it("retorna slots paginados para range de datas", async () => {
    const res = await request(app)
      .get("/units/u1/availability")
      .query({
        serviceId: "s1",
        startDate: "2024-01-01",
        endDate: "2024-01-02",
        page: 1,
        pageSize: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.total).toBe(2); // dois dias
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(1);
  });

  it("retorna 400 em params inválidos", async () => {
    const res = await request(app)
      .get("/units/u1/availability")
      .query({
        serviceId: "",
        startDate: "invalid",
        endDate: "2024-01-02",
      });

    expect(res.status).toBe(400);
  });
});
