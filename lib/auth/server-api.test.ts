import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AuthApiError,
  FetchTimeoutError,
} from "@/lib/auth/auth-api-error";

vi.mock("@/lib/auth/audit-log", () => ({
  logAuthAuditEvent: vi.fn(),
}));

vi.mock("@/lib/api/axios-config", () => ({
  getApiBaseUrl: () => "http://api.test/api/v1",
}));

describe("server-api auth calls", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("returns auth response on successful login", async () => {
    const { loginWithCredentials } = await import("@/lib/auth/server-api");

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          accessToken: "access",
          refreshToken: "refresh",
          tokenType: "Bearer",
          expiresIn: 3600,
        }),
        { status: 200 }
      )
    );

    const result = await loginWithCredentials("user@example.com", "secret");
    expect(result.accessToken).toBe("access");
  });

  it("throws AuthApiError on invalid credentials", async () => {
    const { loginWithCredentials } = await import("@/lib/auth/server-api");

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 401,
      })
    );

    await expect(
      loginWithCredentials("user@example.com", "wrong")
    ).rejects.toBeInstanceOf(AuthApiError);
  });

  it("throws timeout error when request aborts", async () => {
    const { loginWithCredentials } = await import("@/lib/auth/server-api");

    vi.mocked(fetch).mockRejectedValueOnce(
      Object.assign(new Error("Aborted"), { name: "AbortError" })
    );

    await expect(
      loginWithCredentials("user@example.com", "secret")
    ).rejects.toMatchObject({ status: 408 });
  });

  it("maps refresh failures to AuthApiError", async () => {
    const { refreshAccessToken } = await import("@/lib/auth/server-api");

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Invalid refresh token" }), {
        status: 401,
      })
    );

    await expect(refreshAccessToken("stale-token")).rejects.toBeInstanceOf(
      AuthApiError
    );
  });
});

describe("auth api errors", () => {
  it("identifies timeout errors", () => {
    expect(new FetchTimeoutError().name).toBe("FetchTimeoutError");
  });
});
