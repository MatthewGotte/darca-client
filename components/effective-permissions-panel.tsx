"use client";

import { Card, Collapse, Space, Tag, Typography } from "antd";
import { useAuth } from "@/hooks/use-auth";
import type { PermissionCode } from "@/lib/auth/permissions";
import { groupPermissionsByDomain } from "@/lib/permission-groups";

export default function EffectivePermissionsPanel() {
  const { permissions } = useAuth();
  const groups = groupPermissionsByDomain(permissions as PermissionCode[]);

  if (permissions.length === 0) {
    return (
      <Card title="My Permissions">
        <Typography.Text type="secondary">
          No permissions assigned to your account.
        </Typography.Text>
      </Card>
    );
  }

  const items = groups.map((group) => ({
    key: group.domain,
    label: (
      <Space>
        <Typography.Text strong>{group.domain}</Typography.Text>
        <Tag>{group.permissions.length}</Tag>
      </Space>
    ),
    children: (
      <Space wrap>
        {group.permissions.map((permission) => (
          <Tag key={permission} color="blue">
            {permission}
          </Tag>
        ))}
      </Space>
    ),
  }));

  return (
    <Card title="My Permissions">
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Effective permissions granted to your account through assigned roles.
      </Typography.Paragraph>
      <Collapse items={items} defaultActiveKey={groups.slice(0, 2).map((g) => g.domain)} />
    </Card>
  );
}
