export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(params: { message: string; code?: ErrorCode; status?: number; details?: unknown }) {
    super(params.message);
    this.code = params.code ?? "INTERNAL";
    this.status = params.status ?? 500;
    this.details = params.details;
  }
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: AppError };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err(message: string, code: ErrorCode = "INTERNAL", status = 500, details?: unknown): Result<never> {
  return { ok: false, error: new AppError({ message, code, status, details }) };
}
