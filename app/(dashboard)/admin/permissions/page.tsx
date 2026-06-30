"use client";

import { Collapse, List, Skeleton, Space, Typography } from "antd";
import PageHeader from "@/components/page-header";
import RequirePermission from "@/components/require-permission";
import { usePermissions } from "@/hooks/data/use-rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export default function PermissionsPage() {
  const { data: groups, isLoading } = usePermissions();

  const collapseItems = (groups ?? [])
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((group) => ({
      key: group.id,
      label: (
        <Space>
          <Typography.Text strong>{group.name}</Typography.Text>
          {group.description && (
            <Typography.Text type="secondary">{group.description}</Typography.Text>
          )}
        </Space>
      ),
      children: (
        <List
          size="small"
          dataSource={group.permissions
            .slice()
            .sort(
              (a: { displayOrder?: number }, b: { displayOrder?: number }) =>
                (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
            )}
          renderItem={(perm: { id: string; name: string; description?: string }) => (
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
