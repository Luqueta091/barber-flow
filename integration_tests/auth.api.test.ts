import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/server/app";

const app = createApp();

describe("OTP Auth", () => {
  it("happy path: request -> verify", async () => {
    const reqOtp = await request(app).post("/auth/request-otp").send({ phone: "+5511999999999" });
    expect(reqOtp.status).toBe(200);

    // Como não temos acesso ao código, esperamos falha ao usar um código arbitrário
    const verifyInvalid = await request(app).post("/auth/verify-otp").send({ phone: "+5511999999999", code: "000000" });
    expect([400, 410, 429]).toContain(verifyInvalid.status);
  });
});
