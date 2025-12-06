import pino, { LoggerOptions } from "pino";
import { randomUUID } from "uuid";

export type Logger = pino.Logger;

export type LoggerConfig = {
  serviceName: string;
  level?: LoggerOptions["level"];
};

const defaultConfig: LoggerConfig = {
  serviceName: "app",
  level: process.env.LOG_LEVEL as LoggerOptions["level"] ?? "info",
};

export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  const resolved = { ...defaultConfig, ...config };

  return pino({
    level: resolved.level,
    base: { service: resolved.serviceName },
    timestamp: pino.stdTimeFunctions.isoTime,
    messageKey: "message",
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  });
}

export const logger = createLogger();

export function withRequestContext(
  baseLogger: Logger,
  context: { requestId?: string; userId?: string; path?: string },
): Logger {
  return baseLogger.child({
    requestId: context.requestId ?? randomUUID(),
    userId: context.userId,
    path: context.path,
  });
}
