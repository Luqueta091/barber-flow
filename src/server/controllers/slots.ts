import type { Request, Response } from "express";
import { z } from "zod";
import { availabilityCache } from "../../modules/availability/cache/index.js";
import { lockReservation, releaseReservation } from "../repositories/reservationsRepo.js";

const lockSchema = z.object({
  unitId: z.string().min(1),
  serviceId: z.string().min(1),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  ttlSeconds: z.number().int().positive().optional().default(300),
});

export async function lockSlot(req: Request, res: Response) {
  const parsed = lockSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload", details: parsed.error.flatten() });
  }

  const { unitId, serviceId, startAt, endAt, ttlSeconds } = parsed.data;
  try {
    const reservation = await lockReservation({ unitId, serviceId, startAt, endAt, ttlSeconds });
    // Invalida cache de disponibilidade para o dia do slot
    const dateKey = startAt.toISOString().slice(0, 10);
    await availabilityCache.invalidate({ unitId, serviceId, date: dateKey });
    return res.status(200).json({
      reservationToken: reservation.token,
      status: reservation.status,
      expiresAt: reservation.expiresAt,
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string } | undefined;
    if (error?.status === 409 || error?.message === "slot_conflict") {
      return res.status(409).json({ error: "slot_conflict" });
    }
    return res.status(500).json({ error: "internal_error" });
  }
}

const releaseSchema = z.object({
  token: z.string().uuid(),
});

export async function releaseSlot(req: Request, res: Response) {
  const parsed = releaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload", details: parsed.error.flatten() });
  }

  const { token } = parsed.data;
  await releaseReservation(token);
  return res.status(200).json({ status: "released" });
}
