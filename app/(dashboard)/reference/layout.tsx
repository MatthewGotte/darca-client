import type { ReactNode } from "react";
import RequirePermission from "@/components/require-permission";

export default function ReferenceLayout({ children }: { children: ReactNode }) {
  return (
    <RequirePermission any={["category:read", "type:read", "custom_field:read"]}>
      {children}
    </RequirePermission>
  );
}
