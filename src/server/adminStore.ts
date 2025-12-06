import { v4 as uuid } from "uuid";

export type Unit = {
  id: string;
  name: string;
  timezone: string;
  address?: string;
};

export type Service = {
  id: string;
  unitId: string;
  name: string;
  durationMinutes: number;
  bufferAfterMinutes: number;
  capacity: number;
};

const units = new Map<string, Unit>();
const services = new Map<string, Service>();

export const adminStore = {
  createUnit(input: { name: string; timezone: string; address?: string }): Unit {
    const u: Unit = { id: uuid(), ...input };
    units.set(u.id, u);
    return u;
  },
  updateUnit(id: string, input: Partial<Omit<Unit, "id">>): Unit | null {
    const existing = units.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...input };
    units.set(id, updated);
    return updated;
  },
  deleteUnit(id: string): boolean {
    // remove services belonging to the unit
    for (const [sid, svc] of services.entries()) {
      if (svc.unitId === id) services.delete(sid);
    }
    return units.delete(id);
  },
  listUnits(): Unit[] {
    return Array.from(units.values());
  },
  getUnit(id: string): Unit | null {
    return units.get(id) ?? null;
  },
  createService(input: Omit<Service, "id">): Service {
    const s: Service = { id: uuid(), ...input };
    services.set(s.id, s);
    return s;
  },
  updateService(id: string, input: Partial<Omit<Service, "id">>): Service | null {
    const existing = services.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...input };
    services.set(id, updated);
    return updated;
  },
  deleteService(id: string): boolean {
    return services.delete(id);
  },
  listServices(unitId?: string): Service[] {
    return Array.from(services.values()).filter((s) => (unitId ? s.unitId === unitId : true));
  },
  clear() {
    units.clear();
    services.clear();
  },
};
