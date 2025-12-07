import type { Request, Response } from "express";
import { z } from "zod";
import { availabilityCache } from "../../modules/availability/cache/index.js";
import { computeAvailabilityForDate, eachDate } from "../services/availabilityService.js";
import { adminStore } from "../adminStore.js";

const querySchema = z.object({
  unitId: z.string().min(1),
  serviceId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

export async function getAvailability(req: Request, res: Response) {
  const parsed = querySchema.safeParse({ ...req.query, unitId: req.params.id });
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_params", details: parsed.error.flatten() });
  }

  const { unitId, serviceId, startDate, endDate, page, pageSize } = parsed.data;
  const unit = await adminStore.getUnit(unitId);
  const service = await adminStore.getService(serviceId);
  if (!unit || !service) return res.status(404).json({ error: "not_found" });

  const days = eachDate(startDate, endDate);

  const results = [];

  for (const day of days) {
    const dateKey = day.toISOString().slice(0, 10);
    const cached = await availabilityCache.get({ unitId, serviceId, date: dateKey });
    if (cached) {
      results.push({ date: dateKey, slots: cached.slots });
      continue;
    }

    const availability = await computeAvailabilityForDate({ unitId, serviceId, date: day });
    const slots = availability?.slots ?? [];

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
