# SEC-001 – Auditoria de segurança

## IAM / Secrets
- Usar política de menor privilégio para CI/CD (deploy apenas no namespace/alvo).
- Rotacionar secrets (DB, Redis, Broker) via Secrets Manager; definir cron de rotação.
- Não versionar `.env`; usar GitHub Secrets + AWS Secrets Manager.

## Scans de dependência
- Executar `npm audit` no CI; falhar em vulnerabilidades high/critical.
- Usar Dependabot ou Renovate.

## Pentest básico (para ser agendado)
- Testar fluxo OTP contra brute-force (rate limit).
- Verificar idempotency e conflitos no booking (409) sem bypass.

## Ações recomendadas
- Criar políticas IAM em `iam/policies` (placeholder) para roles de deploy e worker com apenas as permissões necessárias.
- Configurar rotação automática de tokens/API keys de providers de notificação.
