import { describe, expect, it } from "vitest";
import {
  getInvalidCredentialsAlert,
  getLockoutAlert,
  formatRetryDuration,
} from "@/lib/auth/login-rate-limit-messages";

describe("login rate limit messages", () => {
  it("formats short and long retry durations", () => {
    expect(formatRetryDuration(45)).toBe("45 seconds");
    expect(formatRetryDuration(60)).toBe("1 minute");
    expect(formatRetryDuration(125)).toBe("3 minutes");
  });

  it("explains lockout clearly", () => {
    const alert = getLockoutAlert(10 * 60);
    expect(alert.message).toBe("Sign-in temporarily locked");
    expect(alert.description).toContain("5 incorrect password attempts");
    expect(alert.description).toContain("10 minutes");
  });

  it("warns when attempts are running low", () => {
    const alert = getInvalidCredentialsAlert(1);
    expect(alert.description).toContain("One more failed attempt");
  });
});
