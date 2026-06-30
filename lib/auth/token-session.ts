import type { AuthJwt } from "@/lib/auth/types";

/** Strip credentials from the JWT when refresh fails so the session cannot be reused. */
export function createRefreshFailedToken(token: AuthJwt): AuthJwt {
  return {
    id: token.id,
    email: token.email,
    error: "RefreshAccessTokenError",
    accessToken: undefined,
    refreshToken: undefined,
    accessTokenExpires: undefined,
    roles: [],
    permissions: [],
  };
}

export function isTokenExpired(
  accessTokenExpires: number | undefined,
  bufferMs = 60_000
): boolean {
  return Date.now() >= (accessTokenExpires ?? 0) - bufferMs;
}
