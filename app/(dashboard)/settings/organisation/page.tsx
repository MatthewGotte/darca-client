"use client";

import { useState } from "react";
import { Button, Card, Col, Descriptions, Form, Input, Modal, Row, Skeleton } from "antd";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import { useAppMessage } from "@/hooks/use-app-message";
import RequirePermission from "@/components/require-permission";
import Can from "@/components/can";
import { useOrgId } from "@/hooks/use-org-id";
import { useOrganisation, useUpdateOrganisation } from "@/hooks/data/use-organisation";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateOrganisationRequest } from "@/lib/api/types";

export default function OrganisationSettingsPage() {
  const { message } = useAppMessage();
  const orgId = useOrgId();
  const { data: org, isLoading } = useOrganisation(orgId);
  const { trigger: updateOrg, isMutating } = useUpdateOrganisation(orgId ?? "");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form] = Form.useForm<UpdateOrganisationRequest>();

  const handleEdit = () => {
    form.setFieldsValue({ name: org?.name ?? "" });
    setEditModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      await updateOrg(values);
      message.success("Organisation updated successfully");
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update organisation");
    }
  };

  return (
    <RequirePermission permission={PERMISSIONS.ORGANISATION_READ}>
      <DashboardPageShell
          title="Organisation Settings"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Organisation" },
          ]}
          actions={
            <Can permission={PERMISSIONS.ORGANISATION_UPDATE}>
              <Button type="primary" onClick={handleEdit}>
                Edit Organisation
              </Button>
            </Can>
          }
        >
{isLoading ? (
          <Skeleton active />
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16} lg={12}>
              <Card title="Organisation Details">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Name">{org?.name ?? "—"}</Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {org?.createdAt
                      ? new Date(org.createdAt).toLocaleDateString()
                      : "—"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        )}

        <Modal
          title="Edit Organisation"
          open={editModalOpen}
          onOk={handleSubmit}
          onCancel={() => setEditModalOpen(false)}
          okText="Save"
          confirmLoading={isMutating}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Organisation Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </DashboardPageShell>
    </RequirePermission>
  );
}
