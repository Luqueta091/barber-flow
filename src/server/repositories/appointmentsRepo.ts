import { pool } from "../db.js";
import { v4 as uuid } from "uuid";

export type AppointmentStatus = "scheduled" | "cancelled" | "completed" | "no_show";

export type AppointmentInput = {
  userId: string;
  unitId: string;
  serviceId: string;
  barberId?: string;
  clientName?: string;
  startAt: Date;
  endAt: Date;
  reservationToken?: string;
};

export async function createAppointment(input: AppointmentInput) {
  const id = uuid();
  await pool.query(
    `INSERT INTO appointments (id,user_id,unit_id,service_id,barber_id,client_name,start_at,end_at,status,reservation_token)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'scheduled',$9)`,
    [
      id,
      input.userId,
      input.unitId,
      input.serviceId,
      input.barberId ?? null,
      input.clientName ?? null,
      input.startAt.toISOString(),
      input.endAt.toISOString(),
      input.reservationToken ?? null,
    ],
  );
  return { id, ...input, status: "scheduled" as AppointmentStatus };
}

export async function listAppointments(date?: string, barberId?: string, userId?: string) {
  const params: any[] = [];
  let conditions: string[] = [];

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    params.push(start.toISOString(), end.toISOString());
    conditions.push(`start_at >= $${params.length - 1} AND start_at <= $${params.length}`);
  }

  if (barberId) {
    params.push(barberId);
    conditions.push(`barber_id = $${params.length}`);
  }
  if (userId) {
    params.push(userId);
    conditions.push(`user_id = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const res = await pool.query(
    `
    SELECT id,user_id as "userId",unit_id as "unitId",service_id as "serviceId",barber_id as "barberId",client_name as "clientName",start_at as "startAt",end_at as "endAt",status,reservation_token as "reservationToken"
    FROM appointments
    ${where}
    ORDER BY start_at DESC
  `,
    params,
  );
  return res.rows;
}

export async function cancelAppointment(id: string) {
  const res = await pool.query(
    `UPDATE appointments SET status='cancelled' WHERE id=$1 RETURNING id,user_id as "userId",unit_id as "unitId",service_id as "serviceId",barber_id as "barberId",start_at as "startAt",end_at as "endAt"`,
    [id],
  );
  return res.rows[0] ?? null;
}
