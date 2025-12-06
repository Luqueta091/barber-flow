# OBS-ALERT-001 – SLOs e dashboards

KPIs/SLOs sugeridos:
- P99 /bff/book < 1s; taxa de erro < 1% (5xx).
- Conflitos de slot: monitorar 409 rate e SLA de <2% em carga normal.
- Worker notificações: jobs pendentes < threshold, tempo de fila < 1 min.
- Cache hit rate > 80% para disponibilidade.

Dashboards (Grafana):
- Latência e erro por rota (`http_request_duration_seconds`, `http_requests_total`).
- Cache hits/misses (`availability_cache_requests_total`).
- Filas (RabbitMQ): mensagens prontas/pendentes, DLQ depth.
- Worker jobs processados e falhas.

Alertas: ver `alerts/rules.yaml`.

Tracing: habilitar propagação de trace/span IDs via middleware (a implementar) e exportar para coletor (ex: OTLP).***
