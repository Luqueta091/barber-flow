export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  startAt: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
}

export interface Block {
  id: string;
  start: string;
  end: string;
  reason: string;
}

export interface Slot {
  id: string;
  start: string;
  end: string;
  state: "free" | "blocked" | "booked";
}
