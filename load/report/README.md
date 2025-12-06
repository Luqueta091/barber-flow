# LOAD-001 – Load testing

- Cenário exemplo k6: `load/scenarios/k6_availability.js` (GET /bff/availability).
- Rodar: `BASE_URL=http://localhost:3000 k6 run load/scenarios/k6_availability.js`
- SLA: ajustar thresholds (p99 < X ms) antes de rodar em staging.

## LOAD-002 (full-scale)
- Cenário lock+booking: `load/k6-lock-book.js` (faz POST /slots/lock e /appointments).
- Rodar: `BASE_URL=http://localhost:3000 k6 run load/k6-lock-book.js`
- Monitore: P99 /slots/lock e /appointments, taxa 409 (conflitos), erro 5xx, depth da fila de notificações.
