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

// ─── Custom Fields Tab ────────────────────────────────────────────────────────

export function CustomFieldsTab({
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
  const [form] = Form.useForm();
  const { trigger: replaceCustomFields, isMutating } = useReplaceAssetCustomFields(
    assetId,
    locationId
  );

  const columns = [
    { title: "Label", dataIndex: "label", key: "label" },
    { title: "Data Type", dataIndex: "dataType", key: "dataType" },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (v: string | null) => v ?? "—",
    },
  ];

  const openDrawer = () => {
    const initial: Record<string, string> = {};
    asset.customFields?.forEach((f) => {
      if (f.customFieldId) {
        initial[f.customFieldId] = f.value ?? "";
      }
    });
    form.setFieldsValue(initial);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    const vals = await form.validateFields();
    try {
      const values = Object.entries(vals).map(([customFieldId, value]) => ({
        customFieldId,
        value: String(value ?? ""),
      }));
      await replaceCustomFields({ values });
      message.success("Custom fields updated");
      setDrawerOpen(false);
    } catch {
      message.error("Failed to update custom fields");
    }
  };

  const renderField = (dataType: string) => {
    switch (dataType) {
      case "NUMBER":
        return <InputNumber style={{ width: "100%" }} />;
      case "DATE":
        return <DatePicker style={{ width: "100%" }} />;
      case "BOOLEAN":
        return (
          <Select
            options={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
          />
        );
      default:
        return <Input />;
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Can permission={PERMISSIONS.ASSET_UPDATE}>
          <Button type="primary" onClick={openDrawer}>
            Edit Values
          </Button>
        </Can>
      </Space>

      <DataTable
        dataSource={asset.customFields ?? []}
        columns={columns}
        rowKey="customFieldId"
        pagination={false}
      />

      <Drawer
        title="Edit Custom Field Values"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={480}
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
        <Form form={form} layout="vertical">
          {asset.customFields?.map((f) => (
            <Form.Item
              key={f.customFieldId}
              name={f.customFieldId}
              label={f.label}
            >
              {renderField(f.dataType ?? "TEXT")}
            </Form.Item>
          ))}
        </Form>
      </Drawer>
    </>
  );
}
