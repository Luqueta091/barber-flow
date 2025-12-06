import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from "prom-client";
import type { IncomingMessage, ServerResponse } from "http";

export type Metrics = {
  registry: Registry;
  httpRequests: Histogram<string>;
};

export function createMetrics(serviceName: string): Metrics {
  const registry = new Registry();
  registry.setDefaultLabels({ service: serviceName });
  collectDefaultMetrics({ register: registry });

  const httpRequests = new Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "path", "status"] as const,
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [registry],
  });

  return { registry, httpRequests };
}

export function metricsHandler(registry: Registry) {
  return async (_req: IncomingMessage, res: ServerResponse) => {
    try {
      const body = await registry.metrics();
      res.statusCode = 200;
      res.setHeader("Content-Type", registry.contentType);
      res.end(body);
    } catch (error) {
      res.statusCode = 500;
      res.end(String(error));
    }
  };
}

export function trackRequest(
  metrics: Metrics,
  info: { method: string; path: string; status: number; durationSeconds: number },
) {
  metrics.httpRequests.labels(info.method, info.path, String(info.status)).observe(info.durationSeconds);
}

export { Counter, Gauge, Histogram, Registry };
