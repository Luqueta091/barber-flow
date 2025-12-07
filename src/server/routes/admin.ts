import type { Request, Response } from "express";
import { z } from "zod";
import { adminStore } from "../adminStore.js";
import { availabilityCache } from "../../modules/availability/cache/index.js";

const unitSchema = z.object({
  name: z.string().min(1),
  timezone: z.string().min(1),
  address: z.string().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  daysOfWeek: z.array(z.string()).optional(),
});

const serviceSchema = z.object({
  unitId: z.string().min(1),
  name: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  bufferAfterMinutes: z.number().int().nonnegative(),
  capacity: z.number().int().positive(),
  price: z.number().nonnegative().optional(),
  image: z.string().optional(),
});

const barberSchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  units: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  pin: z.string().optional(),
});

export async function createUnitHandler(req: Request, res: Response) {
  const parsed = unitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const unit = await adminStore.createUnit(parsed.data);
  return res.status(201).json(unit);
}

export async function updateUnitHandler(req: Request, res: Response) {
  const parsed = unitSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const unit = await adminStore.updateUnit(req.params.id, parsed.data);
  if (!unit) return res.status(404).json({ error: "not_found" });
  return res.json(unit);
}

export async function deleteUnitHandler(req: Request, res: Response) {
  const ok = await adminStore.deleteUnit(req.params.id);
  if (!ok) return res.status(404).json({ error: "not_found" });
  // Invalidate cache for unit
  availabilityCache.invalidateUnit(req.params.id);
  return res.status(204).send();
}

export async function listUnitsHandler(_req: Request, res: Response) {
  try {
    const data = await adminStore.listUnits();
    return res.json({ data: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ data: [] });
  }
}

export async function createServiceHandler(req: Request, res: Response) {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const svc = await adminStore.createService(parsed.data);
  await availabilityCache.invalidateUnit(svc.unitId);
  return res.status(201).json(svc);
}

export async function updateServiceHandler(req: Request, res: Response) {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const svc = await adminStore.updateService(req.params.id, parsed.data);
  if (!svc) return res.status(404).json({ error: "not_found" });
  await availabilityCache.invalidateUnit(svc.unitId);
  return res.json(svc);
}

export async function deleteServiceHandler(req: Request, res: Response) {
  const svcList = await adminStore.listServices();
  const svc = svcList.find((s) => s.id === req.params.id);
  const ok = await adminStore.deleteService(req.params.id);
  if (!ok) return res.status(404).json({ error: "not_found" });
  if (svc) await availabilityCache.invalidateUnit(svc.unitId);
  return res.status(204).send();
}

export async function listServicesHandler(req: Request, res: Response) {
  const unitId = req.query.unitId as string | undefined;
  try {
    const data = await adminStore.listServices(unitId);
    return res.json({ data: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ data: [] });
  }
}

export async function createBarberHandler(req: Request, res: Response) {
  const parsed = barberSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const barber = await adminStore.createBarber(parsed.data);
  return res.status(201).json(barber);
}

export async function updateBarberHandler(req: Request, res: Response) {
  const parsed = barberSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const barber = await adminStore.updateBarber(req.params.id, parsed.data);
  if (!barber) return res.status(404).json({ error: "not_found" });
  return res.json(barber);
}

export async function deleteBarberHandler(req: Request, res: Response) {
  const ok = await adminStore.deleteBarber(req.params.id);
  if (!ok) return res.status(404).json({ error: "not_found" });
  return res.status(204).send();
}

export async function listBarbersHandler(_req: Request, res: Response) {
  try {
    const data = await adminStore.listBarbers();
    return res.json({ data: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ data: [] });
  }
}
