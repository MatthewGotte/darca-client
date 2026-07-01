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

export function ComplianceTab({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  const { message } = useAppMessage();
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
          destroyOnHidden
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
