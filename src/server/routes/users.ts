import type { Request, Response } from "express";
import { z } from "zod";
import { userStore } from "../userStore.js";

const createSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(8).optional(),
  email: z.string().email().optional(),
});

const updateSchema = createSchema.partial();

export function createUserHandler(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_payload" });
  }
  const user = userStore.create(parsed.data);
  return res.status(201).json(user);
}

export function getUserHandler(req: Request, res: Response) {
  const user = userStore.get(req.params.id);
  if (!user) return res.status(404).json({ error: "not_found" });
  return res.json(user);
}

export function updateUserHandler(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_payload" });

  const updated = userStore.update(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: "not_found" });
  return res.json(updated);
}

export function deleteUserHandler(req: Request, res: Response) {
  const ok = userStore.delete(req.params.id);
  if (!ok) return res.status(404).json({ error: "not_found" });
  return res.status(204).send();
}

export function searchUserHandler(req: Request, res: Response) {
  const parsed = z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
    })
    .safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "invalid_query" });

  const results = userStore.search(parsed.data);
  return res.json({ data: results });
}
