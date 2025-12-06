# Idempotência e concorrência para CreateAppointment (SCHED-004)

Recomendações DB:
- Constraint única: `(unit_id, service_id, start_at, end_at)` já existe em `appointments` (migrations/001_init.sql).
- Adicionar coluna `idempotency_key` (nullable) com índice único quando presente.
- Constraint em `reservation_token` único em `appointments` para evitar reuso do mesmo lock.

Exemplo SQL:
```sql
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS idempotency_key UUID;
CREATE UNIQUE INDEX IF NOT EXISTS ux_appointments_idempotency ON appointments(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_appointments_reservation_token ON appointments(reservation_id) WHERE reservation_id IS NOT NULL;
```

Fluxo:
1) Cliente envia `idempotencyKey` (UUID) e `reservationToken`.
2) Antes de inserir: checar se já existe `appointments` com `idempotency_key` ou `reservation_token` => retornar 200/idempotent response.
3) Inserção e confirmação de reserva devem ocorrer na mesma transação para evitar double-bookings.
