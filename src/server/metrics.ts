import type { Request, Response } from "express";
import client, { Registry, collectDefaultMetrics } from "prom-client";
import { getCacheRegistry } from "../modules/availability/cache/metrics.js";

const registry = new Registry();
collectDefaultMetrics({ register: registry });

// Merge other registries (cache)
export async function metricsHandler(_req: Request, res: Response) {
  const cacheRegistry = getCacheRegistry();
  const merged = Registry.merge([registry, cacheRegistry]);
  res.setHeader("Content-Type", merged.contentType);
  res.end(await merged.metrics());
}

export { registry as appRegistry, client as promClient };
