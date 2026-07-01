"use client";

import { useState } from "react";
import { Button, Form, Input, Modal, Space, Switch, Tag, message } from "antd";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/data-table";
import RequirePermission from "@/components/require-permission";
import Can from "@/components/can";
import Link from "@/components/link";
import { useOrgId } from "@/hooks/use-org-id";
import {
  useOrganisationUsers,
  useCreateOrganisationUser,
} from "@/hooks/data/use-users";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { CreateUserRequest } from "@/lib/api/types";

type UserRow = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  decommissionedAt?: string | null;
};

export default function UsersPage() {
  const orgId = useOrgId();
  const [includeDecommissioned, setIncludeDecommissioned] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm<CreateUserRequest>();

  const { data: users, isLoading, error } = useOrganisationUsers(orgId, { includeDecommissioned });
  const { trigger: createUser, isMutating } = useCreateOrganisationUser(orgId ?? "");

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createUser(values);
      message.success("User created successfully");
      setCreateModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Failed to create user");
    }
  };

  const columns: TableColumnsType<UserRow> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: UserRow) => (
        <Link href={`/admin/users/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Decommissioned</Tag>
        ),
    },
    {
      title: "Decommissioned At",
      dataIndex: "decommissionedAt",
      key: "decommissionedAt",
      render: (val?: string | null) =>
        val ? new Date(val).toLocaleDateString() : "—",
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.USER_READ}>
      <div>
        <PageHeader
          title="Users"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Users" },
          ]}
          actions={
            <Space>
              <Space>
                <span>Include decommissioned</span>
                <Switch
                  checked={includeDecommissioned}
                  onChange={setIncludeDecommissioned}
                />
              </Space>
              <Can permission={PERMISSIONS.USER_CREATE}>
                <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                  New User
                </Button>
              </Can>
            </Space>
          }
        />

        <DataTable<UserRow>
          dataSource={users}
          columns={columns}
          isLoading={isLoading}
          error={error}
        />

        <Modal
          title="Create User"
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
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </RequirePermission>
  );
}
