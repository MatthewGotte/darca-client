import { describe, expect, it } from "vitest";
import { matchKey } from "./swr";

describe("matchKey", () => {
  it("matches keys with the same prefix length", () => {
    const matcher = matchKey(["organisation", "org-1", "roles"]);
    expect(matcher(["organisation", "org-1", "roles"])).toBe(true);
  });

  it("matches longer keys when the prefix is shorter", () => {
    const matcher = matchKey(["organisation", "org-1", "users"]);
    expect(
      matcher(["organisation", "org-1", "users", { includeDecommissioned: false }])
    ).toBe(true);
    expect(
      matcher(["organisation", "org-1", "users", { includeDecommissioned: true }])
    ).toBe(true);
  });

  it("treats object segments in the prefix as filter wildcards", () => {
    const matcher = matchKey(["organisation", "org-1", "users", {}]);
    expect(
      matcher(["organisation", "org-1", "users", { includeDecommissioned: false }])
    ).toBe(true);
  });

  it("does not match different resource keys", () => {
    const matcher = matchKey(["organisation", "org-1", "users"]);
    expect(matcher(["organisation", "org-1", "roles"])).toBe(false);
  });

  it("does not match non-array keys", () => {
    const matcher = matchKey(["organisation", "org-1", "users"]);
    expect(matcher("organisation")).toBe(false);
  });
});
