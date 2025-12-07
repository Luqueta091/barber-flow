import { generateSlots } from "../../modules/availability/domain/slotGenerator.js";
import { adminStore } from "../adminStore.js";
import { pool } from "../db.js";

type ComputeParams = {
  unitId: string;
  serviceId: string;
  date: Date;
};

export type AvailabilityResult = {
  dateKey: string;
  slots: { start: string; end: string }[];
};

const DEFAULT_OPEN = "09:00";
const DEFAULT_CLOSE = "17:00";
const DAY_NAMES: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

function dateAtTimeUTC(base: Date, time: string): Date {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), hour || 0, minute || 0, 0, 0));
}

function isOpenOn(date: Date, daysOfWeek?: string[] | null): boolean {
  if (!daysOfWeek || daysOfWeek.length === 0) return true;
  const dow = date.getUTCDay();
  return daysOfWeek.some((entry) => {
    if (!entry) return false;
    const normalized = entry.toString().trim().toLowerCase();
    if (/^[0-6]$/.test(normalized)) return Number(normalized) === dow;
    const mapped = DAY_NAMES[normalized];
    return mapped !== undefined && mapped === dow;
  });
}

async function loadConflicts(unitId: string, serviceId: string, start: Date, end: Date) {
  const reservations = await pool.query(
    `SELECT start_at, end_at
     FROM reservations
     WHERE unit_id=$1
       AND service_id=$2
       AND status IN ('locked','confirmed')
       AND expires_at > now()
       AND ($3,$4) OVERLAPS (start_at, end_at)`,
    [unitId, serviceId, start.toISOString(), end.toISOString()],
  );

  const appointments = await pool.query(
    `SELECT start_at, end_at
     FROM appointments
     WHERE unit_id=$1
       AND service_id=$2
       AND status <> 'cancelled'
       AND ($3,$4) OVERLAPS (start_at, end_at)`,
    [unitId, serviceId, start.toISOString(), end.toISOString()],
  );

  return {
    reservations: reservations.rows.map((r) => ({ start: new Date(r.start_at), end: new Date(r.end_at) })),
    appointments: appointments.rows.map((a) => ({ start: new Date(a.start_at), end: new Date(a.end_at) })),
  };
}

export async function computeAvailabilityForDate(params: ComputeParams): Promise<AvailabilityResult | null> {
  const { unitId, serviceId } = params;
  const day = new Date(params.date);
  const dateKey = day.toISOString().slice(0, 10);

  const [unit, service] = await Promise.all([adminStore.getUnit(unitId), adminStore.getService(serviceId)]);
  if (!unit || unit.isActive === false) return { dateKey, slots: [] };
  if (!service || service.unitId !== unitId) return { dateKey, slots: [] };

  if (!isOpenOn(day, unit.daysOfWeek)) return { dateKey, slots: [] };

  const start = dateAtTimeUTC(day, unit.openTime || DEFAULT_OPEN);
  const end = dateAtTimeUTC(day, unit.closeTime || DEFAULT_CLOSE);
  if (end <= start) return { dateKey, slots: [] };

  const { appointments, reservations } = await loadConflicts(unitId, serviceId, start, end);

  const slots = generateSlots({
    date: day,
    schedule: [{ start, end }],
    service: {
      durationMinutes: service.durationMinutes ?? 30,
      bufferAfterMinutes: service.bufferAfterMinutes ?? 0,
      capacity: service.capacity ?? 1,
    },
    existingAppointments: appointments,
    existingReservations: reservations,
  }).map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() }));

  return { dateKey, slots };
}

export function eachDate(start: Date, end: Date): Date[] {
  const out = [];
  const cursor = new Date(start);
  cursor.setUTCHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setUTCHours(0, 0, 0, 0);

  while (cursor <= last) {
    out.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return out;
}
