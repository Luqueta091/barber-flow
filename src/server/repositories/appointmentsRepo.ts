import { pool } from "../db.js";
import { v4 as uuid } from "uuid";

export type AppointmentStatus = "scheduled" | "cancelled" | "completed" | "no_show";

export type AppointmentInput = {
  userId: string;
  unitId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  reservationToken?: string;
};

export async function createAppointment(input: AppointmentInput) {
  const id = uuid();
  await pool.query(
    `INSERT INTO appointments (id,user_id,unit_id,service_id,start_at,end_at,status,reservation_token)
     VALUES ($1,$2,$3,$4,$5,$6,'scheduled',$7)`,
    [id, input.userId, input.unitId, input.serviceId, input.startAt.toISOString(), input.endAt.toISOString(), input.reservationToken ?? null],
  );
  return { id, ...input, status: "scheduled" as AppointmentStatus };
}

export async function listAppointments(date?: string) {
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    const res = await pool.query(
      `SELECT id,user_id as "userId",unit_id as "unitId",service_id as "serviceId",start_at as "startAt",end_at as "endAt",status,reservation_token as "reservationToken"
       FROM appointments
       WHERE start_at >= $1 AND start_at <= $2
       ORDER BY start_at ASC`,
      [start.toISOString(), end.toISOString()],
    );
    return res.rows;
  }
  const res = await pool.query(
    `SELECT id,user_id as "userId",unit_id as "unitId",service_id as "serviceId",start_at as "startAt",end_at as "endAt",status,reservation_token as "reservationToken"
     FROM appointments
     ORDER BY start_at DESC`,
  );
  return res.rows;
}
