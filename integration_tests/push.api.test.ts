import request from "supertest";
import { describe, expect, it, beforeEach } from "vitest";
import { createApp } from "../src/server/app";
import { pushStore } from "../src/server/pushStore";

const app = createApp();

describe("Push subscriptions", () => {
  beforeEach(() => pushStore.clear());

  it("salva e lista subscriptions", async () => {
    const sub = await request(app).post("/push/subscribe").send({
      endpoint: "https://example.com/push/1",
      keys: { p256dh: "k", auth: "a" },
      userId: "user-1",
    });
    expect(sub.status).toBe(201);

    const list = await request(app).get("/push/subscriptions").query({ userId: "user-1" });
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBe(1);
  });
});
