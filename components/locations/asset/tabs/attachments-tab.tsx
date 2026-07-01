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
import { refreshAssetAttachmentUrl } from "@/lib/api/api";
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

// ─── Attachments Tab ──────────────────────────────────────────────────────────

export function AttachmentsTab({ assetId }: { assetId: string }) {
  const { message } = useAppMessage();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: attachments, isLoading, error } = useAssetAttachments(assetId);
  const { trigger: uploadAttachment, isMutating: uploading } =
    useUploadAssetAttachment(assetId);
  const { trigger: deleteAttachment, isMutating: deleting } =
    useDeleteAssetAttachment(assetId, deleteTarget ?? "");

  const handleUpload: UploadProps["customRequest"] = async ({ file }) => {
    try {
      await uploadAttachment(file as File);
      message.success("Attachment uploaded");
    } catch {
      message.error("Failed to upload attachment");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAttachment();
      message.success("Attachment deleted");
      setDeleteTarget(null);
    } catch {
      message.error("Failed to delete attachment");
    }
  };

  const handleDownload = async (attachmentId: string) => {
    try {
      const refreshed = await refreshAssetAttachmentUrl(assetId, attachmentId);
      if (refreshed.url) {
        window.open(refreshed.url, "_blank", "noopener,noreferrer");
      }
    } catch {
      message.error("Failed to download attachment");
    }
  };

  const columns: TableColumnsType<AttachmentResponse> = [
    { title: "File Name", dataIndex: "fileName", key: "fileName" },
    { title: "File Type", dataIndex: "fileType", key: "fileType" },
    {
      title: "Upload Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            style={{ padding: 0 }}
            disabled={!record.id}
            onClick={() => record.id && void handleDownload(record.id)}
          >
            Download
          </Button>
          <Can permission={PERMISSIONS.ASSET_ATTACHMENT_MANAGE}>
            <Button
              danger
              size="small"
              onClick={() => setDeleteTarget(record.id ?? null)}
            >
              Delete
            </Button>
          </Can>
        </Space>
      ),
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.ASSET_ATTACHMENT_READ}>
      <>
        <Space style={{ marginBottom: 16 }}>
          <Can permission={PERMISSIONS.ASSET_ATTACHMENT_MANAGE}>
            <Upload
              showUploadList={false}
              customRequest={handleUpload}
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload
              </Button>
            </Upload>
          </Can>
        </Space>

        <DataTable<AttachmentResponse>
          isLoading={isLoading}
          error={error}
          dataSource={attachments}
          columns={columns}
        />

        <ConfirmDelete
          open={deleteTarget !== null}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
          title="Delete Attachment"
          description="Are you sure you want to delete this attachment?"
          confirmText="Delete"
        />
      </>
    </RequirePermission>
  );
}

// ─── Assignments Tab ──────────────────────────────────────────────────────────
