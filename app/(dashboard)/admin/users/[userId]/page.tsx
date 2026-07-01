"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Tag,
  Tabs } from "antd";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import { useAppMessage } from "@/hooks/use-app-message";
import RequirePermission from "@/components/require-permission";
import ConfirmDelete from "@/components/confirm-delete";
import Can from "@/components/can";
import { useOrgId } from "@/hooks/use-org-id";
import {
  useOrganisationUser,
  useUpdateOrganisationUser,
  useDeleteOrganisationUser,
  useSetUserPassword } from "@/hooks/data/use-users";
import {
  useOrganisationRoles,
  useUserOrganisationRoles,
  useUserLocationRoles,
  useUpdateUserOrganisationRoles,
  useUpdateUserLocationRoles } from "@/hooks/data/use-rbac";
import { useOrganisationLocations } from "@/hooks/data/use-locations";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateUserRequest, SetPasswordRequest } from "@/lib/api/types";

export default function UserDetailPage() {
  const { message } = useAppMessage();
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const orgId = useOrgId();

  const { data: user, isLoading } = useOrganisationUser(orgId, userId);
  const { trigger: updateUser, isMutating: isUpdating } = useUpdateOrganisationUser(orgId ?? "", userId);
  const { trigger: deleteUser, isMutating: isDeleting } = useDeleteOrganisationUser(orgId ?? "", userId);
  const { trigger: setPassword, isMutating: isSettingPassword } = useSetUserPassword(userId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [decommissionOpen, setDecommissionOpen] = useState(false);
  const [editForm] = Form.useForm<UpdateUserRequest>();
  const [passwordForm] = Form.useForm<SetPasswordRequest>();

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    const values = await editForm.validateFields();
    try {
      await updateUser(values);
      message.success("User updated successfully");
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update user");
    }
  };

  const handlePasswordSubmit = async () => {
    const values = await passwordForm.validateFields();
    try {
      await setPassword(values);
      message.success("Password updated successfully");
      setPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch {
      message.error("Failed to update password");
    }
  };

  const handleDecommission = async () => {
    try {
      await deleteUser();
      message.success("User decommissioned");
      router.push("/admin/users");
    } catch {
      message.error("Failed to decommission user");
    }
  };

  const profileActions = (
    <Space>
      <Can permission={PERMISSIONS.USER_UPDATE}>
        <Button onClick={handleEdit}>Edit</Button>
      </Can>
      <Can permission={PERMISSIONS.USER_UPDATE}>
        <Button onClick={() => setPasswordModalOpen(true)}>Set Password</Button>
      </Can>
      <Can permission={PERMISSIONS.USER_DECOMMISSION}>
        {user?.active && (
          <Button danger onClick={() => setDecommissionOpen(true)}>
            Decommission
          </Button>
        )}
      </Can>
    </Space>
  );

  const tabItems = [
    {
      key: "profile",
      label: "Profile",
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16} lg={12}>
            <Card title="User Details" extra={profileActions}>
              {isLoading ? (
                <Skeleton active />
              ) : (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Name">{user?.name ?? "—"}</Descriptions.Item>
                  <Descriptions.Item label="Email">{user?.email ?? "—"}</Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {user?.active ? (
                      <Tag color="green">Active</Tag>
                    ) : (
                      <Tag color="red">Decommissioned</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Decommissioned At">
                    {user?.decommissionedAt
                      ? new Date(user.decommissionedAt).toLocaleDateString()
                      : "—"}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>
        </Row>
      ) },
    {
      key: "org-roles",
      label: "Organisation Roles",
      children: (
        <Can permission={PERMISSIONS.USER_ASSIGN_ROLES} fallback={<p>You do not have permission to manage roles.</p>}>
          <OrgRolesTab orgId={orgId} userId={userId} />
        </Can>
      ) },
    {
      key: "location-roles",
      label: "Location Roles",
      children: (
        <Can permission={PERMISSIONS.USER_ASSIGN_ROLES} fallback={<p>You do not have permission to manage roles.</p>}>
          <LocationRolesTab orgId={orgId} userId={userId} />
        </Can>
      ) },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.USER_READ}>
      <DashboardPageShell
          title={user?.name ?? "User"}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Users", href: "/admin/users" },
            { label: user?.name ?? "User" },
          ]}
        >
<Tabs items={tabItems} />

        <Modal
          title="Edit User"
          open={editModalOpen}
          onOk={handleEditSubmit}
          onCancel={() => setEditModalOpen(false)}
          okText="Save"
          confirmLoading={isUpdating}
          destroyOnHidden
          afterOpenChange={(open) => {
            if (open) {
              editForm.setFieldsValue({ name: user?.name ?? "" });
            }
          }}
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Set Password"
          open={passwordModalOpen}
          onOk={handlePasswordSubmit}
          onCancel={() => {
            setPasswordModalOpen(false);
            passwordForm.resetFields();
          }}
          okText="Update Password"
          confirmLoading={isSettingPassword}
          destroyOnHidden
        >
          <Form form={passwordForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="password"
              label="New Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>

        <ConfirmDelete
          open={decommissionOpen}
          onConfirm={handleDecommission}
          onCancel={() => setDecommissionOpen(false)}
          loading={isDeleting}
          title="Decommission User"
          description={`Are you sure you want to decommission ${user?.name ?? "this user"}? This action cannot be undone.`}
          confirmText="Decommission"
        />
      </DashboardPageShell>
    </RequirePermission>
  );
}

function OrgRolesTab({
  orgId,
  userId }: {
  orgId: string | undefined;
  userId: string;
}) {
  const { message } = useAppMessage();
  const { data: roles } = useOrganisationRoles(orgId);
  const { data: userRoles } = useUserOrganisationRoles(userId);
  const { trigger: updateRoles, isMutating } = useUpdateUserOrganisationRoles(userId);

  const serverRoleIds = useMemo(() => userRoles?.roleIds ?? [], [userRoles]);
  const [draftRoleIds, setDraftRoleIds] = useState<string[] | null>(null);
  const selectedIds = draftRoleIds ?? serverRoleIds;

  const roleOptions = (roles ?? []).map((r) => ({ value: r.id, label: r.name }));

  const handleSave = async () => {
    try {
      await updateRoles({ roleIds: selectedIds });
      message.success("Organisation roles updated");
      setDraftRoleIds(null);
    } catch {
      message.error("Failed to update organisation roles");
    }
  };

  return (
    <Card title="Organisation Roles" style={{ maxWidth: 600 }}>
      <Space orientation="vertical" style={{ width: "100%" }}>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select roles"
          options={roleOptions}
          value={selectedIds}
          onChange={setDraftRoleIds}
        />
        <Button type="primary" onClick={handleSave} loading={isMutating}>
          Save
        </Button>
      </Space>
    </Card>
  );
}

function LocationRolesTab({
  orgId,
  userId }: {
  orgId: string | undefined;
  userId: string;
}) {
  const { message } = useAppMessage();
  const { data: locations } = useOrganisationLocations(orgId);
  const { data: roles } = useOrganisationRoles(orgId);
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>();

  const { data: locationRoles } = useUserLocationRoles(userId, selectedLocationId);
  const { trigger: updateLocationRoles, isMutating } = useUpdateUserLocationRoles(
    userId,
    selectedLocationId ?? ""
  );

  const serverRoleIds = useMemo(() => locationRoles?.roleIds ?? [], [locationRoles]);
  const [draftRoleIds, setDraftRoleIds] = useState<string[] | null>(null);
  const selectedRoleIds = draftRoleIds ?? serverRoleIds;

  const locationOptions = (locations ?? []).map((l) => ({ value: l.id, label: l.name }));
  const roleOptions = (roles ?? []).map((r) => ({ value: r.id, label: r.name }));

  const handleSave = async () => {
    if (!selectedLocationId) return;
    try {
      await updateLocationRoles({ roleIds: selectedRoleIds });
      message.success("Location roles updated");
      setDraftRoleIds(null);
    } catch {
      message.error("Failed to update location roles");
    }
  };

  return (
    <Card title="Location Roles" style={{ maxWidth: 600 }}>
      <Space orientation="vertical" style={{ width: "100%" }}>
        <Select
          style={{ width: "100%" }}
          placeholder="Select a location"
          options={locationOptions}
          value={selectedLocationId}
          onChange={(val) => {
            setSelectedLocationId(val);
            setDraftRoleIds(null);
          }}
        />
        {selectedLocationId && (
          <>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select roles"
              options={roleOptions}
              value={selectedRoleIds}
              onChange={setDraftRoleIds}
            />
            <Button
              type="primary"
              onClick={handleSave}
              loading={isMutating}
            >
              Save
            </Button>
          </>
        )}
      </Space>
    </Card>
  );
}
