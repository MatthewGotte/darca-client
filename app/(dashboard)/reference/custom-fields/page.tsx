"use client";

import { useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Select, Tag, message } from "antd";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import { useCustomFields, useCreateCustomField } from "@/hooks/data/use-custom-fields";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { CreateCustomFieldRequest } from "@/lib/api/types";

const DATA_TYPE_OPTIONS = [
  { label: "Text", value: "TEXT" },
  { label: "Number", value: "NUMBER" },
  { label: "Date", value: "DATE" },
  { label: "Boolean", value: "BOOLEAN" },
  { label: "Select", value: "SELECT" },
];

const DATA_TYPE_COLORS: Record<string, string> = {
  TEXT: "blue",
  NUMBER: "green",
  DATE: "orange",
  BOOLEAN: "purple",
  SELECT: "cyan",
};

type CustomFieldRow = {
  id: string;
  label: string;
  dataType: string;
  required: boolean;
  createdAt?: string;
};

export default function CustomFieldsPage() {
  const { data, isLoading, error } = useCustomFields();
  const { trigger: createCustomField, isMutating } = useCreateCustomField();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<CreateCustomFieldRequest>();

  const columns: TableColumnsType<CustomFieldRow> = [
    { title: "Label", dataIndex: "label", key: "label", sorter: (a, b) => a.label.localeCompare(b.label) },
    {
      title: "Data Type",
      dataIndex: "dataType",
      key: "dataType",
      render: (v) => <Tag color={DATA_TYPE_COLORS[v] ?? "default"}>{v}</Tag>,
    },
    {
      title: "Required",
      dataIndex: "required",
      key: "required",
      render: (v) => (v ? <Tag color="red">Yes</Tag> : <Tag>No</Tag>),
    },
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
      await createCustomField(values);
      message.success("Custom field created successfully");
      form.resetFields();
      setModalOpen(false);
    } catch {
      message.error("Failed to create custom field");
    }
  };

  return (
    <RequirePermission permission={PERMISSIONS.CUSTOM_FIELD_READ}>
      <div>
        <PageHeader
          title="Custom Fields"
          subtitle="Manage custom fields for assets"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Reference" },
            { label: "Custom Fields" },
          ]}
          actions={
            <Can permission={PERMISSIONS.CUSTOM_FIELD_MANAGE}>
              <Button type="primary" onClick={() => setModalOpen(true)}>
                New Custom Field
              </Button>
            </Can>
          }
        />

        <DataTable<CustomFieldRow>
          isLoading={isLoading}
          error={error}
          dataSource={data as CustomFieldRow[] | undefined}
          columns={columns}
        />

        <Modal
          title="New Custom Field"
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
          <Form form={form} layout="vertical" style={{ marginTop: 16 }} initialValues={{ required: false }}>
            <Form.Item
              name="label"
              label="Label"
              rules={[{ required: true, message: "Please enter a label" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dataType"
              label="Data Type"
              rules={[{ required: true, message: "Please select a data type" }]}
            >
              <Select options={DATA_TYPE_OPTIONS} placeholder="Select data type" />
            </Form.Item>
            <Form.Item name="required" valuePropName="checked">
              <Checkbox>Required</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </RequirePermission>
  );
}
