export class AuthApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
  }
}

export class FetchTimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "FetchTimeoutError";
  }
}

export async function parseAuthError(response: Response): Promise<AuthApiError> {
  const body = await response.json().catch(() => null);
  const message =
    (typeof body?.message === "string" && body.message) ||
    (typeof body?.detail === "string" && body.detail) ||
    defaultMessageForStatus(response.status);

  const code = typeof body?.code === "string" ? body.code : undefined;
  return new AuthApiError(message, response.status, code);
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 401:
      return "Invalid email or password";
    case 429:
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
