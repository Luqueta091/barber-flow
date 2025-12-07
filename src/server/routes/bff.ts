import type { Request, Response } from "express";
import { z } from "zod";
import { availabilityCache } from "../../modules/availability/cache/index.js";
import { generateSlots } from "../../modules/availability/domain/slotGenerator.js";
import { availabilityCache } from "../../modules/availability/cache/index.js";
import { lockReservation, confirmReservation } from "../repositories/reservationsRepo.js";
import { createAppointment as createAppointmentDb } from "../repositories/appointmentsRepo.js";
import type { EventEnvelope } from "../../../events/publisher.js";
import { v4 as uuid } from "uuid";

const availabilitySchema = z.object({
  unitId: z.string(),
  serviceId: z.string(),
  date: z.coerce.date(),
});

export async function bffAvailabilityHandler(req: Request, res: Response) {
  const parsed = availabilitySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "invalid_params" });
  const { unitId, serviceId, date } = parsed.data;
  const dateKey = date.toISOString().slice(0, 10);
  const cached = await availabilityCache.get({ unitId, serviceId, date: dateKey });
  if (cached) return res.json({ date: dateKey, slots: cached.slots });

  const slots = generateSlots({
    date,
    schedule: [{ start: new Date(date.setUTCHours(9, 0, 0, 0)), end: new Date(date.setUTCHours(17, 0, 0, 0)) }],
    service: { durationMinutes: 30, bufferAfterMinutes: 0, capacity: 1 },
    existingAppointments: [],
    existingReservations: [],
  }).map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() }));

  await availabilityCache.set({ unitId, serviceId, date: dateKey }, { slots, generatedAt: new Date().toISOString() });
  return res.json({ date: dateKey, slots });
}

const bookSchema = z.object({
  userId: z.string(),
  unitId: z.string(),
  serviceId: z.string(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
});

export async function bffBookHandler(req: Request, res: Response) {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const { userId, unitId, serviceId, startAt, endAt } = parsed.data;

  try {
    const reservation = await lockReservation({ unitId, serviceId, startAt, endAt, ttlSeconds: 300 });
    await confirmReservation(reservation.token);

    const appointment = await createAppointmentDb({
      userId,
      unitId,
      serviceId,
      startAt,
      endAt,
      reservationToken: reservation.token,
    });

    const event: EventEnvelope = {
      type: "AppointmentCreated",
      version: "v1",
      id: uuid(),
      occurredAt: new Date().toISOString(),
      payload: {
        appointmentId: appointment.id,
        userId,
        unitId,
        serviceId,
        startAt,
        endAt,
        reservationToken: reservation.token,
      },
    };
    await eventPublisher.publish(event);

    await availabilityCache.invalidate({ unitId, serviceId, date: startAt.toISOString().slice(0, 10) });

    return res.status(201).json({ appointmentId: appointment.id, reservationToken: reservation.token });
  } catch (e: unknown) {
    const err = e as { message?: string } | undefined;
    if (err?.message === "slot_conflict") return res.status(409).json({ error: "slot_conflict" });
    return res.status(500).json({ error: "internal_error" });
  }
}
