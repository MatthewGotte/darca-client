"use client";

import type { ReactNode } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Space, Typography } from "antd";
import type { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import Link from "@/components/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardPageShellProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  onCreate?: () => void;
  createLabel?: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
};

export default function DashboardPageShell({
  title,
  subtitle,
  breadcrumbs,
  onCreate,
  createLabel = "Create",
  actions,
  filters,
  children,
}: DashboardPageShellProps) {
  const breadcrumbItems: ItemType[] = breadcrumbs
    ? breadcrumbs.map(({ label, href }) => ({
        title: href ? <Link href={href}>{label}</Link> : label,
      }))
    : [];

  const headerActions =
    actions ??
    (onCreate ? (
      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        {createLabel}
      </Button>
    ) : null);

  return (
    <div style={{ padding: 24 }}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 8 }} />
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          {subtitle ? (
            <Typography.Text type="secondary">{subtitle}</Typography.Text>
          ) : null}
        </div>
        {headerActions ? <Space wrap>{headerActions}</Space> : null}
      </div>

      {filters ? (
        <div style={{ marginBottom: 16 }}>
          <Space wrap>{filters}</Space>
        </div>
      ) : null}

      {children}
    </div>
  );
}
