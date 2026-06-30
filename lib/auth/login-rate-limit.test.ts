import { afterEach, describe, expect, it } from "vitest";
import {
  checkLoginRateLimit,
  getLoginAttemptStatus,
  recordLoginFailure,
  recordLoginSuccess,
  resetLoginRateLimitStore,
} from "@/lib/auth/login-rate-limit";

describe("login rate limit", () => {
  afterEach(() => {
    resetLoginRateLimitStore();
  });

  it("allows login when no failures recorded", () => {
    expect(checkLoginRateLimit("user@example.com")).toEqual({ allowed: true });
  });

  it("locks out after repeated failures", () => {
    const email = "locked@example.com";

    for (let i = 0; i < 5; i += 1) {
      recordLoginFailure(email);
    }

    const result = checkLoginRateLimit(email);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);

    const status = getLoginAttemptStatus(email);
    expect(status.locked).toBe(true);
    expect(status.attemptsRemaining).toBe(0);
  });

  it("clears failures after successful login", () => {
    const email = "recover@example.com";

    recordLoginFailure(email);
    recordLoginFailure(email);
    recordLoginSuccess(email);

    expect(checkLoginRateLimit(email)).toEqual({ allowed: true });
  });

  it("normalizes email casing for tracking", () => {
    recordLoginFailure("User@Example.com");
    recordLoginFailure("user@example.com");
    recordLoginFailure("USER@EXAMPLE.COM");
    recordLoginFailure("user@example.com");
    recordLoginFailure("user@example.com");

    expect(checkLoginRateLimit("user@example.com").allowed).toBe(false);
  });
});
