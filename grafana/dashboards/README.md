# OBS-001 – Observabilidade

- Métricas expostas em `/metrics` (Prometheus format), combinando métricas default + cache hit/miss.
- Configure Prometheus para fazer scrape do serviço e importe no Grafana.
- Dashboards sugeridos: latência HTTP, taxa de erro, cache hit/miss.
