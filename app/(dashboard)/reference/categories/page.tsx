"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Modal, message } from "antd";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import {
  useCategories,
  useCreateCategory,
} from "@/hooks/data/use-categories";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { CreateCategoryRequest } from "@/lib/api/types";

type CategoryRow = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export default function CategoriesPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCategories();
  const { trigger: createCategory, isMutating } = useCreateCategory();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<CreateCategoryRequest>();

  const columns: TableColumnsType<CategoryRow> = [
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Description", dataIndex: "description", key: "description", render: (v) => v ?? "—" },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createCategory(values);
      message.success("Category created successfully");
      form.resetFields();
      setModalOpen(false);
    } catch {
      message.error("Failed to create category");
    }
  };

  return (
    <RequirePermission permission={PERMISSIONS.CATEGORY_READ}>
      <div>
        <PageHeader
          title="Categories"
          subtitle="Manage asset categories"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Reference" },
            { label: "Categories" },
          ]}
          actions={
            <Can permission={PERMISSIONS.CATEGORY_MANAGE}>
              <Button type="primary" onClick={() => setModalOpen(true)}>
                New Category
              </Button>
            </Can>
          }
        />

        <DataTable<CategoryRow>
          isLoading={isLoading}
          error={error}
          dataSource={data as CategoryRow[] | undefined}
          columns={columns}
          onRow={(record) => ({
            onClick: () => router.push(`/reference/categories/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />

        <Modal
          title="New Category"
          open={modalOpen}
          onOk={handleCreate}
          onCancel={() => {
            setModalOpen(false);
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
              rules={[{ required: true, message: "Please enter a name" }]}
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
