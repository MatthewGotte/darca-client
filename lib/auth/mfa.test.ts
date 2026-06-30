import { describe, expect, it } from "vitest";
import {
  isMfaVerificationPending,
  shouldRequireMfa,
} from "@/lib/auth/mfa";

describe("mfa helpers", () => {
  it("flags sensitive roles for future MFA enforcement", () => {
    expect(shouldRequireMfa(["ORG_ADMIN"])).toBe(true);
    expect(shouldRequireMfa(["VIEWER"])).toBe(false);
  });

  it("does not block sign-in until MFA is implemented", () => {
    expect(isMfaVerificationPending()).toBe(false);
  });
});
