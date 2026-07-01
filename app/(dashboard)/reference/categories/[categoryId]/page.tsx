"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/page-header";
import ConfirmDelete from "@/components/confirm-delete";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import {
  useCategory,
  useUpdateCategory,
  useUpdateCategoryCustomFields,
  useDeleteCategory,
} from "@/hooks/data/use-categories";
import { useCustomFields } from "@/hooks/data/use-custom-fields";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateCategoryRequest } from "@/lib/api/types";

type CustomFieldRow = {
  id: string;
  label: string;
  dataType: string;
  required: boolean;
};

export default function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const router = useRouter();

  const { data: category, isLoading } = useCategory(categoryId);
  const { data: allCustomFields } = useCustomFields();
  const { trigger: updateCategory, isMutating: isUpdating } = useUpdateCategory(categoryId);
  const { trigger: updateCustomFields, isMutating: isUpdatingFields } = useUpdateCategoryCustomFields(categoryId);
  const { trigger: deleteCategory, isMutating: isDeleting } = useDeleteCategory(categoryId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [fieldsDrawerOpen, setFieldsDrawerOpen] = useState(false);
  const [editForm] = Form.useForm<UpdateCategoryRequest>();
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);

  const openEditModal = () => {
    if (category) {
      editForm.setFieldsValue({ name: category.name, description: category.description });
    }
    setEditModalOpen(true);
  };

  const openFieldsDrawer = () => {
    if (category?.customFields) {
      setSelectedFieldIds(category.customFields.map((f: CustomFieldRow) => f.id));
    }
    setFieldsDrawerOpen(true);
  };

  const handleEdit = async () => {
    const values = await editForm.validateFields();
    try {
      await updateCategory(values);
      message.success("Category updated successfully");
      editForm.resetFields();
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update category");
    }
  };

  const handleUpdateFields = async () => {
    try {
      await updateCustomFields({ customFieldIds: selectedFieldIds });
      message.success("Custom fields updated successfully");
      setFieldsDrawerOpen(false);
    } catch {
      message.error("Failed to update custom fields");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory();
      message.success("Category deleted successfully");
      router.push("/reference/categories");
    } catch {
      message.error("Failed to delete category");
    }
  };

  const customFieldColumns: TableColumnsType<CustomFieldRow> = [
    { title: "Label", dataIndex: "label", key: "label" },
    { title: "Data Type", dataIndex: "dataType", key: "dataType", render: (v) => <Tag>{v}</Tag> },
    {
      title: "Required",
      dataIndex: "required",
      key: "required",
      render: (v) => (v ? <Tag color="red">Yes</Tag> : <Tag>No</Tag>),
    },
  ];

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <RequirePermission permission={PERMISSIONS.CATEGORY_READ}>
      <div>
        <PageHeader
          title={category?.name ?? "Category"}
          subtitle={category?.description}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Reference" },
            { label: "Categories", href: "/reference/categories" },
            { label: category?.name ?? categoryId },
          ]}
          actions={
            <Can permission={PERMISSIONS.CATEGORY_MANAGE}>
              <Space>
                <Button onClick={openFieldsDrawer}>Manage Custom Fields</Button>
                <Button onClick={openEditModal}>Edit</Button>
                <Button danger onClick={() => setDeleteOpen(true)}>Delete</Button>
              </Space>
            </Can>
          }
        />

        <Card title="Details" style={{ marginBottom: 24 }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">{category?.name ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Description">{category?.description ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Created">
              {category?.createdAt ? new Date(category.createdAt).toLocaleString() : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated">
              {category?.updatedAt ? new Date(category.updatedAt).toLocaleString() : "—"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Custom Fields">
          <Table<CustomFieldRow>
            rowKey="id"
            dataSource={category?.customFields ?? []}
            columns={customFieldColumns}
            pagination={false}
          />
        </Card>

        {/* Edit Modal */}
        <Modal
          title="Edit Category"
          open={editModalOpen}
          onOk={handleEdit}
          onCancel={() => {
            setEditModalOpen(false);
            editForm.resetFields();
          }}
          okText="Save"
          confirmLoading={isUpdating}
          destroyOnHide
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
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

        {/* Manage Custom Fields Drawer */}
        <Drawer
          title="Manage Custom Fields"
          open={fieldsDrawerOpen}
          onClose={() => setFieldsDrawerOpen(false)}
          width={480}
          footer={
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setFieldsDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" loading={isUpdatingFields} onClick={handleUpdateFields}>
                Save
              </Button>
            </Space>
          }
        >
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select custom fields"
            value={selectedFieldIds}
            onChange={setSelectedFieldIds}
            options={(allCustomFields ?? []).map((f) => ({
              label: f.label,
              value: f.id,
            }))}
            optionFilterProp="label"
          />
        </Drawer>

        <ConfirmDelete
          open={deleteOpen}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={isDeleting}
          title="Delete Category"
          description="This action cannot be undone. Are you sure you want to delete this category?"
          confirmText="Delete"
        />
      </div>
    </RequirePermission>
  );
}
