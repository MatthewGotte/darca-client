import { describe, expect, it } from "vitest";
import {
  createRefreshFailedToken,
  isTokenExpired,
} from "@/lib/auth/token-session";
import type { AuthJwt } from "@/lib/auth/types";

describe("token session helpers", () => {
  it("detects expired tokens within the refresh buffer", () => {
    const expired = Date.now() - 1_000;
    const valid = Date.now() + 5 * 60_000;

    expect(isTokenExpired(expired)).toBe(true);
    expect(isTokenExpired(valid)).toBe(false);
  });

  it("clears credentials when refresh fails", () => {
    const token: AuthJwt = {
      id: "user-1",
      email: "user@example.com",
      accessToken: "access",
      refreshToken: "refresh",
      accessTokenExpires: Date.now() - 1_000,
      roles: ["ADMIN"],
      permissions: ["users:read"],
    };

    const failed = createRefreshFailedToken(token);

    expect(failed.error).toBe("RefreshAccessTokenError");
    expect(failed.accessToken).toBeUndefined();
    expect(failed.refreshToken).toBeUndefined();
    expect(failed.roles).toEqual([]);
    expect(failed.permissions).toEqual([]);
    expect(failed.id).toBe("user-1");
  });
});
