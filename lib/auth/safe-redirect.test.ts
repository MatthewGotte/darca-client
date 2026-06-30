import { describe, expect, it } from "vitest";
import { getSafeCallbackUrl } from "@/lib/auth/safe-redirect";

const BASE_URL = "https://app.darca.co.za";

describe("getSafeCallbackUrl", () => {
  it("returns default for empty values", () => {
    expect(getSafeCallbackUrl(undefined)).toBe("/");
    expect(getSafeCallbackUrl(null)).toBe("/");
    expect(getSafeCallbackUrl("")).toBe("/");
    expect(getSafeCallbackUrl("   ")).toBe("/");
  });

  it("allows same-origin relative paths", () => {
    expect(getSafeCallbackUrl("/assets")).toBe("/assets");
    expect(getSafeCallbackUrl("/settings?tab=security")).toBe(
      "/settings?tab=security"
    );
  });

  it("blocks open redirects to external domains", () => {
    expect(getSafeCallbackUrl("https://evil.com/phish")).toBe("/");
    expect(getSafeCallbackUrl("//evil.com/phish")).toBe("/");
    expect(getSafeCallbackUrl("http://evil.com")).toBe("/");
  });

  it("blocks auth-page redirect loops", () => {
    expect(getSafeCallbackUrl("/login")).toBe("/");
    expect(getSafeCallbackUrl("/login?callbackUrl=/")).toBe("/");
    expect(getSafeCallbackUrl("/forgot-password")).toBe("/");
    expect(getSafeCallbackUrl("/reset-password?token=abc")).toBe("/");
  });

  it("validates full same-origin URLs when baseUrl is provided", () => {
    expect(getSafeCallbackUrl("/dashboard", BASE_URL)).toBe("/dashboard");
    expect(getSafeCallbackUrl("https://app.darca.co.za/jobs", BASE_URL)).toBe(
      "/jobs"
    );
    expect(
      getSafeCallbackUrl("https://evil.com/steal", BASE_URL)
    ).toBe("/");
  });

  it("rejects non-path relative values", () => {
    expect(getSafeCallbackUrl("assets")).toBe("/");
    expect(getSafeCallbackUrl("javascript:alert(1)")).toBe("/");
  });
});
