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

export function OverviewTab({
  asset,
  locationId,
  assetId,
}: {
  asset: NonNullable<ReturnType<typeof useAsset>["data"]>;
  locationId: string;
  assetId: string;
}) {
  const { message } = useAppMessage();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [decommissionOpen, setDecommissionOpen] = useState(false);
  const [form] = Form.useForm<UpdateAssetRequest>();

  const { data: statuses } = useAssetStatuses();
  const { data: lines } = useLocationLines(locationId);
  const { trigger: updateAsset, isMutating: updatingAsset } = useUpdateAsset(
    locationId,
    assetId
  );
  const { trigger: deleteAsset, isMutating: deletingAsset } = useDeleteAsset(
    locationId,
    assetId
  );

  const handleEdit = async () => {
    const values = await form.validateFields();
    try {
      await updateAsset({
        ...values,
        purchaseDate: values.purchaseDate
          ? dayjs(values.purchaseDate as unknown as string).format("YYYY-MM-DD")
          : undefined,
        warrantyExpiry: values.warrantyExpiry
          ? dayjs(values.warrantyExpiry as unknown as string).format(
              "YYYY-MM-DD"
            )
          : undefined,
      });
      message.success("Asset updated successfully");
      setEditOpen(false);
    } catch {
      message.error("Failed to update asset");
    }
  };

  const handleDecommission = async () => {
    try {
      await deleteAsset();
      message.success("Asset decommissioned");
      router.push(`/locations/${locationId}`);
    } catch {
      message.error("Failed to decommission asset");
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Can permission={PERMISSIONS.ASSET_UPDATE}>
          <Button onClick={() => setEditOpen(true)}>Edit</Button>
        </Can>
        {!asset.decommissionedAt && (
          <Can permission={PERMISSIONS.ASSET_DECOMMISSION}>
            <Button
              danger
              onClick={() => setDecommissionOpen(true)}
            >
              Decommission
            </Button>
          </Can>
        )}
      </Space>

      <Descriptions bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Category">
          {asset.categoryName ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          {asset.typeName ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Line">
          {asset.lineName ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Model Number">
          {asset.modelNumber ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Manufacturer">
          {asset.manufacturer ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <AssetStatusTag statusLabel={asset.statusLabel} />
        </Descriptions.Item>
        <Descriptions.Item label="Criticality">
          <CriticalityTag criticality={asset.criticality} />
        </Descriptions.Item>
        <Descriptions.Item label="Purchase Date">
          {asset.purchaseDate
            ? dayjs(asset.purchaseDate).format("YYYY-MM-DD")
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Purchase Cost">
          {asset.purchaseCost != null ? asset.purchaseCost : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty Expiry">
          {asset.warrantyExpiry
            ? dayjs(asset.warrantyExpiry).format("YYYY-MM-DD")
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Specific Location">
          {asset.specificLocationDetails ?? "—"}
        </Descriptions.Item>
        {(asset.geoLatitude != null || asset.geoLongitude != null) && (
          <Descriptions.Item label="Geo">
            {asset.geoLatitude}, {asset.geoLongitude}
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* Edit Drawer */}
      <Drawer
        title="Edit Asset"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        size={480}
        destroyOnHidden
        footer={
          <Space>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={updatingAsset}
              onClick={handleEdit}
            >
              Save
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...asset,
            purchaseDate: asset.purchaseDate
              ? dayjs(asset.purchaseDate)
              : undefined,
            warrantyExpiry: asset.warrantyExpiry
              ? dayjs(asset.warrantyExpiry)
              : undefined,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="lineId" label="Line">
            <Select
              allowClear
              options={lines?.map((l) => ({ label: l.name, value: l.id }))}
            />
          </Form.Item>
          <Form.Item name="modelNumber" label="Model Number">
            <Input />
          </Form.Item>
          <Form.Item name="manufacturer" label="Manufacturer">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              allowClear
              options={statuses?.map((s) => ({
                label: s.label,
                value: s.code,
              }))}
            />
          </Form.Item>
          <Form.Item name="criticality" label="Criticality">
            <Select
              allowClear
              options={[
                { label: "Low", value: "LOW" },
                { label: "Medium", value: "MEDIUM" },
                { label: "High", value: "HIGH" },
                { label: "Critical", value: "CRITICAL" },
              ]}
            />
          </Form.Item>
          <Form.Item name="purchaseDate" label="Purchase Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="purchaseCost" label="Purchase Cost">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="warrantyExpiry" label="Warranty Expiry">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="specificLocationDetails"
            label="Specific Location Details"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="geoLatitude" label="Geo Latitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="geoLongitude" label="Geo Longitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Drawer>

      <ConfirmDelete
        open={decommissionOpen}
        onConfirm={handleDecommission}
        onCancel={() => setDecommissionOpen(false)}
        loading={deletingAsset}
        title="Decommission Asset"
        description="This will decommission the asset. This action cannot be undone."
      />
    </>
  );
}
