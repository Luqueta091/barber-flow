import type { Request, Response } from "express";
import { z } from "zod";
import { availabilityCache } from "../../modules/availability/cache/index.js";
import { generateSlots } from "../../modules/availability/domain/slotGenerator.js";
import { reservationsStore, appointmentStore, eventPublisher } from "../store.js";
import { createAppointment } from "../../modules/scheduling/domain/appointment.js";
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
    const reservation = reservationsStore.lock({ unitId, serviceId, startAt, endAt, ttlSeconds: 300 });
    const apptResult = createAppointment({
      id: uuid(),
      userId,
      unitId,
      serviceId,
      startAt,
      endAt,
      reservationToken: reservation.token,
    });
    if (!apptResult.ok) return res.status(400).json({ error: apptResult.error });

    reservationsStore.confirm(reservation.token);
    appointmentStore.add(apptResult.value);

    const event: EventEnvelope = {
      type: "AppointmentCreated",
      version: "v1",
      id: uuid(),
      occurredAt: new Date().toISOString(),
      payload: {
        appointmentId: apptResult.value.id,
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

    return res.status(201).json({ appointmentId: apptResult.value.id, reservationToken: reservation.token });
  } catch (e: any) {
    if (e?.message === "slot_conflict") return res.status(409).json({ error: "slot_conflict" });
    return res.status(500).json({ error: "internal_error" });
  }
}
