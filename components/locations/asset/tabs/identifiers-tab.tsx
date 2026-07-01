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

// ─── Identifiers Tab ─────────────────────────────────────────────────────────

type IdentifierRow = {
  type: string;
  value: string;
  active?: boolean;
};

export function IdentifiersTab({
  asset,
  assetId,
  locationId,
}: {
  asset: NonNullable<ReturnType<typeof useAsset>["data"]>;
  assetId: string;
  locationId: string;
}) {
  const { message } = useAppMessage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState<IdentifierRow[]>([]);
  const { trigger: replaceIdentifiers, isMutating } = useReplaceAssetIdentifiers(
    assetId,
    locationId
  );

  const openDrawer = () => {
    setRows(
      (asset.identifiers ?? [])
        .filter(
          (id): id is typeof id & { type: string; value: string } =>
            id.type != null && id.value != null
        )
        .map((id) => ({
          type: id.type,
          value: id.value,
          active: id.active ?? true,
        }))
    );
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      await replaceIdentifiers({
        identifiers: rows.map((row) => ({
          type: row.type as
            | "SERIAL_NUMBER"
            | "BARCODE"
            | "QR_CODE"
            | "RFID"
            | "TAG"
            | "ASSET_TAG",
          value: row.value,
          active: row.active,
        })),
      });
      message.success("Identifiers updated");
      setDrawerOpen(false);
    } catch {
      message.error("Failed to update identifiers");
    }
  };

  const IDENTIFIER_TYPES = [
    "SERIAL_NUMBER",
    "BARCODE",
    "QR_CODE",
    "RFID",
    "TAG",
    "ASSET_TAG",
  ];

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (t: string) => <Tag>{t}</Tag>,
    },
    { title: "Value", dataIndex: "value", key: "value" },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (a: boolean) => (a ? "Yes" : "No"),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Can permission={PERMISSIONS.ASSET_IDENTIFIER_MANAGE}>
          <Button type="primary" onClick={openDrawer}>
            Manage Identifiers
          </Button>
        </Can>
      </Space>

      <DataTable
        dataSource={asset.identifiers ?? []}
        columns={columns}
        rowKey={(r) => `${r.type}-${r.value}`}
        pagination={false}
      />

      <Drawer
        title="Manage Identifiers"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={520}
        destroyOnHidden
        footer={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" loading={isMutating} onClick={handleSave}>
              Save
            </Button>
          </Space>
        }
      >
        <Space orientation="vertical" style={{ width: "100%" }}>
          {rows.map((row, i) => (
            <Space key={i} align="start">
              <Select
                value={row.type}
                style={{ width: 150 }}
                options={IDENTIFIER_TYPES.map((t) => ({
                  label: t,
                  value: t,
                }))}
                onChange={(v) => {
                  const next = [...rows];
                  next[i] = { ...next[i], type: v };
                  setRows(next);
                }}
              />
              <Input
                value={row.value}
                placeholder="Value"
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = { ...next[i], value: e.target.value };
                  setRows(next);
                }}
              />
              <Checkbox
                checked={row.active ?? true}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = { ...next[i], active: e.target.checked };
                  setRows(next);
                }}
              >
                Active
              </Checkbox>
              <Button
                danger
                size="small"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </Space>
          ))}
          <Button
            onClick={() =>
              setRows([...rows, { type: "SERIAL_NUMBER", value: "", active: true }])
            }
          >
            Add Row
          </Button>
        </Space>
      </Drawer>
    </>
  );
}
