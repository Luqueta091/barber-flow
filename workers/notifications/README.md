# NOTIF-INT-001/002 – Worker e integrações

## Broker (RabbitMQ)
- Config em `broker/config/rabbitmq.md`.
- Publisher: `src/server/broker/rabbitPublisher.ts` (usa env `RABBITMQ_URL`, `EXCHANGE_NAME`).
- Consumer: `workers/notifications/rabbitConsumer.ts` (queue + DLQ).
- In-memory fallback se env não setado.

## Fluxo
1) `eventPublisher` publica `AppointmentCreated` no exchange.
2) Consumer processa via `processEvent` (enfileira Reminder).
3) Para produção, trocar `enqueueNotification` por publicação em fila de jobs e implementar delivery real (push/email/SMS).

## Providers (NOTIF-INT-002)
- Adicionar `notification/providers/` com client do provider real.
- Implementar retries exponenciais e fallback; jobs que excederem retries vão para DLQ (`notifications.dlq`).
