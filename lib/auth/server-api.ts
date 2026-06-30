import type {
  AuthResponse,
  MeResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ValidateResetTokenRequest,
  ValidateResetTokenResponse,
} from "@/lib/api/types";
import { getApiBaseUrl } from "@/lib/api/axios-config";
import {
  AuthApiError,
  FetchTimeoutError,
  parseAuthError,
} from "@/lib/auth/auth-api-error";
import { logAuthAuditEvent } from "@/lib/auth/audit-log";
import { fetchWithTimeout } from "@/lib/auth/fetch-with-timeout";

export { AuthApiError, FetchTimeoutError };

async function authFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetchWithTimeout(`${getApiBaseUrl()}${path}`, init);
  } catch (error) {
    if (error instanceof FetchTimeoutError) {
      throw new AuthApiError("Request timed out. Please try again.", 408);
    }
    throw new AuthApiError("Unable to reach the server. Please try again.", 0);
  }
}

export async function loginWithCredentials(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await authFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  return response.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await authFetch("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  return response.json();
}

export async function fetchCurrentUser(
  accessToken: string
): Promise<MeResponse> {
  const response = await authFetch("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  return response.json();
}

export async function requestPasswordReset(email: string): Promise<void> {
  const body: RequestPasswordResetRequest = { email };
  const response = await authFetch("/auth/password/forgot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  logAuthAuditEvent("PASSWORD_RESET_REQUESTED", { email });
}

export async function validateResetToken(token: string): Promise<boolean> {
  const body: ValidateResetTokenRequest = { token };
  const response = await authFetch("/auth/password/reset/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return false;
  }

  const data: ValidateResetTokenResponse = await response.json();
  return data.valid;
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const body: ResetPasswordRequest = { token, newPassword };
  const response = await authFetch("/auth/password/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  logAuthAuditEvent("PASSWORD_RESET_COMPLETED");
}
