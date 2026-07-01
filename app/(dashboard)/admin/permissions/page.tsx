"use client";

import { Collapse, List, Skeleton, Typography } from "antd";
import PageHeader from "@/components/page-header";
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
        <List
          size="small"
          dataSource={(group.permissions ?? [])
            .slice()
            .sort(
              (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
            )}
          renderItem={(perm) => (
            <List.Item>
              <List.Item.Meta
                title={perm.name}
                description={perm.description}
              />
            </List.Item>
          )}
        />
      ),
    }));

  return (
    <RequirePermission permission={PERMISSIONS.PERMISSION_READ}>
      <div>
        <PageHeader
          title="Permissions"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Permissions" },
          ]}
        />

        {isLoading ? (
          <Skeleton active />
        ) : (
          <Collapse accordion items={collapseItems} />
        )}
      </div>
    </RequirePermission>
  );
}
