# ER Diagram (inicial)

ASCII simplificado do modelo inicial (DB-001):

```
users (id PK) ─┐
               ├─< appointments >─ services >─ units
reservations >─┘                   ^
                                   \
                                   unit_schedules
```

Detalhes:
- `users`: clientes.
- `units`: unidades físicas.
- `services`: serviços ofertados por unidade (duração, buffer, capacidade).
- `unit_schedules`: janela de atendimento por dia da semana.
- `appointments`: agendamentos confirmados (status enum).
- `reservations`: locks temporários (status enum) que serão usados nos fluxos de disponibilidade.

Chaves/relacionamentos:
- `services.unit_id` → `units.id` (CASCADE).
- `unit_schedules.unit_id` → `units.id` (CASCADE, unique por weekday).
- `appointments`: FK para `users`, `units`, `services`; `reservation_id` deixado para vincular à tabela `reservations`.
- `reservations`: FK para `units`, `services`, `users` opcional.

Índices:
- `appointments (unit_id, start_at, end_at)` para consultas de conflito/agenda.
- `reservations (unit_id, lock_expires_at)` para expiração/cleanup.
