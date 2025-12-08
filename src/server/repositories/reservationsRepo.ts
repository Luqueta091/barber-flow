import { pool } from "../db.js";
import { v4 as uuid } from "uuid";

export type ReservationStatus = "locked" | "confirmed" | "released";

export type ReservationInput = {
  unitId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  ttlSeconds?: number;
};

export async function lockReservation(input: ReservationInput) {
  if (input.endAt <= input.startAt) {
    const err = new Error("slot_conflict");
    (err as any).status = 409;
    throw err;
  }

  const token = uuid();
  const expiresAt = new Date(Date.now() + (input.ttlSeconds ?? 300) * 1000);

  const conflict = await pool.query(
    `
    SELECT 1
    FROM reservations
    WHERE unit_id=$1
      AND service_id=$2
      AND status IN ('locked','confirmed')
      AND expires_at > now()
      AND ($3,$4) OVERLAPS (start_at, end_at)
    UNION ALL
    SELECT 1
    FROM appointments
    WHERE unit_id=$1
      AND service_id=$2
      AND status <> 'cancelled'
      AND ($3,$4) OVERLAPS (start_at, end_at)
    LIMIT 1;
  `,
    [input.unitId, input.serviceId, input.startAt.toISOString(), input.endAt.toISOString()],
  );

  if (conflict.rowCount > 0) {
    const err = new Error("slot_conflict");
    (err as any).status = 409;
    throw err;
  }

  await pool.query(
    `INSERT INTO reservations (token,unit_id,service_id,start_at,end_at,status,expires_at)
     VALUES ($1,$2,$3,$4,$5,'locked',$6)`,
    [token, input.unitId, input.serviceId, input.startAt.toISOString(), input.endAt.toISOString(), expiresAt.toISOString()],
  );
  return { token, status: "locked" as ReservationStatus, expiresAt };
}

export async function releaseReservation(token: string) {
  await pool.query(`UPDATE reservations SET status='released' WHERE token=$1`, [token]);
}

export async function confirmReservation(token: string) {
  await pool.query(`UPDATE reservations SET status='confirmed' WHERE token=$1`, [token]);
}

export async function findReservation(token: string) {
  const res = await pool.query(
    `SELECT token,unit_id as "unitId",service_id as "serviceId",start_at as "startAt",end_at as "endAt",status,expires_at as "expiresAt"
     FROM reservations WHERE token=$1`,
    [token],
  );
  return res.rows[0] ?? null;
}
