import express from "express";
import cors from "cors";
import { lockSlot, releaseSlot } from "./controllers/slots.js";
import { getAvailability } from "./routes/availability.js";
import { createAppointmentHandler, listAppointmentsHandler } from "./routes/appointments.js";
import { requestOtpHandler, verifyOtpHandler } from "./routes/auth.js";
import { createUserHandler, getUserHandler, updateUserHandler, deleteUserHandler, searchUserHandler } from "./routes/users.js";
import { initSchema } from "./db.js";
// inicia o schema assim que o módulo é carregado
export const schemaReady = initSchema().catch((err) => {
  console.error("Failed to init schema", err);
  throw err;
});
import {
  createUnitHandler,
  updateUnitHandler,
  deleteUnitHandler,
  listUnitsHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
  listServicesHandler,
  createBarberHandler,
  updateBarberHandler,
  deleteBarberHandler,
  listBarbersHandler,
} from "./routes/admin.js";
import { subscribePushHandler, listPushHandler } from "./routes/push.js";
import { bffAvailabilityHandler, bffBookHandler } from "./routes/bff.js";
import { metricsHandler } from "./metrics.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  // CORS manual para garantir header mesmo quando o proxy não repassa defaults
  app.use((req, res, next) => {
    // Permite qualquer origem (ambiente controlado/POC). Se precisar restringir, trocar "*" pelos domínios esperados.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });

  app.use(express.json());

  app.post("/slots/lock", lockSlot);
  app.post("/slots/release", releaseSlot);
  // Availability
  app.get("/units/:id/availability", getAvailability);
  app.post("/appointments", createAppointmentHandler);
  app.get("/appointments", listAppointmentsHandler);
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
  app.post("/admin/barbers", createBarberHandler);
  app.get("/admin/barbers", listBarbersHandler);
  app.put("/admin/barbers/:id", updateBarberHandler);
  app.delete("/admin/barbers/:id", deleteBarberHandler);
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
  schemaReady
    .then(() => {
      const app = createApp();
      const port = process.env.PORT ?? 3001;
      app.listen(port, () => {
        console.log(`API listening on ${port}`);
      });
    })
    .catch((err) => {
      console.error("Failed to init schema", err);
      process.exit(1);
    });
}
