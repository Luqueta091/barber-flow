export type Result<T> = { ok: true; value: T } | { ok: false; error: DomainError };

export type DomainErrorCode =
  | "invalid_state"
  | "validation_error";

export type DomainError = {
  code: DomainErrorCode;
  message: string;
};

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err(code: DomainErrorCode, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}
