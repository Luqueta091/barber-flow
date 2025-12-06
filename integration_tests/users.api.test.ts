import request from "supertest";
import { describe, expect, it, beforeEach } from "vitest";
import { createApp } from "../src/server/app";
import { userStore } from "../src/server/userStore";

const app = createApp();

describe("User CRUD", () => {
  beforeEach(() => userStore.clear());

  it("cria, busca, atualiza e deleta usuário", async () => {
    const create = await request(app).post("/users").send({ fullName: "John Doe", phone: "+5511999999999", email: "john@example.com" });
    expect(create.status).toBe(201);
    const id = create.body.id;

    const fetch = await request(app).get(`/users/${id}`);
    expect(fetch.status).toBe(200);
    expect(fetch.body.fullName).toBe("John Doe");

    const update = await request(app).put(`/users/${id}`).send({ fullName: "John D." });
    expect(update.status).toBe(200);
    expect(update.body.fullName).toBe("John D.");

    const del = await request(app).delete(`/users/${id}`);
    expect(del.status).toBe(204);

    const fetch404 = await request(app).get(`/users/${id}`);
    expect(fetch404.status).toBe(404);
  });

  it("busca por telefone e email", async () => {
    const user1 = await request(app).post("/users").send({ fullName: "User1", phone: "+111222333", email: "u1@example.com" });
    expect(user1.status).toBe(201);

    const byPhone = await request(app).get("/users").query({ phone: "+111222333" });
    expect(byPhone.status).toBe(200);
    expect(byPhone.body.data[0].email).toBe("u1@example.com");

    const byEmail = await request(app).get("/users").query({ email: "u1@example.com" });
    expect(byEmail.status).toBe(200);
    expect(byEmail.body.data[0].phone).toBe("+111222333");
  });
});
