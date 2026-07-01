import type { TabsProps } from "antd";
import type { PermissionCode } from "@/lib/auth/permissions";

export type PermissionTabDef = NonNullable<TabsProps["items"]>[number] & {
  permission?: PermissionCode;
  any?: PermissionCode[];
};

export function filterTabsByPermission(
  tabs: PermissionTabDef[],
  has: (permission: PermissionCode) => boolean,
  hasAny: (permissions: PermissionCode[]) => boolean
): NonNullable<TabsProps["items"]> {
  return tabs
    .filter((tab) => {
      if (tab.permission) return has(tab.permission);
      if (tab.any) return hasAny(tab.any);
      return true;
    })
    .map(({ permission: _permission, any: _any, ...tab }) => tab);
}
