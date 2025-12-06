# E2E-EXT-001 – E2E de falha

- Testes em `tests/e2e/failure_scenarios.test.ts` (Vitest/supertest) cobrem:
  - Booking com token inválido/expirado (409).
  - Booking com broker falho (simulado) para garantir que não exploda catastroficamente.
- Rodar junto com `npm test` (já incluído pelo glob do Vitest).
- Gap: ainda não há automação de UI; para fluxo completo com SPA, usar Playwright/Cypress apontando para `/demo-booking` e simular expirations.***
