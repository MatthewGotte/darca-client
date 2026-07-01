"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Skeleton,
  Space,
  message,
} from "antd";
import PageHeader from "@/components/page-header";
import ConfirmDelete from "@/components/confirm-delete";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import { useType, useUpdateType, useDeleteType } from "@/hooks/data/use-types";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateTypeRequest } from "@/lib/api/types";

export default function TypeDetailPage() {
  const { typeId } = useParams<{ typeId: string }>();
  const router = useRouter();

  const { data: type, isLoading } = useType(typeId);
  const { trigger: updateType, isMutating: isUpdating } = useUpdateType(typeId);
  const { trigger: deleteType, isMutating: isDeleting } = useDeleteType(typeId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm] = Form.useForm<UpdateTypeRequest>();

  const openEditModal = () => {
    if (type) {
      editForm.setFieldsValue({ name: type.name, description: type.description });
    }
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    const values = await editForm.validateFields();
    try {
      await updateType(values);
      message.success("Type updated successfully");
      editForm.resetFields();
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update type");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteType();
      message.success("Type deleted successfully");
      router.push("/reference/types");
    } catch {
      message.error("Failed to delete type");
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <RequirePermission permission={PERMISSIONS.TYPE_READ}>
      <div>
        <PageHeader
          title={type?.name ?? "Type"}
          subtitle={type?.description}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Reference" },
            { label: "Types", href: "/reference/types" },
            { label: type?.name ?? typeId },
          ]}
          actions={
            <Can permission={PERMISSIONS.TYPE_MANAGE}>
              <Space>
                <Button onClick={openEditModal}>Edit</Button>
                <Button danger onClick={() => setDeleteOpen(true)}>Delete</Button>
              </Space>
            </Can>
          }
        />

        <Card title="Details">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">{type?.name ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Description">{type?.description ?? "—"}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Modal
          title="Edit Type"
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

        <ConfirmDelete
          open={deleteOpen}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={isDeleting}
          title="Delete Type"
          description="This action cannot be undone. Are you sure you want to delete this type?"
          confirmText="Delete"
        />
      </div>
    </RequirePermission>
  );
}
