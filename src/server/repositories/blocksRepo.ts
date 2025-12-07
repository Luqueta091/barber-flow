import { pool } from "../db.js";
import { v4 as uuid } from "uuid";

export type Block = {
  id: string;
  unitId: string;
  startAt: Date;
  endAt: Date;
  reason?: string;
};

export async function createBlock(input: Omit<Block, "id">) {
  const id = uuid();
  await pool.query(
    `INSERT INTO blocks (id, unit_id, start_at, end_at, reason) VALUES ($1,$2,$3,$4,$5)`,
    [id, input.unitId, input.startAt.toISOString(), input.endAt.toISOString(), input.reason ?? null],
  );
  return { id, ...input };
}

export async function listBlocks(unitId: string, date: Date) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  const res = await pool.query(
    `SELECT id,unit_id as "unitId",start_at as "startAt",end_at as "endAt",reason FROM blocks
     WHERE unit_id=$1 AND ($2,$3) OVERLAPS (start_at, end_at)
     ORDER BY start_at ASC`,
    [unitId, start.toISOString(), end.toISOString()],
  );
  return res.rows.map((r) => ({ ...r, startAt: new Date(r.startAt), endAt: new Date(r.endAt) }));
}

export async function deleteBlock(id: string) {
  const res = await pool.query(`DELETE FROM blocks WHERE id=$1`, [id]);
  return res.rowCount > 0;
}
