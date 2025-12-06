import { describe, expect, it } from "vitest";
import { cancelAppointment, completeAppointment, createAppointment, markNoShow } from "../domain/appointment";

const baseCmd = {
  id: "appt-1",
  userId: "u1",
  unitId: "unit-1",
  serviceId: "service-1",
  startAt: new Date("2024-01-01T10:00:00Z"),
  endAt: new Date("2024-01-01T10:30:00Z"),
};

describe("Appointment aggregate", () => {
  it("cria appointment válido", () => {
    const res = createAppointment(baseCmd);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.status).toBe("scheduled");
      expect(res.value.id).toBe(baseCmd.id);
    }
  });

  it("falha se startAt >= endAt", () => {
    const res = createAppointment({ ...baseCmd, startAt: baseCmd.endAt });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("validation_error");
    }
  });

  it("cancela somente quando scheduled", () => {
    const created = createAppointment(baseCmd);
    if (!created.ok) throw new Error("setup failed");
    const cancelled = cancelAppointment(created.value, {});
    expect(cancelled.ok).toBe(true);

    if (cancelled.ok) {
      const fail = cancelAppointment(cancelled.value, {});
      expect(fail.ok).toBe(false);
    }
  });

  it("marca no-show apenas a partir de scheduled", () => {
    const created = createAppointment(baseCmd);
    if (!created.ok) throw new Error("setup failed");
    const noShow = markNoShow(created.value, {});
    expect(noShow.ok).toBe(true);

    if (noShow.ok) {
      const failAgain = markNoShow(noShow.value, {});
      expect(failAgain.ok).toBe(false);
    }
  });

  it("completa apenas a partir de scheduled", () => {
    const created = createAppointment(baseCmd);
    if (!created.ok) throw new Error("setup failed");
    const completed = completeAppointment(created.value, {});
    expect(completed.ok).toBe(true);
    if (completed.ok) {
      const fail = completeAppointment(completed.value, {});
      expect(fail.ok).toBe(false);
    }
  });
});
