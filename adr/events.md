# ADR: Publicação de eventos de domínio

- Cada evento usa `version: "v1"` e `type` descritivo (ex: `AppointmentCreated`).
- Payload deve conter IDs e dados mínimos para consumidores (ex: notification worker).
- Publisher é injetável; default é in-memory para testes. Em prod, substituir por broker (RabbitMQ/Kafka).
- ID de evento: UUID v4; `occurredAt`: ISO8601.
