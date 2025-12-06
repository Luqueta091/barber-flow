import { describe, expect, it } from "vitest";
import { generateSlots, type Slot, type WorkingInterval } from "../domain/slotGenerator";

const toDate = (time: string) => new Date(`2024-01-01T${time}:00Z`);

describe("slot generator", () => {
  const schedule: WorkingInterval[] = [
    { start: toDate("09:00"), end: toDate("12:00") },
  ];

  it("gera slots respeitando duração e buffer", () => {
    const slots = generateSlots({
      date: toDate("09:00"),
      schedule,
      service: { durationMinutes: 30, bufferAfterMinutes: 10, capacity: 1 },
    });

    expect(slots.map((s) => s.start.toISOString())).toEqual([
      "2024-01-01T09:00:00.000Z",
      "2024-01-01T09:40:00.000Z",
      "2024-01-01T10:20:00.000Z",
      "2024-01-01T11:00:00.000Z",
    ]);
  });

  it("remove slots que colidem com appointments existentes", () => {
    const existing: Slot[] = [
      { start: toDate("09:00"), end: toDate("09:30") },
    ];
    const slots = generateSlots({
      date: toDate("09:00"),
      schedule,
      service: { durationMinutes: 30, bufferAfterMinutes: 0, capacity: 1 },
      existingAppointments: existing,
    });

    expect(slots.map((s) => s.start.toISOString())).toEqual([
      "2024-01-01T09:30:00.000Z",
      "2024-01-01T10:00:00.000Z",
      "2024-01-01T10:30:00.000Z",
      "2024-01-01T11:00:00.000Z",
      "2024-01-01T11:30:00.000Z",
    ]);
  });

  it("respeita capacidade removendo slots quando atingida", () => {
    const existing: Slot[] = [
      { start: toDate("09:00"), end: toDate("09:30") },
      { start: toDate("09:05"), end: toDate("09:35") },
    ];
    const slots = generateSlots({
      date: toDate("09:00"),
      schedule,
      service: { durationMinutes: 30, bufferAfterMinutes: 0, capacity: 2 },
      existingAppointments: existing,
    });

    // Primeiro slot atinge capacity=2, então excluído
    expect(slots.map((s) => s.start.toISOString())).not.toContain("2024-01-01T09:00:00.000Z");
    expect(slots.map((s) => s.start.toISOString())).toContain("2024-01-01T09:30:00.000Z");
  });

  it("considera reservas bloqueando slots", () => {
    const reserved: Slot[] = [
      { start: toDate("10:00"), end: toDate("10:30") },
    ];
    const slots = generateSlots({
      date: toDate("09:00"),
      schedule,
      service: { durationMinutes: 30, bufferAfterMinutes: 0, capacity: 1 },
      existingReservations: reserved,
    });

    expect(slots.map((s) => s.start.toISOString())).not.toContain("2024-01-01T10:00:00.000Z");
  });

  it("termina antes do fim da janela (não extrapola)", () => {
    const slots = generateSlots({
      date: toDate("09:00"),
      schedule: [{ start: toDate("11:00"), end: toDate("12:00") }],
      service: { durationMinutes: 50, bufferAfterMinutes: 0, capacity: 1 },
    });

    expect(slots.map((s) => s.start.toISOString())).toEqual([
      "2024-01-01T11:00:00.000Z",
    ]);
  });
});
