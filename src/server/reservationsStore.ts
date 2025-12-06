import { v4 as uuid } from "uuid";

export type ReservationStatus = "locked" | "released" | "expired" | "confirmed";

export type Reservation = {
  token: string;
  unitId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  expiresAt: Date;
  status: ReservationStatus;
};

type LockInput = {
  unitId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  ttlSeconds: number;
};

// In-memory store with TTL cleanup for demo/testing purposes
export class ReservationsStore {
  private reservations = new Map<string, Reservation>();

  lock(input: LockInput): Reservation {
    this.cleanupExpired();
    this.assertNoConflict(input);

    const token = uuid();
    const now = Date.now();
    const expiresAt = new Date(now + input.ttlSeconds * 1000);

    const reservation: Reservation = {
      token,
      unitId: input.unitId,
      serviceId: input.serviceId,
      startAt: input.startAt,
      endAt: input.endAt,
      expiresAt,
      status: "locked",
    };

    this.reservations.set(token, reservation);
    return reservation;
  }

  release(token: string) {
    const resv = this.reservations.get(token);
    if (resv) {
      resv.status = "released";
      this.reservations.set(token, resv);
    }
  }

  getActive(token: string): Reservation | null {
    const resv = this.reservations.get(token);
    if (!resv) return null;
    if (resv.status !== "locked") return null;
    if (resv.expiresAt <= new Date()) return null;
    return resv;
  }

  confirm(token: string): Reservation | null {
    const resv = this.getActive(token);
    if (!resv) return null;
    resv.status = "confirmed";
    this.reservations.set(token, resv);
    return resv;
  }

  expireAndCollect(): Reservation[] {
    const now = new Date();
    const expired: Reservation[] = [];
    for (const [token, resv] of this.reservations.entries()) {
      if (resv.expiresAt <= now && resv.status === "locked") {
        resv.status = "expired";
        expired.push(resv);
        this.reservations.delete(token);
      }
      if (resv.status === "released") {
        this.reservations.delete(token);
      }
    }
    return expired;
  }

  getActiveBySlot(unitId: string, serviceId: string, startAt: Date, endAt: Date): Reservation[] {
    this.cleanupExpired();
    return Array.from(this.reservations.values()).filter(
      (r) =>
        r.unitId === unitId &&
        r.serviceId === serviceId &&
        r.status === "locked" &&
        r.expiresAt > new Date() &&
        overlaps({ start: r.startAt, end: r.endAt }, { start: startAt, end: endAt }),
    );
  }

  private assertNoConflict(input: LockInput) {
    const conflicts = this.getActiveBySlot(input.unitId, input.serviceId, input.startAt, input.endAt);
    if (conflicts.length > 0) {
      const err = new Error("slot_conflict");
      // @ts-expect-error attach status for controller
      err.status = 409;
      throw err;
    }
  }

  private cleanupExpired() {
    const now = new Date();
    for (const [token, resv] of this.reservations.entries()) {
      if (resv.expiresAt <= now || resv.status === "released") {
        this.reservations.delete(token);
      }
    }
  }
}

export function overlaps(a: { start: Date; end: Date }, b: { start: Date; end: Date }): boolean {
  return a.start < b.end && b.start < a.end;
}
