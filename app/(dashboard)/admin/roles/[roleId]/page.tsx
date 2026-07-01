"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import PageHeader from "@/components/page-header";
import RequirePermission from "@/components/require-permission";
import ConfirmDelete from "@/components/confirm-delete";
import Can from "@/components/can";
import { useOrgId } from "@/hooks/use-org-id";
import {
  useOrganisationRole,
  useUpdateOrganisationRole,
  useDeleteOrganisationRole,
  useUpdateOrganisationRolePermissions,
  usePermissions,
} from "@/hooks/data/use-rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { UpdateRoleRequest } from "@/lib/api/types";

export default function RoleDetailPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const router = useRouter();
  const orgId = useOrgId();

  const { data: role, isLoading } = useOrganisationRole(orgId, roleId);
  const { data: permissionGroups } = usePermissions();
  const { trigger: updateRole, isMutating: isUpdating } = useUpdateOrganisationRole(orgId ?? "", roleId);
  const { trigger: deleteRole, isMutating: isDeleting } = useDeleteOrganisationRole(orgId ?? "", roleId);
  const { trigger: savePermissions, isMutating: isSavingPermissions } =
    useUpdateOrganisationRolePermissions(orgId ?? "", roleId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const serverCheckedIds = useMemo(
    () =>
      role?.permissions
        ?.map((p) => p.id)
        .filter((id): id is string => id != null) ?? [],
    [role]
  );
  const [draftCheckedIds, setDraftCheckedIds] = useState<string[] | null>(null);
  const checkedIds = draftCheckedIds ?? serverCheckedIds;
  const [editForm] = Form.useForm<UpdateRoleRequest>();

  const handleEdit = () => {
    editForm.setFieldsValue({ name: role?.name ?? "", description: role?.description ?? "" });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    const values = await editForm.validateFields();
    try {
      await updateRole(values);
      message.success("Role updated successfully");
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update role");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRole();
      message.success("Role deleted");
      router.push("/admin/roles");
    } catch {
      message.error("Failed to delete role");
    }
  };

  const handleSavePermissions = async () => {
    try {
      await savePermissions({ permissionIds: checkedIds });
      message.success("Permissions updated");
      setDraftCheckedIds(null);
    } catch {
      message.error("Failed to update permissions");
    }
  };

  const collapseItems = (permissionGroups ?? [])
    .slice()
    .sort((a, b) => (a.group ?? "").localeCompare(b.group ?? ""))
    .map((group) => {
      const permissions = group.permissions ?? [];
      const groupPermIds = permissions
        .map((p) => p.id)
        .filter((id): id is string => id != null);
      const groupChecked = groupPermIds.filter((id) => checkedIds.includes(id));

      const handleGroupChange = (vals: string[]) => {
        setDraftCheckedIds((prev) => {
          const current = prev ?? serverCheckedIds;
          const without = current.filter((id) => !groupPermIds.includes(id));
          return [...without, ...vals];
        });
      };

      return {
        key: group.group ?? "ungrouped",
        label: <Typography.Text strong>{group.group ?? "Ungrouped"}</Typography.Text>,
        children: (
          <Checkbox.Group
            value={groupChecked}
            onChange={(vals) => handleGroupChange(vals as string[])}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {permissions
              .slice()
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
              .map((perm) => (
                <Checkbox key={perm.id} value={perm.id}>
                  <Space direction="vertical" size={0}>
                    <Typography.Text>{perm.name}</Typography.Text>
                    {perm.description && (
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {perm.description}
                      </Typography.Text>
                    )}
                  </Space>
                </Checkbox>
              ))}
          </Checkbox.Group>
        ),
      };
    });

  return (
    <RequirePermission permission={PERMISSIONS.ROLE_READ}>
      <div>
        <PageHeader
          title={role?.name ?? "Role"}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Roles", href: "/admin/roles" },
            { label: role?.name ?? "Role" },
          ]}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={16} lg={12}>
            <Card
              title="Role Details"
              extra={
                <Space>
                  <Can permission={PERMISSIONS.ROLE_UPDATE}>
                    <Button onClick={handleEdit}>Edit</Button>
                  </Can>
                  <Can permission={PERMISSIONS.ROLE_DELETE}>
                    <Button
                      danger
                      onClick={() => setDeleteOpen(true)}
                      disabled={role?.system}
                    >
                      Delete
                    </Button>
                  </Can>
                </Space>
              }
            >
              {isLoading ? (
                <Skeleton active />
              ) : (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Name">{role?.name ?? "—"}</Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {role?.description ?? "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
                    {role?.system ? <Tag color="orange">System</Tag> : "Custom"}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              title="Permissions"
              extra={
                <Can permission={PERMISSIONS.ROLE_ASSIGN_PERMISSIONS}>
                  <Button
                    type="primary"
                    onClick={handleSavePermissions}
                    loading={isSavingPermissions}
                  >
                    Save Permissions
                  </Button>
                </Can>
              }
            >
              {permissionGroups ? (
                <Collapse items={collapseItems} />
              ) : (
                <Skeleton active />
              )}
            </Card>
          </Col>
        </Row>

        <Modal
          title="Edit Role"
          open={editModalOpen}
          onOk={handleEditSubmit}
          onCancel={() => setEditModalOpen(false)}
          okText="Save"
          confirmLoading={isUpdating}
          destroyOnHidden
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name is required" }]}
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
          title="Delete Role"
          description={`Are you sure you want to delete the role "${role?.name ?? ""}"? This action cannot be undone.`}
          confirmText="Delete"
        />
      </div>
    </RequirePermission>
  );
}
