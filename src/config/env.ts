import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE: z.string().min(1, "VITE_API_BASE é obrigatório"),
  VITE_ENV: z.enum(["development", "staging", "production"]),
  VITE_SENTRY_DSN: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  VITE_API_BASE: import.meta.env.VITE_API_BASE,
  VITE_ENV: import.meta.env.VITE_ENV,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
});

if (!parsed.success) {
  const formatted = parsed.error.format();
  // Fail fast during build/boot to avoid silent misconfig
  throw new Error(`Config validation failed: ${JSON.stringify(formatted, null, 2)}`);
}

export const env = parsed.data;
