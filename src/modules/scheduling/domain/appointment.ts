import { err, ok, type Result } from "./result.js";

export type AppointmentStatus = "scheduled" | "cancelled" | "completed" | "no_show";

export type Appointment = {
  id: string;
  userId: string;
  unitId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  status: AppointmentStatus;
  reservationToken?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAppointmentCommand = {
  id: string;
  userId: string;
  unitId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  reservationToken?: string;
};

export type CancelAppointmentCommand = {
  reason?: string;
};

export type CompleteAppointmentCommand = {
  notes?: string;
};

export type NoShowAppointmentCommand = {
  notes?: string;
};

function validateTimes(startAt: Date, endAt: Date): Result<void> {
  if (!(startAt instanceof Date) || !(endAt instanceof Date) || Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    return err("validation_error", "startAt/endAt must be valid dates");
  }
  if (startAt >= endAt) {
    return err("validation_error", "startAt must be before endAt");
  }
  return ok(undefined);
}

export function createAppointment(cmd: CreateAppointmentCommand): Result<Appointment> {
  const validation = validateTimes(cmd.startAt, cmd.endAt);
  if (!validation.ok) return validation;

  return ok({
    id: cmd.id,
    userId: cmd.userId,
    unitId: cmd.unitId,
    serviceId: cmd.serviceId,
    startAt: cmd.startAt,
    endAt: cmd.endAt,
    reservationToken: cmd.reservationToken,
    status: "scheduled",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export function cancelAppointment(appt: Appointment, _cmd: CancelAppointmentCommand = {}): Result<Appointment> {
  if (appt.status !== "scheduled") {
    return err("invalid_state", `cannot cancel from status ${appt.status}`);
  }
  return ok({
    ...appt,
    status: "cancelled",
    updatedAt: new Date(),
  });
}

export function completeAppointment(appt: Appointment, _cmd: CompleteAppointmentCommand = {}): Result<Appointment> {
  if (appt.status !== "scheduled") {
    return err("invalid_state", `cannot complete from status ${appt.status}`);
  }
  return ok({
    ...appt,
    status: "completed",
    updatedAt: new Date(),
  });
}

export function markNoShow(appt: Appointment, _cmd: NoShowAppointmentCommand = {}): Result<Appointment> {
  if (appt.status !== "scheduled") {
    return err("invalid_state", `cannot mark no_show from status ${appt.status}`);
  }
  return ok({
    ...appt,
    status: "no_show",
    updatedAt: new Date(),
  });
}
