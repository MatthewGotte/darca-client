"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tag,
  Upload,
} from "antd";
import type { TableColumnsType, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import ConfirmDelete from "@/components/confirm-delete";
import RequirePermission from "@/components/require-permission";
import Link from "@/components/link";
import {
  AssetStatusTag,
  CriticalityTag,
  StatusTag,
  PriorityTag,
  ComplianceResultTag,
} from "@/components/status-tag";
import { useAppMessage } from "@/hooks/use-app-message";
import {
  useAsset,
  useAssetStatuses,
  useAssetStatusHistory,
  useAssetAttachments,
  useUpdateAsset,
  useDeleteAsset,
  useReplaceAssetIdentifiers,
  useReplaceAssetCustomFields,
  useUploadAssetAttachment,
  useDeleteAssetAttachment,
  useAssignAssetUser,
  useUnassignAssetUser,
} from "@/hooks/data/use-assets";
import {
  useAssetJobs,
  useCreateAssetJob,
} from "@/hooks/data/use-jobs";
import {
  useAssetComplianceSchedules,
  useCreateAssetComplianceSchedule,
} from "@/hooks/data/use-compliance-schedules";
import { useOrganisationUsers } from "@/hooks/data/use-users";
import { useLocationLines } from "@/hooks/data/use-lines";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type {
  UpdateAssetRequest,
  AssetStatusHistoryResponse,
  AttachmentResponse,
  JobSummaryResponse,
  ComplianceScheduleResponse,
  JobStatus,
  JobPriority,
} from "@/lib/api/types";

export function AssignmentsTab({
  asset,
  assetId,
  locationId,
}: {
  asset: NonNullable<ReturnType<typeof useAsset>["data"]>;
  assetId: string;
  locationId: string;
}) {
  const { message } = useAppMessage();
  const orgId = useOrgId();
  const [assignOpen, setAssignOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  const { data: users } = useOrganisationUsers(orgId);
  const { trigger: assignUser, isMutating: assigning } = useAssignAssetUser(
    assetId,
    locationId
  );
  const { trigger: unassignUser, isMutating: unassigning } =
    useUnassignAssetUser(assetId, locationId, removeTarget ?? "");

  const handleAssign = async () => {
    if (!selectedUserId) return;
    try {
      await assignUser({ userId: selectedUserId });
      message.success("User assigned");
      setAssignOpen(false);
      setSelectedUserId(undefined);
    } catch {
      message.error("Failed to assign user");
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignUser();
      message.success("User removed");
      setRemoveTarget(null);
    } catch {
      message.error("Failed to remove user");
    }
  };

  const columns = [
    { title: "User Name", dataIndex: "userName", key: "userName" },
    {
      title: "Assigned At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: { userId: string }) => (
        <Can permission={PERMISSIONS.ASSET_ASSIGN}>
          <Button
            danger
            size="small"
            onClick={() => setRemoveTarget(record.userId)}
          >
            Remove
          </Button>
        </Can>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Can permission={PERMISSIONS.ASSET_ASSIGN}>
          <Button type="primary" onClick={() => setAssignOpen(true)}>
            Assign User
          </Button>
        </Can>
      </Space>

      <DataTable
        dataSource={(asset.assignments ?? []).filter(
          (assignment): assignment is typeof assignment & { userId: string } =>
            assignment.userId != null
        )}
        columns={columns}
        rowKey="userId"
        pagination={false}
      />

      <Modal
        title="Assign User"
        open={assignOpen}
        onOk={handleAssign}
        onCancel={() => {
          setAssignOpen(false);
          setSelectedUserId(undefined);
        }}
        okText="Assign"
        confirmLoading={assigning}
        destroyOnHidden
      >
        <Select
          style={{ width: "100%", marginTop: 16 }}
          placeholder="Select a user"
          value={selectedUserId}
          onChange={setSelectedUserId}
          options={users?.map((u) => ({ label: u.name, value: u.id }))}
          showSearch
          filterOption={(input, opt) =>
            (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Modal>

      <ConfirmDelete
        open={removeTarget !== null}
        onConfirm={handleUnassign}
        onCancel={() => setRemoveTarget(null)}
        loading={unassigning}
        title="Remove Assignment"
        description="Are you sure you want to remove this user assignment?"
        confirmText="Remove"
      />
    </>
  );
}

// ─── Status History Tab ────────────────────────────────────────────────────────
