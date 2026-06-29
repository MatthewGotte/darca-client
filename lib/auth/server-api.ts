import type {
  AuthResponse,
  MeResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ValidateResetTokenRequest,
  ValidateResetTokenResponse,
} from "@/lib/api/types";
import { getApiBaseUrl } from "@/lib/api/axios-config";

export async function loginWithCredentials(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Invalid email or password");
  }

  return response.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json();
}

export async function fetchCurrentUser(
  accessToken: string
): Promise<MeResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}

export async function requestPasswordReset(email: string): Promise<void> {
  const body: RequestPasswordResetRequest = { email };
  const response = await fetch(`${getApiBaseUrl()}/auth/password/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Something went wrong. Please try again.");
  }
}

export async function validateResetToken(token: string): Promise<boolean> {
  const body: ValidateResetTokenRequest = { token };
  const response = await fetch(`${getApiBaseUrl()}/auth/password/reset/validate`, {
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
  const response = await fetch(`${getApiBaseUrl()}/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Unable to reset password. Please try again.");
  }
}
