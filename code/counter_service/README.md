# Counter service (AVA-004)

Artefatos:
- SQL: `sql/counters.sql` cria `slot_counters` e funções `increment_slot_counter` / `decrement_slot_counter` com upsert e checagem de capacidade.
- Código: `src/modules/availability/counter/counterService.ts` expõe interface `CounterService` e implementação `InMemoryCounterService` (para dev/test). Uma implementação real deve chamar o SQL.
- Testes: `src/modules/availability/counter/counterService.test.ts` valida capacidade, decremento e isolamento por janela.

## Fluxo recomendado (Postgres)
- Na criação do slot, chame `increment_slot_counter(...)` com `capacity` da agenda/serviço. A função retorna boolean (TRUE se reservou, FALSE se capacity atingida). Use dentro de transação junto com criação de reserva/appointment.
- Em cancelamento ou expiração, chame `decrement_slot_counter(...)`.

## Integração com Node
Use `pg` ou ORM para invocar as funções. Exemplo (pseudo):
```ts
const ok = await db.oneOrNone("SELECT increment_slot_counter($1,$2,$3,$4,$5,$6) AS ok", [
  unitId, serviceId, windowStart, windowEnd, capacity, 1,
]);
if (!ok?.ok) throw new Error("capacity_reached");
```
