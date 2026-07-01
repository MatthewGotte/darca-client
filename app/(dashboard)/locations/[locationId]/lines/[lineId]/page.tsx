"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Descriptions, Form, Input, Modal, Skeleton, Space, Tag } from "antd";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import { useAppMessage } from "@/hooks/use-app-message";
import RequirePermission from "@/components/require-permission";
import Can from "@/components/can";
import ConfirmDelete from "@/components/confirm-delete";
import {
  useLocationLine,
  useUpdateLocationLine,
  useDeleteLocationLine } from "@/hooks/data/use-lines";
import { useOrganisationLocation } from "@/hooks/data/use-locations";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateLineRequest } from "@/lib/api/types";

export default function LineDetailPage() {
  const { message } = useAppMessage();
  const { locationId, lineId } = useParams<{ locationId: string; lineId: string }>();
  const orgId = useOrgId();
  const router = useRouter();

  const { data: location } = useOrganisationLocation(orgId, locationId);
  const { data: line, isLoading } = useLocationLine(locationId, lineId);
  const { trigger: updateLine, isMutating: updatingLine } = useUpdateLocationLine(locationId, lineId);
  const { trigger: deleteLine, isMutating: deletingLine } = useDeleteLocationLine(locationId, lineId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [decommissionOpen, setDecommissionOpen] = useState(false);
  const [editForm] = Form.useForm<UpdateLineRequest>();

  const handleEdit = async () => {
    const values = await editForm.validateFields();
    try {
      await updateLine(values);
      message.success("Line updated successfully");
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update line");
    }
  };

  const handleDecommission = async () => {
    try {
      await deleteLine();
      message.success("Line decommissioned");
      router.push(`/locations/${locationId}`);
    } catch {
      message.error("Failed to decommission line");
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  const isDecommissioned = Boolean(line?.decommissionedAt);

  return (
    <RequirePermission permission={PERMISSIONS.LINE_READ}>
      <DashboardPageShell
          title={line?.name ?? "Line"}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Locations", href: "/locations" },
            { label: location?.name ?? "Location", href: `/locations/${locationId}` },
            { label: "Lines" },
            { label: line?.name ?? "Line" },
          ]}
          actions={
            <Space>
              <Can permission={PERMISSIONS.LINE_UPDATE}>
                <Button
                  onClick={() => {
                    editForm.setFieldsValue({
                      name: line?.name,
                      description: line?.description ?? undefined });
                    setEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
              </Can>
              {!isDecommissioned && (
                <Can permission={PERMISSIONS.LINE_DECOMMISSION}>
                  <Button danger onClick={() => setDecommissionOpen(true)}>
                    Decommission
                  </Button>
                </Can>
              )}
            </Space>
          }
        >
<Descriptions
          bordered
          column={{ xs: 1, sm: 2 }}
          style={{ marginTop: 24 }}
          items={[
            {
              key: "name",
              label: "Name",
              children: line?.name ?? "—" },
            {
              key: "description",
              label: "Description",
              children: line?.description ?? "—" },
            {
              key: "status",
              label: "Status",
              children: isDecommissioned ? (
                <Tag color="red">Decommissioned</Tag>
              ) : (
                <Tag color="green">Active</Tag>
              ) },
            {
              key: "decommissionedAt",
              label: "Decommissioned At",
              children: line?.decommissionedAt
                ? new Date(line.decommissionedAt).toLocaleDateString()
                : "—" },
            {
              key: "createdAt",
              label: "Created At",
              children: line?.createdAt
                ? new Date(line.createdAt).toLocaleDateString()
                : "—" },
            {
              key: "updatedAt",
              label: "Updated At",
              children: line?.updatedAt
                ? new Date(line.updatedAt).toLocaleDateString()
                : "—" },
          ]}
        />

        {/* Edit Modal */}
        <Modal
          title="Edit Line"
          open={editModalOpen}
          onOk={handleEdit}
          onCancel={() => setEditModalOpen(false)}
          okText="Save"
          confirmLoading={updatingLine}
          destroyOnHidden
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

        {/* Decommission Confirm */}
        <ConfirmDelete
          open={decommissionOpen}
          onConfirm={handleDecommission}
          onCancel={() => setDecommissionOpen(false)}
          loading={deletingLine}
          title="Decommission Line"
          description={`Are you sure you want to decommission "${line?.name}"? This action cannot be undone.`}
          confirmText="Decommission"
        />
      </DashboardPageShell>
    </RequirePermission>
  );
}
