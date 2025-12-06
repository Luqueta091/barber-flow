export type Slot = {
  start: Date;
  end: Date;
};

export type ServiceConfig = {
  durationMinutes: number;
  bufferAfterMinutes: number;
  capacity: number;
};

export type WorkingInterval = {
  start: Date;
  end: Date;
};

type GenerateParams = {
  date: Date;
  schedule: WorkingInterval[];
  service: ServiceConfig;
  existingAppointments?: Slot[];
  existingReservations?: Slot[];
};

const MINUTES = 60 * 1000;

function overlaps(a: Slot, b: Slot): boolean {
  return a.start < b.end && b.start < a.end;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTES);
}

export function generateSlots(params: GenerateParams): Slot[] {
  const { schedule, service, existingAppointments = [], existingReservations = [] } = params;
  const result: Slot[] = [];

  for (const window of schedule) {
    let cursor = new Date(window.start);
    const windowEnd = new Date(window.end);

    while (addMinutes(cursor, service.durationMinutes) <= windowEnd) {
      const slot: Slot = {
        start: new Date(cursor),
        end: addMinutes(cursor, service.durationMinutes),
      };

      const overlapCount =
        existingAppointments.filter((a) => overlaps(a, slot)).length +
        existingReservations.filter((r) => overlaps(r, slot)).length;
      const capacityReached = overlapCount >= service.capacity;

      if (!capacityReached) {
        result.push(slot);
      }

      cursor = addMinutes(cursor, service.durationMinutes + service.bufferAfterMinutes);
    }
  }

  return result;
}
