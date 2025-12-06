import express from "express";
import { lockSlot, releaseSlot } from "./controllers/slots.js";
import { getAvailability } from "./routes/availability.js";
import { createAppointmentHandler } from "./routes/appointments.js";
import { requestOtpHandler, verifyOtpHandler } from "./routes/auth.js";
import { createUserHandler, getUserHandler, updateUserHandler, deleteUserHandler, searchUserHandler } from "./routes/users.js";
import {
  createUnitHandler,
  updateUnitHandler,
  deleteUnitHandler,
  listUnitsHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
  listServicesHandler,
} from "./routes/admin.js";
import { subscribePushHandler, listPushHandler } from "./routes/push.js";
import { bffAvailabilityHandler, bffBookHandler } from "./routes/bff.js";
import { metricsHandler } from "./metrics.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.post("/slots/lock", lockSlot);
  app.post("/slots/release", releaseSlot);
  // Availability
  app.get("/units/:id/availability", getAvailability);
  app.post("/appointments", createAppointmentHandler);
  app.post("/auth/request-otp", requestOtpHandler);
  app.post("/auth/verify-otp", verifyOtpHandler);
  // Users
  app.post("/users", createUserHandler);
  app.get("/users/:id", getUserHandler);
  app.put("/users/:id", updateUserHandler);
  app.delete("/users/:id", deleteUserHandler);
  app.get("/users", searchUserHandler);
  // Admin
  app.post("/admin/units", createUnitHandler);
  app.get("/admin/units", listUnitsHandler);
  app.put("/admin/units/:id", updateUnitHandler);
  app.delete("/admin/units/:id", deleteUnitHandler);
  app.post("/admin/services", createServiceHandler);
  app.get("/admin/services", listServicesHandler);
  app.put("/admin/services/:id", updateServiceHandler);
  app.delete("/admin/services/:id", deleteServiceHandler);
  // Push subscriptions
  app.post("/push/subscribe", subscribePushHandler);
  app.get("/push/subscriptions", listPushHandler);
  // BFF
  app.get("/bff/availability", bffAvailabilityHandler);
  app.post("/bff/book", bffBookHandler);
  app.get("/metrics", metricsHandler);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  return app;
}

// Allow running standalone: node dist/server/app.js
if (process.env.START_SERVER === "true") {
  const app = createApp();
  const port = process.env.PORT ?? 3001;
  app.listen(port, () => {
    console.log(`API listening on ${port}`);
  });
}
