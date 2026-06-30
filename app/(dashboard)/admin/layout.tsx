import type { ReactNode } from "react";
import RequirePermission from "@/components/require-permission";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequirePermission any={["user:read", "role:read", "permission:read"]}>
      {children}
    </RequirePermission>
  );
}
