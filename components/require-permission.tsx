"use client";

import type { ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";
import type { PermissionCode } from "@/lib/auth/permissions";
import PermissionDenied from "./permission-denied";

type RequirePermissionProps = {
  children: ReactNode;
  fallback?: ReactNode;
} & (
  | { permission: PermissionCode; any?: never; all?: never }
  | { any: PermissionCode[]; permission?: never; all?: never }
  | { all: PermissionCode[]; permission?: never; any?: never }
);

export default function RequirePermission({
  children,
  permission,
  any,
  all,
  fallback,
}: RequirePermissionProps) {
  const { has, hasAny, hasAll } = usePermission();

  let allowed = false;
  if (permission) allowed = has(permission);
  else if (any) allowed = hasAny(any);
  else if (all) allowed = hasAll(all);

  if (!allowed) {
    return fallback !== undefined ? <>{fallback}</> : <PermissionDenied />;
  }

  return <>{children}</>;
}
