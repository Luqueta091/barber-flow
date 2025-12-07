import type { Request, Response } from "express";
import { z } from "zod";
import { InMemoryOtpStore } from "../../modules/auth/otp/memoryStore.js";
import { OtpService } from "../../modules/auth/otp/service.js";
import { adminStore } from "../adminStore.js";

const otpStore = new InMemoryOtpStore();
const otpService = new OtpService(otpStore, { ttlSeconds: 300, maxAttempts: 5, rateLimitMs: 30_000 });

const requestSchema = z.object({
  phone: z.string().min(8),
});

const verifySchema = z.object({
  phone: z.string().min(8),
  code: z.string().min(4),
});

const barberPinSchema = z.object({
  pin: z.string().min(4),
});

export async function requestOtpHandler(req: Request, res: Response) {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }
  const result = await otpService.requestOtp(parsed.data.phone);
  if (!result.ok) {
    return res.status(429).json({ error: result.error });
  }
  // Em produção, enviar SMS aqui
  return res.status(200).json({ expiresAt: result.expiresAt });
}

export async function verifyOtpHandler(req: Request, res: Response) {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  const result = await otpService.verifyOtp(parsed.data.phone, parsed.data.code);
  if (!result.ok) {
    const statusMap = {
      expired: 410,
      invalid_code: 400,
      too_many_attempts: 429,
    } as const;
    return res.status(statusMap[result.error]).json({ error: result.error });
  }

  return res.status(200).json({ token: result.token });
}

export async function barberPinLoginHandler(req: Request, res: Response) {
  const parsed = barberPinSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }
  const barber = await adminStore.findBarberByPin(parsed.data.pin);
  if (!barber || barber.isActive === false) {
    return res.status(401).json({ error: "invalid_pin" });
  }
  return res.status(200).json({
    barber: {
      id: barber.id,
      name: barber.name,
      units: barber.units ?? [],
    },
  });
}
