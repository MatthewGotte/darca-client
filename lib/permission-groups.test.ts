import { describe, expect, it } from "vitest";
import { groupPermissionsByDomain } from "@/lib/permission-groups";
import { PERMISSIONS } from "@/lib/auth/permissions";

describe("groupPermissionsByDomain", () => {
  it("groups permissions by domain prefix", () => {
    const groups = groupPermissionsByDomain([
      PERMISSIONS.ASSET_READ,
      PERMISSIONS.JOB_READ,
      PERMISSIONS.USER_READ,
    ]);

    expect(groups).toHaveLength(3);
    expect(groups.find((g) => g.domain === "Assets")?.permissions).toContain(
      PERMISSIONS.ASSET_READ
    );
  });
});
