# DEPLOY-001 – Canary deploy + smoke

1) Build/push imagem (`ghcr.io/<org>/<repo>/web:latest` via CI).
2) Aplicar `deployment/canary.yaml` em staging/prod com label `version: canary`.
3) Monitorar `/metrics` e logs; rodar smoke (ou workflow `deploy-canary.yml`):
   - `node smoke-tests/smoke.js --base-url https://canary.example.com`
4) Promote ou rollback automático (workflow `deploy-canary.yml` já executa rollback se smoke falhar).
