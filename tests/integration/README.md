# QA-001 – Integration/E2E suite

Status: Vitest integrações estão em `integration_tests/` (slots, availability, appointments, events, auth, users, admin, push, bff). Rode com:
```bash
npm test
```

Test data: in-memory stores reset per test; sem dependência externa.

Gap: adicionar DB/Redis reais quando disponíveis e cenários E2E navegando no SPA.***
