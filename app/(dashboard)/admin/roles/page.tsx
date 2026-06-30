"use client";

import { useState } from "react";
import { Button, Form, Input, message, Modal, Tag } from "antd";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/data-table";
import RequirePermission from "@/components/require-permission";
import Can from "@/components/can";
import Link from "@/components/link";
import { useOrgId } from "@/hooks/use-org-id";
import { useOrganisationRoles, useCreateOrganisationRole } from "@/hooks/data/use-rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { CreateRoleRequest } from "@/lib/api/types";

type RoleRow = {
  id: string;
  name: string;
  description?: string | null;
  system: boolean;
  permissions?: unknown[];
};

export default function RolesPage() {
  const orgId = useOrgId();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm<CreateRoleRequest>();

  const { data: roles, isLoading, error } = useOrganisationRoles(orgId);
  const { trigger: createRole, isMutating } = useCreateOrganisationRole(orgId ?? "");

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createRole(values);
      message.success("Role created successfully");
      setCreateModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Failed to create role");
    }
  };

  const columns: TableColumnsType<RoleRow> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: RoleRow) => (
        <Link href={`/admin/roles/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (val?: string | null) => val ?? "—",
    },
    {
      title: "System",
      dataIndex: "system",
      key: "system",
      render: (system: boolean) =>
        system ? <Tag color="orange">System</Tag> : "—",
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_: unknown, record: RoleRow) =>
        Array.isArray(record.permissions) ? record.permissions.length : "—",
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.ROLE_READ}>
      <div>
        <PageHeader
          title="Roles"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Roles" },
          ]}
          actions={
            <Can permission={PERMISSIONS.ROLE_CREATE}>
              <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                New Role
              </Button>
            </Can>
          }
        />

        <DataTable<RoleRow>
          dataSource={roles}
          columns={columns}
          isLoading={isLoading}
          error={error}
        />

        <Modal
          title="Create Role"
          open={createModalOpen}
          onOk={handleCreate}
          onCancel={() => {
            setCreateModalOpen(false);
            form.resetFields();
          }}
          okText="Create"
          confirmLoading={isMutating}
          destroyOnHide
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </RequirePermission>
  );
}
