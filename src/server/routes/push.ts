import type { Request, Response } from "express";
import { z } from "zod";
import { pushStore } from "../pushStore.js";

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z
    .object({
      p256dh: z.string(),
      auth: z.string(),
    })
    .optional(),
  userId: z.string().optional(),
});

export function subscribePushHandler(req: Request, res: Response) {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });
  const saved = pushStore.save(parsed.data);
  return res.status(201).json(saved);
}

export function listPushHandler(req: Request, res: Response) {
  const userId = req.query.userId as string | undefined;
  return res.json({ data: pushStore.listForUser(userId) });
}
