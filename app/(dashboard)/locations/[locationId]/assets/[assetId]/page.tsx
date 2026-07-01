"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Skeleton,
  Space,
  Tabs,
  Tag,
  Upload,
  message,
} from "antd";
import type { TableColumnsType, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import PageHeader from "@/components/page-header";
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
import { useOrganisationLocation } from "@/hooks/data/use-locations";
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

// ─── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab({
  asset,
  locationId,
  assetId,
}: {
  asset: NonNullable<ReturnType<typeof useAsset>["data"]>;
  locationId: string;
  assetId: string;
}) {
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
        width={480}
        destroyOnHide
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
                value: s.status,
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

// ─── Identifiers Tab ─────────────────────────────────────────────────────────

type IdentifierRow = {
  type: string;
  value: string;
  active?: boolean;
};

function IdentifiersTab({
  asset,
  assetId,
  locationId,
}: {
  asset: NonNullable<ReturnType<typeof useAsset>["data"]>;
  assetId: string;
  locationId: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState<IdentifierRow[]>([]);
  const { trigger: replaceIdentifiers, isMutating } = useReplaceAssetIdentifiers(
    assetId,
    locationId
  );

  const openDrawer = () => {
    setRows(
      asset.identifiers?.map((id) => ({
        type: id.type,
        value: id.value,
        active: id.active ?? true,
      })) ?? []
    );
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      await replaceIdentifiers({ identifiers: rows });
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
        width={520}
        destroyOnHide
        footer={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" loading={isMutating} onClick={handleSave}>
              Save
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
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

// ─── Custom Fields Tab ────────────────────────────────────────────────────────

function CustomFieldsTab({
  asset,
  assetId,
  locationId,
}: {
  asset: NonNullable<ReturnType<typeof useAsset>["data"]>;
  assetId: string;
  locationId: string;
}) {
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
      initial[f.customFieldId] = f.value ?? "";
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
        width={480}
        destroyOnHide
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
              {renderField(f.dataType)}
            </Form.Item>
          ))}
        </Form>
      </Drawer>
    </>
  );
}

// ─── Attachments Tab ──────────────────────────────────────────────────────────

function AttachmentsTab({ assetId }: { assetId: string }) {
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
          <a href={record.url} target="_blank" rel="noopener noreferrer">
            Download
          </a>
          <Can permission={PERMISSIONS.ASSET_ATTACHMENT_MANAGE}>
            <Button
              danger
              size="small"
              onClick={() => setDeleteTarget(record.id)}
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

function AssignmentsTab({
  asset,
  assetId,
  locationId,
}: {
  asset: NonNullable<ReturnType<typeof useAsset>["data"]>;
  assetId: string;
  locationId: string;
}) {
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
        dataSource={asset.assignments ?? []}
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
        destroyOnHide
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

function StatusHistoryTab({ assetId }: { assetId: string }) {
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

function ComplianceTab({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useAssetComplianceSchedules(assetId);
  const { trigger: createSchedule, isMutating } =
    useCreateAssetComplianceSchedule(assetId);

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createSchedule({
        ...values,
        nextDueDate: values.nextDueDate
          ? dayjs(values.nextDueDate).toISOString()
          : undefined,
      });
      message.success("Compliance schedule created");
      form.resetFields();
      setCreateOpen(false);
    } catch {
      message.error("Failed to create compliance schedule");
    }
  };

  const columns: TableColumnsType<ComplianceScheduleResponse> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record) => (
        <a
          onClick={() =>
            router.push(
              `/locations/${locationId}/assets/${assetId}/compliance/${record.id}`
            )
          }
          style={{ cursor: "pointer" }}
        >
          {title}
        </a>
      ),
    },
    {
      title: "Frequency",
      key: "frequency",
      render: (_, record) =>
        `${record.frequencyInterval} ${record.frequencyUnit}`,
    },
    {
      title: "Next Due Date",
      dataIndex: "nextDueDate",
      key: "nextDueDate",
      render: (v?: string) => (v ? dayjs(v).format("YYYY-MM-DD") : "—"),
    },
    {
      title: "Last Triggered",
      dataIndex: "lastTriggeredAt",
      key: "lastTriggeredAt",
      render: (v?: string) => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "—"),
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (v: boolean) => (
        <Tag color={v ? "green" : "default"}>{v ? "Active" : "Inactive"}</Tag>
      ),
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.COMPLIANCE_SCHEDULE_READ}>
      <>
        <Space style={{ marginBottom: 16 }}>
          <Can permission={PERMISSIONS.COMPLIANCE_SCHEDULE_CREATE}>
            <Button type="primary" onClick={() => setCreateOpen(true)}>
              New Schedule
            </Button>
          </Can>
        </Space>

        <DataTable<ComplianceScheduleResponse>
          isLoading={isLoading}
          error={error}
          dataSource={data}
          columns={columns}
        />

        <Modal
          title="New Compliance Schedule"
          open={createOpen}
          onOk={handleCreate}
          onCancel={() => {
            setCreateOpen(false);
            form.resetFields();
          }}
          okText="Create"
          confirmLoading={isMutating}
          destroyOnHide
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="frequencyInterval"
              label="Frequency Interval"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="frequencyUnit"
              label="Frequency Unit"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                options={[
                  { label: "Hours", value: "HOURS" },
                  { label: "Days", value: "DAYS" },
                  { label: "Weeks", value: "WEEKS" },
                  { label: "Months", value: "MONTHS" },
                  { label: "Years", value: "YEARS" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="nextDueDate"
              label="Next Due Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </RequirePermission>
  );
}

// ─── Jobs Tab ─────────────────────────────────────────────────────────────────

function JobsTab({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  const { data: schedules } = useAssetComplianceSchedules(assetId);
  const [statusFilter, setStatusFilter] = useState<JobStatus | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<
    JobPriority | undefined
  >();
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useAssetJobs(assetId, {
    status: statusFilter,
    priority: priorityFilter,
  });
  const { trigger: createJob, isMutating } = useCreateAssetJob(assetId);

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createJob({
        ...values,
        dueDate: values.dueDate
          ? dayjs(values.dueDate).toISOString()
          : undefined,
      });
      message.success("Job created");
      form.resetFields();
      setCreateOpen(false);
    } catch {
      message.error("Failed to create job");
    }
  };

  const columns: TableColumnsType<JobSummaryResponse> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record) => (
        <Link
          href={`/locations/${locationId}/assets/${assetId}/jobs/${record.id}`}
        >
          {title}
        </Link>
      ),
    },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (v: string) => <PriorityTag priority={v} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: string) => <StatusTag status={v} />,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (v?: string) => (v ? dayjs(v).format("YYYY-MM-DD") : "—"),
    },
    {
      title: "Compliance Result",
      dataIndex: "complianceResult",
      key: "complianceResult",
      render: (v?: string) => <ComplianceResultTag result={v} />,
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.JOB_READ}>
      <>
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            allowClear
            placeholder="Filter by status"
            style={{ width: 160 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Archived", value: "ARCHIVED" },
            ]}
          />
          <Select
            allowClear
            placeholder="Filter by priority"
            style={{ width: 160 }}
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
              { label: "Critical", value: "CRITICAL" },
            ]}
          />
          <Can permission={PERMISSIONS.JOB_CREATE}>
            <Button type="primary" onClick={() => setCreateOpen(true)}>
              New Job
            </Button>
          </Can>
        </Space>

        <DataTable<JobSummaryResponse>
          isLoading={isLoading}
          error={error}
          dataSource={data}
          columns={columns}
        />

        <Modal
          title="New Job"
          open={createOpen}
          onOk={handleCreate}
          onCancel={() => {
            setCreateOpen(false);
            form.resetFields();
          }}
          okText="Create"
          confirmLoading={isMutating}
          destroyOnHide
          width={560}
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: "Type is required" }]}
            >
              <Select
                options={[
                  { label: "Preventative", value: "PREVENTATIVE" },
                  { label: "Corrective", value: "CORRECTIVE" },
                  { label: "Inspection", value: "INSPECTION" },
                  { label: "Emergency", value: "EMERGENCY" },
                ]}
              />
            </Form.Item>
            <Form.Item name="priority" label="Priority">
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
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: "Due date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="complianceScheduleId" label="Compliance Schedule">
              <Select
                allowClear
                options={schedules?.map((s) => ({
                  label: s.title,
                  value: s.id,
                }))}
              />
            </Form.Item>
            <Form.Item name="parentJobId" label="Parent Job ID">
              <Input placeholder="Optional" />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </RequirePermission>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AssetDetailPage() {
  const { locationId, assetId } = useParams<{
    locationId: string;
    assetId: string;
  }>();
  const orgId = useOrgId();

  const { data: asset, isLoading } = useAsset(locationId, assetId);
  const { data: location } = useOrganisationLocation(orgId, locationId);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!asset) {
    return null;
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    {
      label: location?.name ?? locationId,
      href: `/locations/${locationId}`,
    },
    { label: asset.name },
  ];

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      children: (
        <OverviewTab asset={asset} locationId={locationId} assetId={assetId} />
      ),
    },
    {
      key: "identifiers",
      label: "Identifiers",
      children: (
        <IdentifiersTab
          asset={asset}
          assetId={assetId}
          locationId={locationId}
        />
      ),
    },
    {
      key: "custom-fields",
      label: "Custom Fields",
      children: (
        <CustomFieldsTab
          asset={asset}
          assetId={assetId}
          locationId={locationId}
        />
      ),
    },
    {
      key: "attachments",
      label: "Attachments",
      children: <AttachmentsTab assetId={assetId} />,
    },
    {
      key: "assignments",
      label: "Assignments",
      children: (
        <AssignmentsTab
          asset={asset}
          assetId={assetId}
          locationId={locationId}
        />
      ),
    },
    {
      key: "status-history",
      label: "Status History",
      children: <StatusHistoryTab assetId={assetId} />,
    },
    {
      key: "compliance",
      label: "Compliance",
      children: (
        <ComplianceTab assetId={assetId} locationId={locationId} />
      ),
    },
    {
      key: "jobs",
      label: "Jobs",
      children: <JobsTab assetId={assetId} locationId={locationId} />,
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.ASSET_READ}>
      <div>
        <PageHeader
          title={
            <Space>
              {asset.name}
              <AssetStatusTag statusLabel={asset.statusLabel} />
              <CriticalityTag criticality={asset.criticality} />
            </Space>
          }
          breadcrumbs={breadcrumbs}
        />
        <Tabs items={tabItems} />
      </div>
    </RequirePermission>
  );
}
