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
});

export function createUnitHandler(req: Request, res: Response) {
  const parsed = unitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const unit = adminStore.createUnit(parsed.data);
  return res.status(201).json(unit);
}

export function updateUnitHandler(req: Request, res: Response) {
  const parsed = unitSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const unit = adminStore.updateUnit(req.params.id, parsed.data);
  if (!unit) return res.status(404).json({ error: "not_found" });
  return res.json(unit);
}

export function deleteUnitHandler(req: Request, res: Response) {
  const ok = adminStore.deleteUnit(req.params.id);
  if (!ok) return res.status(404).json({ error: "not_found" });
  // Invalidate cache for unit
  availabilityCache.invalidateUnit(req.params.id);
  return res.status(204).send();
}

export function listUnitsHandler(_req: Request, res: Response) {
  return res.json({ data: adminStore.listUnits() });
}

export function createServiceHandler(req: Request, res: Response) {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const svc = adminStore.createService(parsed.data);
  availabilityCache.invalidateUnit(svc.unitId);
  return res.status(201).json(svc);
}

export function updateServiceHandler(req: Request, res: Response) {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const svc = adminStore.updateService(req.params.id, parsed.data);
  if (!svc) return res.status(404).json({ error: "not_found" });
  availabilityCache.invalidateUnit(svc.unitId);
  return res.json(svc);
}

export function deleteServiceHandler(req: Request, res: Response) {
  const svcList = adminStore.listServices();
  const svc = svcList.find((s) => s.id === req.params.id);
  const ok = adminStore.deleteService(req.params.id);
  if (!ok) return res.status(404).json({ error: "not_found" });
  if (svc) availabilityCache.invalidateUnit(svc.unitId);
  return res.status(204).send();
}

export function listServicesHandler(req: Request, res: Response) {
  const unitId = req.query.unitId as string | undefined;
  return res.json({ data: adminStore.listServices(unitId) });
}

export function createBarberHandler(req: Request, res: Response) {
  const parsed = barberSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const barber = adminStore.createBarber(parsed.data);
  return res.status(201).json(barber);
}

export function updateBarberHandler(req: Request, res: Response) {
  const parsed = barberSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const barber = adminStore.updateBarber(req.params.id, parsed.data);
  if (!barber) return res.status(404).json({ error: "not_found" });
  return res.json(barber);
}

export function deleteBarberHandler(req: Request, res: Response) {
  const ok = adminStore.deleteBarber(req.params.id);
  if (!ok) return res.status(404).json({ error: "not_found" });
  return res.status(204).send();
}

export function listBarbersHandler(_req: Request, res: Response) {
  return res.json({ data: adminStore.listBarbers() });
}
