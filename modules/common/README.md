# @barber-flow/common

Módulo compartilhado para serviços backend:
- Logging estruturado (Pino) com contexto de request.
- Erros padronizados (`AppError`, helpers `ok/err`).
- Métricas com Prometheus (`/metrics` handler e histograma HTTP).

## Instalação
Dentro do serviço backend:
```bash
npm install @barber-flow/common
```
(ou adicione como dependency local se estiver no mesmo monorepo).

## Uso rápido
```ts
import http from "node:http";
import { createLogger, withRequestContext, createMetrics, metricsHandler, trackRequest, err, ok } from "@barber-flow/common";

const logger = createLogger({ serviceName: "api" });
const metrics = createMetrics("api");

const server = http.createServer(async (req, res) => {
  const start = process.hrtime.bigint();
  const reqLogger = withRequestContext(logger, { path: req.url ?? "" });

  try {
    if (req.url === "/metrics") {
      return metricsHandler(metrics.registry)(req, res);
    }

    reqLogger.info({ method: req.method, path: req.url }, "request_received");
    res.statusCode = 200;
    res.end(JSON.stringify(ok({ hello: "world" })));
  } catch (e) {
    const appErr = e instanceof Error ? e : new Error("unknown");
    reqLogger.error({ err: appErr }, "request_failed");
    res.statusCode = 500;
    res.end(JSON.stringify(err("internal_error").error));
  } finally {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    trackRequest(metrics, {
      method: req.method ?? "GET",
      path: req.url ?? "/",
      status: res.statusCode,
      durationSeconds,
    });
  }
});

server.listen(process.env.PORT ?? 3000, () => {
  logger.info("listening");
});
```

## Design
- **Logging**: `createLogger` gera logger Pino com rótulo `service`. `withRequestContext` anexa `requestId`/`userId`/`path`.
- **Erros**: `AppError` carrega `code` e `status` HTTP. Helpers `ok/err` padronizam Result-pattern.
- **Métricas**: `createMetrics` registra métricas padrão e histograma HTTP; `metricsHandler` serve `/metrics`; `trackRequest` facilita registro de duração.

## Requisitos de runtime
- Node 18+.
- Expor `/metrics` via `metricsHandler` para atender ao critério de observabilidade.
