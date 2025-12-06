# Deployment scripts

Este diretório contém artefatos para CI/CD:

- `Dockerfile`: constrói imagem estática da SPA (Nginx servindo `/usr/share/nginx/html`).
- GitHub Actions (`.github/workflows/ci.yml`) usa essa imagem para publicar em `ghcr.io/<org>/<repo>/web:latest`.
- Deploy de staging via S3 (bucket definido em `STAGING_BUCKET`).

## Variáveis/Secrets esperados no GitHub Actions
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`: credenciais com permissão de escrever no bucket de staging (e CloudFront se usar).
- `STAGING_BUCKET`: nome do bucket S3 de staging.
- `CLOUDFRONT_DISTRIBUTION_ID` (opcional): se quiser invalidar cache após deploy.

## Fluxo
1. PR: roda lint + build, publica artefato `web-dist`.
2. Push em `main`: repete lint/build, builda/pusha imagem para GHCR (`web:latest`), baixa artefato e faz sync para S3 de staging; opcionalmente invalida CloudFront.
