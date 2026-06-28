"use client";

import { useAuth } from "@/hooks/use-auth";
import type { PermissionCode } from "@/lib/auth/permissions";

export function usePermission() {
  const { permissions } = useAuth();
  const permissionSet = new Set(permissions);

  return {
    permissions,
    has: (permission: PermissionCode) => permissionSet.has(permission),
    hasAny: (codes: PermissionCode[]) =>
      codes.some((code) => permissionSet.has(code)),
    hasAll: (codes: PermissionCode[]) =>
      codes.every((code) => permissionSet.has(code)),
  };
}
