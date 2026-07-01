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

export function StatusHistoryTab({ assetId }: { assetId: string }) {
  const { data, isLoading, error } = useAssetStatusHistory(assetId);

  const columns: TableColumnsType<AssetStatusHistoryResponse> = [
    {
      title: "Status",
      dataIndex: "statusLabel",
      key: "statusLabel",
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: "Changed By",
      dataIndex: "changedByUserName",
      key: "changedByUserName",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm"),
    },
  ];

  return (
    <DataTable<AssetStatusHistoryResponse>
      isLoading={isLoading}
      error={error}
      dataSource={data}
      columns={columns}
    />
  );
}

// ─── Compliance Tab ───────────────────────────────────────────────────────────
