import { ReservationsStore } from "./reservationsStore.js";
import { InMemoryEventPublisher } from "../../events/publisher.js";
import { RabbitPublisher } from "./broker/rabbitPublisher.js";
import { processEvent as notificationsHandler } from "../../workers/notifications/worker.js";

// Singleton stores for demo/integration tests
export const reservationsStore = new ReservationsStore();
const brokerUrl = process.env.RABBITMQ_URL;
const brokerExchange = process.env.EXCHANGE_NAME || "events.fanout";

let publisherInstance: InMemoryEventPublisher | RabbitPublisher;

if (brokerUrl) {
  const rabbit = new RabbitPublisher(brokerUrl, brokerExchange);
  rabbit.init().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Rabbit init failed, falling back to in-memory", err);
  });
  publisherInstance = rabbit;
} else {
  publisherInstance = new InMemoryEventPublisher();
}

publisherInstance.subscribe(notificationsHandler);

export const eventPublisher = publisherInstance;

export type InMemoryAppointment = {
  id: string;
  userId: string;
  unitId: string;
  serviceId: string;
  startAt: Date;
  endAt: Date;
  reservationToken?: string;
  status: "scheduled" | "cancelled" | "completed" | "no_show";
  idempotencyKey?: string;
};

const appointments: InMemoryAppointment[] = [];

export const appointmentStore = {
  add(appt: InMemoryAppointment) {
    appointments.push(appt);
  },
  findByIdempotencyKey(key: string) {
    return appointments.find((a) => a.idempotencyKey === key);
  },
  all() {
    return appointments;
  },
  clear() {
    appointments.length = 0;
  },
};
