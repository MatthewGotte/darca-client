"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Checkbox,
  Descriptions,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Tag,
  message,
} from "antd";
import PageHeader from "@/components/page-header";
import ConfirmDelete from "@/components/confirm-delete";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import {
  useCustomField,
  useUpdateCustomField,
  useDeleteCustomField,
} from "@/hooks/data/use-custom-fields";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateCustomFieldRequest } from "@/lib/api/types";

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

export default function CustomFieldDetailPage() {
  const { fieldId } = useParams<{ fieldId: string }>();
  const router = useRouter();

  const { data: field, isLoading } = useCustomField(fieldId);
  const { trigger: updateCustomField, isMutating: isUpdating } = useUpdateCustomField(fieldId);
  const { trigger: deleteCustomField, isMutating: isDeleting } = useDeleteCustomField(fieldId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm] = Form.useForm<UpdateCustomFieldRequest>();

  const openEditModal = () => {
    if (field) {
      editForm.setFieldsValue({
        label: field.label,
        dataType: field.dataType,
        required: field.required,
      });
    }
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    const values = await editForm.validateFields();
    try {
      await updateCustomField(values);
      message.success("Custom field updated successfully");
      editForm.resetFields();
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update custom field");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomField();
      message.success("Custom field deleted successfully");
      router.push("/reference/custom-fields");
    } catch {
      message.error("Failed to delete custom field");
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <RequirePermission permission={PERMISSIONS.CUSTOM_FIELD_READ}>
      <div>
        <PageHeader
          title={field?.label ?? "Custom Field"}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Reference" },
            { label: "Custom Fields", href: "/reference/custom-fields" },
            { label: field?.label ?? fieldId },
          ]}
          actions={
            <Can permission={PERMISSIONS.CUSTOM_FIELD_MANAGE}>
              <Space>
                <Button onClick={openEditModal}>Edit</Button>
                <Button danger onClick={() => setDeleteOpen(true)}>Delete</Button>
              </Space>
            </Can>
          }
        />

        <Card title="Details">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Label">{field?.label ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Data Type">
              {field?.dataType ? (
                <Tag color={DATA_TYPE_COLORS[field.dataType] ?? "default"}>{field.dataType}</Tag>
              ) : (
                "—"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Required">
              {field?.required ? <Tag color="red">Yes</Tag> : <Tag>No</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {field?.createdAt ? new Date(field.createdAt).toLocaleString() : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated">
              {field?.updatedAt ? new Date(field.updatedAt).toLocaleString() : "—"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Modal
          title="Edit Custom Field"
          open={editModalOpen}
          onOk={handleEdit}
          onCancel={() => {
            setEditModalOpen(false);
            editForm.resetFields();
          }}
          okText="Save"
          confirmLoading={isUpdating}
          destroyOnHidden
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
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

        <ConfirmDelete
          open={deleteOpen}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={isDeleting}
          title="Delete Custom Field"
          description="This action cannot be undone. Are you sure you want to delete this custom field?"
          confirmText="Delete"
        />
      </div>
    </RequirePermission>
  );
}
