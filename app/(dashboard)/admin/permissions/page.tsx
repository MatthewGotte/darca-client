"use client";

import { Collapse, Flex, Skeleton, Typography } from "antd";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import RequirePermission from "@/components/require-permission";
import { usePermissions } from "@/hooks/data/use-rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export default function PermissionsPage() {
  const { data: groups, isLoading } = usePermissions();

  const collapseItems = (groups ?? [])
    .slice()
    .sort((a, b) => (a.group ?? "").localeCompare(b.group ?? ""))
    .map((group) => ({
      key: group.group ?? "ungrouped",
      label: <Typography.Text strong>{group.group ?? "Ungrouped"}</Typography.Text>,
      children: (
        <Flex vertical>
          {(group.permissions ?? [])
            .slice()
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map((perm) => (
              <Flex
                key={perm.name}
                vertical
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography.Text strong>{perm.name}</Typography.Text>
                {perm.description ? (
                  <Typography.Text type="secondary">{perm.description}</Typography.Text>
                ) : null}
              </Flex>
            ))}
        </Flex>
      ),
    }));

  return (
    <RequirePermission permission={PERMISSIONS.PERMISSION_READ}>
      <DashboardPageShell title="Permissions">
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Collapse accordion items={collapseItems} />
        )}
      </DashboardPageShell>
    </RequirePermission>
  );
}
