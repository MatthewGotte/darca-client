"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tag,
} from "antd";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import Can from "@/components/can";
import { useAuth } from "@/hooks/use-auth";
import { useChangePassword } from "@/hooks/data/use-auth-data";
import { useAppMessage } from "@/hooks/use-app-message";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { ChangePasswordRequest } from "@/lib/api/types";
import Link from "@/components/link";
import EffectivePermissionsPanel from "@/components/effective-permissions-panel";

export default function SettingsPage() {
  const { message } = useAppMessage();
  const { user, roles } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [form] = Form.useForm<ChangePasswordRequest & { confirmPassword: string }>();
  const { trigger: changePassword, isMutating } = useChangePassword();

  const handlePasswordSubmit = async () => {
    const values = await form.validateFields();
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed successfully");
      form.resetFields();
      setPasswordModalOpen(false);
    } catch {
      message.error("Failed to change password. Please check your current password.");
    }
  };

  return (
    <DashboardPageShell
      title="Settings"
      actions={
        <Button type="primary" onClick={() => setPasswordModalOpen(true)}>
          Change Password
        </Button>
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16} lg={12}>
          <Card title="Profile">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Name">{user?.name ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Email">{user?.email ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Roles">
                <Space wrap>
                  {roles.length > 0
                    ? roles.map((r) => <Tag key={r} color="blue">{r}</Tag>)
                    : "—"}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} md={16} lg={12}>
          <Can permission={PERMISSIONS.ORGANISATION_READ}>
            <Card
              title="Organisation"
              extra={
                <Link href="/settings/organisation">
                  <Button type="link" size="small">View</Button>
                </Link>
              }
            >
              Manage your organisation settings and details.
            </Card>
          </Can>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <EffectivePermissionsPanel />
        </Col>
      </Row>

      <Modal
        title="Change Password"
        open={passwordModalOpen}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setPasswordModalOpen(false);
          form.resetFields();
        }}
        okText="Change Password"
        confirmLoading={isMutating}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardPageShell>
  );
}
