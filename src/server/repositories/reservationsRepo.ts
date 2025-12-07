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
  const token = uuid();
  const expiresAt = new Date(Date.now() + (input.ttlSeconds ?? 300) * 1000);
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
