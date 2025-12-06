# REL-001 – Release checklist

- [ ] CI verde (lint, build, testes, integration).
- [ ] Migrations aplicadas (migrations/001_init.sql, 002_reservations.sql, sql/counters.sql).
- [ ] Secrets configurados (README_config.md).
- [ ] Endpoints principais: /bff/availability, /bff/book, /auth OTP, /users, /admin.
- [ ] Observabilidade: /metrics scrapeado.
- [ ] Deploy canário aplicado e smoke OK (runbook/DEPLOY.md).
- [ ] Notificações/push integradas ao broker (substituir stubs).
