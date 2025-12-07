import { v4 as uuid } from "uuid";

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

const units = new Map<string, Unit>();
const services = new Map<string, Service>();
const barbers = new Map<string, Barber>();

export const adminStore = {
  createUnit(input: Omit<Unit, "id">): Unit {
    const u: Unit = { id: uuid(), isActive: true, ...input };
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
  createBarber(input: Omit<Barber, "id">): Barber {
    const b: Barber = { id: uuid(), isActive: true, ...input };
    barbers.set(b.id, b);
    return b;
  },
  updateBarber(id: string, input: Partial<Omit<Barber, "id">>): Barber | null {
    const existing = barbers.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...input };
    barbers.set(id, updated);
    return updated;
  },
  deleteBarber(id: string): boolean {
    return barbers.delete(id);
  },
  listBarbers(): Barber[] {
    return Array.from(barbers.values());
  },
  clear() {
    units.clear();
    services.clear();
    barbers.clear();
  },
};
