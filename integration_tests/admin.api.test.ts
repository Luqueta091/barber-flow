import request from "supertest";
import { describe, expect, it, beforeEach } from "vitest";
import { createApp } from "../src/server/app";
import { adminStore } from "../src/server/adminStore";
import { availabilityCache } from "../src/modules/availability/cache";

const app = createApp();

describe("Admin CRUD (units/services)", () => {
  beforeEach(async () => {
    adminStore.clear();
    await availabilityCache.invalidateUnit(""); // no-op
  });

  it("cria/atualiza/deleta unidade e serviço e invalida cache", async () => {
    const unit = await request(app).post("/admin/units").send({ name: "Unit A", timezone: "UTC" });
    expect(unit.status).toBe(201);
    const unitId = unit.body.id;

    const svc = await request(app)
      .post("/admin/services")
      .send({ unitId, name: "Haircut", durationMinutes: 30, bufferAfterMinutes: 0, capacity: 1 });
    expect(svc.status).toBe(201);

    const listServices = await request(app).get("/admin/services").query({ unitId });
    expect(listServices.status).toBe(200);
    expect(listServices.body.data.length).toBe(1);

    const updUnit = await request(app).put(`/admin/units/${unitId}`).send({ name: "Unit B" });
    expect(updUnit.status).toBe(200);
    expect(updUnit.body.name).toBe("Unit B");

    const delSvc = await request(app).delete(`/admin/services/${svc.body.id}`);
    expect(delSvc.status).toBe(204);

    const delUnit = await request(app).delete(`/admin/units/${unitId}`);
    expect(delUnit.status).toBe(204);
  });
});
