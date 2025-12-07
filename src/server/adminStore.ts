import { v4 as uuid } from "uuid";
import { pool } from "./db.js";

export type Unit = {
  id: string;
  name: string;
  timezone: string;
  address?: string;
  openTime?: string;
  closeTime?: string;
  capacity?: number;
  isActive?: boolean;
  daysOfWeek?: string[];
};

export type Service = {
  id: string;
  unitId: string;
  name: string;
  durationMinutes: number;
  bufferAfterMinutes: number;
  capacity: number;
  price?: number;
  image?: string;
};

export type Barber = {
  id: string;
  name: string;
  contact?: string;
  units?: string[];
  isActive?: boolean;
};

export const adminStore = {
  async createUnit(input: Omit<Unit, "id">): Promise<Unit> {
    const id = uuid();
    const isActive = input.isActive ?? true;
    await pool.query(
      `INSERT INTO units (id,name,timezone,address,open_time,close_time,capacity,is_active,days_of_week)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, input.name, input.timezone, input.address, input.openTime, input.closeTime, input.capacity, isActive, input.daysOfWeek || null],
    );
    return { id, ...input, isActive };
  },
  async updateUnit(id: string, input: Partial<Omit<Unit, "id">>): Promise<Unit | null> {
    const existing = await this.getUnit(id);
    if (!existing) return null;
    const merged = { ...existing, ...input };
    await pool.query(
      `UPDATE units SET name=$2, timezone=$3, address=$4, open_time=$5, close_time=$6, capacity=$7, is_active=$8, days_of_week=$9 WHERE id=$1`,
      [id, merged.name, merged.timezone, merged.address, merged.openTime, merged.closeTime, merged.capacity, merged.isActive ?? true, merged.daysOfWeek || null],
    );
    return merged;
  },
  async deleteUnit(id: string): Promise<boolean> {
    const res = await pool.query(`DELETE FROM units WHERE id=$1`, [id]);
    return res.rowCount > 0;
  },
  async listUnits(): Promise<Unit[]> {
    const res = await pool.query(`SELECT id,name,timezone,address,open_time as "openTime",close_time as "closeTime",capacity,is_active as "isActive",days_of_week as "daysOfWeek" FROM units`);
    return res.rows;
  },
  async getUnit(id: string): Promise<Unit | null> {
    const res = await pool.query(
      `SELECT id,name,timezone,address,open_time as "openTime",close_time as "closeTime",capacity,is_active as "isActive",days_of_week as "daysOfWeek" FROM units WHERE id=$1`,
      [id],
    );
    return res.rows[0] ?? null;
  },
  async createService(input: Omit<Service, "id">): Promise<Service> {
    const id = uuid();
    await pool.query(
      `INSERT INTO services (id,unit_id,name,duration_minutes,buffer_after_minutes,capacity,price,image)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, input.unitId, input.name, input.durationMinutes, input.bufferAfterMinutes, input.capacity, input.price ?? null, input.image ?? null],
    );
    return { id, ...input };
  },
  async updateService(id: string, input: Partial<Omit<Service, "id">>): Promise<Service | null> {
    const existing = await this.listServices().then((all) => all.find((s) => s.id === id));
    if (!existing) return null;
    const merged = { ...existing, ...input };
    await pool.query(
      `UPDATE services SET unit_id=$2,name=$3,duration_minutes=$4,buffer_after_minutes=$5,capacity=$6,price=$7,image=$8 WHERE id=$1`,
      [id, merged.unitId, merged.name, merged.durationMinutes, merged.bufferAfterMinutes, merged.capacity, merged.price ?? null, merged.image ?? null],
    );
    return merged;
  },
  async deleteService(id: string): Promise<boolean> {
    const res = await pool.query(`DELETE FROM services WHERE id=$1`, [id]);
    return res.rowCount > 0;
  },
  async listServices(unitId?: string): Promise<Service[]> {
    if (unitId) {
      const res = await pool.query(
        `SELECT id,unit_id as "unitId",name,duration_minutes as "durationMinutes",buffer_after_minutes as "bufferAfterMinutes",capacity,price,image FROM services WHERE unit_id=$1`,
        [unitId],
      );
      return res.rows;
    }
    const res = await pool.query(
      `SELECT id,unit_id as "unitId",name,duration_minutes as "durationMinutes",buffer_after_minutes as "bufferAfterMinutes",capacity,price,image FROM services`,
    );
    return res.rows;
  },
  async createBarber(input: Omit<Barber, "id">): Promise<Barber> {
    const id = uuid();
    await pool.query(`INSERT INTO barbers (id,name,contact,units,is_active) VALUES ($1,$2,$3,$4,$5)`, [
      id,
      input.name,
      input.contact ?? null,
      input.units ?? [],
      input.isActive ?? true,
    ]);
    return { id, ...input, isActive: input.isActive ?? true };
  },
  async updateBarber(id: string, input: Partial<Omit<Barber, "id">>): Promise<Barber | null> {
    const existing = await this.listBarbers().then((all) => all.find((b) => b.id === id));
    if (!existing) return null;
    const merged = { ...existing, ...input };
    await pool.query(`UPDATE barbers SET name=$2, contact=$3, units=$4, is_active=$5 WHERE id=$1`, [
      id,
      merged.name,
      merged.contact ?? null,
      merged.units ?? [],
      merged.isActive ?? true,
    ]);
    return merged;
  },
  async deleteBarber(id: string): Promise<boolean> {
    const res = await pool.query(`DELETE FROM barbers WHERE id=$1`, [id]);
    return res.rowCount > 0;
  },
  async listBarbers(): Promise<Barber[]> {
    const res = await pool.query(`SELECT id,name,contact,units,is_active as "isActive" FROM barbers`);
    return res.rows;
  },
  async clear() {
    await pool.query("TRUNCATE services, barbers, units RESTART IDENTITY");
  },
};
