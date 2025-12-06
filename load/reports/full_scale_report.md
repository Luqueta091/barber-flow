# LOAD-FULL-001 – Full-scale load test

Status: placeholder; preencher após execução.

Checklist execução:
- [ ] Rodar `k6 run load/k6-lock-book.js` com VUs e duração representativas.
- [ ] Rodar `k6 run load/scenarios/k6_availability.js` para leitura.
- [ ] Coletar métricas: latência P99 (/slots/lock, /appointments, /bff/book), taxa 409, erro 5xx, consumo DB/broker.
- [ ] Registrar mitigação se SLA não atendido.

Resultados:
- Data:
- Config k6:
- P99:
- Erros:
- Bottlenecks:
- Mitigações:
