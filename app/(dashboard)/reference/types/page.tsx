"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Modal } from "antd";
import type { TableColumnsType } from "antd";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import { useTypes, useCreateType } from "@/hooks/data/use-types";
import { useAppMessage } from "@/hooks/use-app-message";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { CreateTypeRequest } from "@/lib/api/types";

type TypeRow = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

export default function TypesPage() {
  const { message } = useAppMessage();
  const router = useRouter();
  const { data, isLoading, error } = useTypes();
  const { trigger: createType, isMutating } = useCreateType();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<CreateTypeRequest>();

  const columns: TableColumnsType<TypeRow> = [
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Description", dataIndex: "description", key: "description", render: (v) => v ?? "—" },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
      sorter: (a, b) =>
        new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime(),
    },
  ];

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createType(values);
      message.success("Type created successfully");
      form.resetFields();
      setModalOpen(false);
    } catch {
      message.error("Failed to create type");
    }
  };

  return (
    <RequirePermission permission={PERMISSIONS.TYPE_READ}>
      <DashboardPageShell
        title="Types"
        subtitle="Manage asset types"
        actions={
          <Can permission={PERMISSIONS.TYPE_MANAGE}>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              New Type
            </Button>
          </Can>
        }
      >
        <DataTable<TypeRow>
          isLoading={isLoading}
          error={error}
          dataSource={data as TypeRow[] | undefined}
          columns={columns}
          onRow={(record) => ({
            onClick: () => router.push(`/reference/types/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />

        <Modal
          title="New Type"
          open={modalOpen}
          onOk={handleCreate}
          onCancel={() => {
            setModalOpen(false);
            form.resetFields();
          }}
          okText="Create"
          confirmLoading={isMutating}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </DashboardPageShell>
    </RequirePermission>
  );
}
