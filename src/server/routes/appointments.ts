import type { Request, Response } from "express";
import { z } from "zod";
import { lockReservation, confirmReservation } from "../repositories/reservationsRepo.js";
import { createAppointment as createAppointmentDb, listAppointments, cancelAppointment } from "../repositories/appointmentsRepo.js";
import { v4 as uuid } from "uuid";

const createSchema = z.object({
  userId: z.string().min(1),
  serviceId: z.string().min(1),
  unitId: z.string().min(1),
  barberId: z.string().optional(),
  clientName: z.string().optional(),
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

  try {
    // garante que a reserva existe
    await confirmReservation(reservationToken);
    const appt = await createAppointmentDb({ ...cmd, reservationToken });
    return res.status(201).json({ id: appt.id, status: appt.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

export async function listAppointmentsHandler(req: Request, res: Response) {
  const date = (req.query.date as string | undefined) || undefined;
  const barberId = (req.query.barberId as string | undefined) || undefined;
  const userId = (req.query.userId as string | undefined) || undefined;
  try {
    const data = await listAppointments(date, barberId, userId);
    return res.json({ data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}

export async function cancelAppointmentHandler(req: Request, res: Response) {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "invalid_payload" });
  try {
    const ok = await cancelAppointment(id);
    if (!ok) return res.status(404).json({ error: "not_found" });
    return res.status(200).json({ status: "cancelled" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
}
