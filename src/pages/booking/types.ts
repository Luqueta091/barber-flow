export type ViewState = "dashboard" | "booking" | "appointments" | "metrics";

export interface Unit {
  id: string;
  name: string;
  address?: string;
  image?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  description?: string;
  unitId?: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty?: string;
  avatar?: string;
  rating?: number;
}

export interface Slot {
  start: string;
  end: string;
}

export interface Appointment {
  id: string;
  unit: Unit;
  service: Service;
  barber?: Barber;
  startAt: string;
  endAt: string;
  status: "scheduled" | "cancelled" | "completed" | "no_show";
}
