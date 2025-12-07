import type { Request, Response } from "express";
import { sseBus } from "../events/bus.js";

export function sseHandler(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const write = (data: string) => res.write(data);
  const unsubscribe = sseBus.subscribe(write);

  req.on("close", () => {
    unsubscribe();
  });
}
