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

export function JobsTab({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  const { message } = useAppMessage();
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
          destroyOnHidden
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
