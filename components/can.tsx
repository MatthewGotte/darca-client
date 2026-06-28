"use client";

import type { ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";
import type { PermissionCode } from "@/lib/auth/permissions";

type CanProps = {
  permission?: PermissionCode;
  any?: PermissionCode[];
  all?: PermissionCode[];
  children: ReactNode;
  fallback?: ReactNode;
};

export default function Can({
  permission,
  any,
  all,
  children,
  fallback = null,
}: CanProps) {
  const { has, hasAny, hasAll } = usePermission();

  let allowed = false;

  if (permission) {
    allowed = has(permission);
  } else if (any) {
    allowed = hasAny(any);
  } else if (all) {
    allowed = hasAll(all);
  }

  return allowed ? children : fallback;
}
