# INF-003 – Secrets & Config management

Este projeto usa duas fontes de configuração:
1. Variáveis de ambiente (build/runtime).
2. Secrets em Secret Manager (backend) para credenciais de serviços.

## Schema
O arquivo `config/schema.yaml` define as variáveis obrigatórias e opcionais para app (frontend) e backend. Ajuste conforme novos serviços forem adicionados.

### Frontend (Vite)
- `VITE_API_BASE` (obrigatório): URL base do BFF/Backend.
- `VITE_ENV` (obrigatório): `development|staging|production`.
- `VITE_SENTRY_DSN` (opcional): DSN do Sentry.

### Backend (esperado quando existir)
- `DATABASE_URL`: obtido do Secrets Manager `.../db` (connection_string).
- `REDIS_URL`: obtido do Secrets Manager `.../redis` (usar `rediss://:token@host:port/0`).
- `BROKER_URL`: obtido do Secrets Manager `.../broker` (usar `amqps_url`).
- `OBJECT_BUCKET`: nome do bucket S3.
- `SECRET_MANAGER_PREFIX`: prefixo usado nos secrets (ex: `barber-flow`).
- `PORT` (opcional).

## Validação fail-fast
O frontend valida envs no boot/build:
- Arquivo: `src/config/env.ts` usa Zod para checar `import.meta.env.*`.
- Se faltar variável obrigatória, lança erro e impede o build/start, atendendo ao critério “Missing required env fails fast”.

## Como usar no frontend
1. Crie um arquivo `.env` ou use secrets do CI/CD:
   ```
   VITE_API_BASE=https://api.stg.barberflow.com
   VITE_ENV=staging
   VITE_SENTRY_DSN=https://example.ingest.sentry.io/123
   ```
2. Importe no app onde precisar:
   ```ts
   import { env } from "./config/env";
   fetch(`${env.VITE_API_BASE}/health`);
   ```

## Como usar no backend (quando existir)
1. Faça fetch dos secrets na subida da app (AWS SDK ou injeção via pipeline):
   - Secret `db`: `connection_string`.
   - Secret `redis`: `auth_token`, `primary_host`, `port`.
   - Secret `broker`: `amqps_url`.
2. Mapeie para variáveis de ambiente conforme `config/schema.yaml`.
3. Aplique o mesmo padrão de validação (ex: Zod/Joi) para falhar rápido se algo faltar.

## Boas práticas sugeridas
- Nunca commit arquivos `.env`.
- Use `terraform/` para provisionar os secrets (já criados no INF-001).
- No CI, configure `VITE_API_BASE`, `VITE_ENV` via GitHub Actions secrets. Para staging/prod, injete variáveis no passo de deploy.
