import type { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { reservationsStore, appointmentStore, eventPublisher } from "../store.js";
import { createAppointment } from "../../modules/scheduling/domain/appointment.js";
import type { EventEnvelope } from "../../../events/publisher.js";

const createSchema = z.object({
  userId: z.string().min(1),
  serviceId: z.string().min(1),
  unitId: z.string().min(1),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  reservationToken: z.string().uuid(),
  idempotencyKey: z.string().uuid().optional(),
});

export async function createAppointmentHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload", details: parsed.error.flatten() });
  }

  const { reservationToken, ...cmd } = parsed.data;

  // idempotency check (deve responder antes de validar reserva para permitir replays)
  if (parsed.data.idempotencyKey) {
    const existing = appointmentStore.findByIdempotencyKey(parsed.data.idempotencyKey);
    if (existing) {
      return res.status(200).json({ id: existing.id, status: existing.status });
    }
  }

  const reservation = reservationsStore.getActive(reservationToken);
  if (!reservation) {
    return res.status(409).json({ error: "invalid_or_expired_reservation" });
  }

  // ensure slot matches reservation
  if (
    reservation.unitId !== cmd.unitId ||
    reservation.serviceId !== cmd.serviceId ||
    reservation.startAt.getTime() !== cmd.startAt.getTime() ||
    reservation.endAt.getTime() !== cmd.endAt.getTime()
  ) {
    return res.status(409).json({ error: "slot_mismatch" });
  }

  const domain = createAppointment({
    id: uuid(),
    ...cmd,
    reservationToken,
  });
  if (!domain.ok) {
    return res.status(400).json({ error: domain.error });
  }

  // confirm reservation and persist
  const confirmed = reservationsStore.confirm(reservationToken);
  if (!confirmed) {
    return res.status(409).json({ error: "reservation_conflict" });
  }

  const appt = domain.value;
  appointmentStore.add({ ...appt, idempotencyKey: parsed.data.idempotencyKey });

  const event: EventEnvelope = {
    type: "AppointmentCreated",
    version: "v1",
    id: uuid(),
    occurredAt: new Date().toISOString(),
    payload: {
      appointmentId: appt.id,
      userId: appt.userId,
      unitId: appt.unitId,
      serviceId: appt.serviceId,
      startAt: appt.startAt,
      endAt: appt.endAt,
      reservationToken,
    },
  };
  await eventPublisher.publish(event);

  return res.status(201).json({ id: appt.id, status: appt.status });
}
