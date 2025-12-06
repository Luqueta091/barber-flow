import type { Request, Response } from "express";
import { z } from "zod";
import { generateSlots } from "../../modules/availability/domain/slotGenerator.js";
import { availabilityCache } from "../../modules/availability/cache/index.js";

const querySchema = z.object({
  unitId: z.string().min(1),
  serviceId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

// Mock service config; em produção viria do banco
const mockService = {
  durationMinutes: 30,
  bufferAfterMinutes: 0,
  capacity: 1,
};

// Mock schedule; em produção buscar agenda da unidade/dia
function buildScheduleForDate(date: Date) {
  const base = new Date(date);
  base.setUTCHours(9, 0, 0, 0);
  const end = new Date(date);
  end.setUTCHours(17, 0, 0, 0);
  return [{ start: base, end }];
}

export async function getAvailability(req: Request, res: Response) {
  const parsed = querySchema.safeParse({ ...req.query, unitId: req.params.id });
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_params", details: parsed.error.flatten() });
  }

  const { unitId, serviceId, startDate, endDate, page, pageSize } = parsed.data;
  const days = eachDate(startDate, endDate);

  const results = [];

  for (const day of days) {
    const dateKey = day.toISOString().slice(0, 10);
    const cached = await availabilityCache.get({ unitId, serviceId, date: dateKey });
    if (cached) {
      results.push({ date: dateKey, slots: cached.slots });
      continue;
    }

    const slots = generateSlots({
      date: day,
      schedule: buildScheduleForDate(day),
      service: mockService,
      existingAppointments: [],
      existingReservations: [],
    }).map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() }));

    const payload = { slots, generatedAt: new Date().toISOString() };
    await availabilityCache.set({ unitId, serviceId, date: dateKey }, payload);
    results.push({ date: dateKey, slots });
  }

  const total = results.length;
  const paged = results.slice((page - 1) * pageSize, page * pageSize);

  return res.json({
    data: paged,
    page,
    pageSize,
    total,
  });
}

function eachDate(start: Date, end: Date): Date[] {
  const out = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    out.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}
