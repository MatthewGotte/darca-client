"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Tabs,
  Typography,
  message,
} from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

import PageHeader from "@/components/page-header";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import ConfirmDelete from "@/components/confirm-delete";
import RequirePermission from "@/components/require-permission";
import {
  StatusTag,
  PriorityTag,
  ComplianceResultTag,
} from "@/components/status-tag";

import {
  useJob,
  useJobHistory,
  useUpdateJob,
  useStartJob,
  useCompleteJob,
  useArchiveJob,
  useAssignJobUser,
  useUnassignJobUser,
} from "@/hooks/data/use-jobs";
import { useAsset } from "@/hooks/data/use-assets";
import { useOrganisationLocation } from "@/hooks/data/use-locations";
import { useOrganisationUsers } from "@/hooks/data/use-users";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type {
  JobHistoryResponse,
  UpdateJobRequest,
  CompleteJobRequest,
} from "@/lib/api/types";

// ─── Details Tab ──────────────────────────────────────────────────────────────

function DetailsTab({
  job,
}: {
  job: NonNullable<ReturnType<typeof useJob>["data"]>;
}) {
  return (
    <>
      <Descriptions bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Type">{job.type}</Descriptions.Item>
        <Descriptions.Item label="Priority">
          <PriorityTag priority={job.priority} />
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <StatusTag status={job.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Due Date">
          {job.dueDate ? dayjs(job.dueDate).format("YYYY-MM-DD") : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Started At">
          {job.startedAt ? dayjs(job.startedAt).format("YYYY-MM-DD HH:mm") : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Completed At">
          {job.completedAt
            ? dayjs(job.completedAt).format("YYYY-MM-DD HH:mm")
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Archived At">
          {job.archivedAt ? dayjs(job.archivedAt).format("YYYY-MM-DD HH:mm") : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Compliance Result">
          <ComplianceResultTag result={job.complianceResult} />
        </Descriptions.Item>
      </Descriptions>
      {job.description && (
        <Typography.Paragraph style={{ marginTop: 16 }}>
          {job.description}
        </Typography.Paragraph>
      )}
    </>
  );
}

// ─── Assignments Tab ──────────────────────────────────────────────────────────

function AssignmentsTab({
  job,
  jobId,
}: {
  job: NonNullable<ReturnType<typeof useJob>["data"]>;
  jobId: string;
}) {
  const orgId = useOrgId();
  const [assignOpen, setAssignOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  const { data: users } = useOrganisationUsers(orgId);
  const { trigger: assignUser, isMutating: assigning } =
    useAssignJobUser(jobId);
  const { trigger: unassignUser, isMutating: unassigning } =
    useUnassignJobUser(jobId, removeTarget ?? "");

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
        <Can permission={PERMISSIONS.JOB_ASSIGN}>
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
        <Can permission={PERMISSIONS.JOB_ASSIGN}>
          <Button type="primary" onClick={() => setAssignOpen(true)}>
            Assign User
          </Button>
        </Can>
      </Space>

      <DataTable
        dataSource={job.assignments ?? []}
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
        description="Are you sure you want to remove this user from the job?"
        confirmText="Remove"
      />
    </>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({ jobId }: { jobId: string }) {
  const { data, isLoading, error } = useJobHistory(jobId);

  const columns: TableColumnsType<JobHistoryResponse> = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v?: string) => <StatusTag status={v} />,
    },
    {
      title: "Compliance Result",
      dataIndex: "complianceResult",
      key: "complianceResult",
      render: (v?: string) => <ComplianceResultTag result={v} />,
    },
    {
      title: "Performed By",
      dataIndex: "performedByUserName",
      key: "performedByUserName",
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
    <RequirePermission permission={PERMISSIONS.JOB_HISTORY_READ}>
      <DataTable<JobHistoryResponse>
        isLoading={isLoading}
        error={error}
        dataSource={data}
        columns={columns}
      />
    </RequirePermission>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { locationId, assetId, jobId } = useParams<{
    locationId: string;
    assetId: string;
    jobId: string;
  }>();
  const orgId = useOrgId();

  const { data: job, isLoading } = useJob(jobId);
  const { data: asset } = useAsset(locationId, assetId);
  const { data: location } = useOrganisationLocation(orgId, locationId);

  const { trigger: startJob, isMutating: starting } = useStartJob(
    jobId,
    assetId
  );
  const { trigger: completeJob, isMutating: completing } = useCompleteJob(
    jobId,
    assetId
  );
  const { trigger: archiveJob, isMutating: archiving } = useArchiveJob(
    jobId,
    assetId
  );
  const { trigger: updateJob, isMutating: updating } = useUpdateJob(
    jobId,
    assetId
  );

  const [editOpen, setEditOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [editForm] = Form.useForm<UpdateJobRequest>();
  const [completeForm] = Form.useForm<CompleteJobRequest>();

  const handleEdit = async () => {
    const values = await editForm.validateFields();
    try {
      await updateJob({
        ...values,
        dueDate: values.dueDate
          ? dayjs(values.dueDate as unknown as string).toISOString()
          : undefined,
      });
      message.success("Job updated");
      setEditOpen(false);
    } catch {
      message.error("Failed to update job");
    }
  };

  const handleStart = async () => {
    try {
      await startJob();
      message.success("Job started");
      setStartOpen(false);
    } catch {
      message.error("Failed to start job");
    }
  };

  const handleComplete = async () => {
    const values = await completeForm.validateFields();
    try {
      await completeJob(values);
      message.success("Job completed");
      setCompleteOpen(false);
    } catch {
      message.error("Failed to complete job");
    }
  };

  const handleArchive = async () => {
    try {
      await archiveJob();
      message.success("Job archived");
      setArchiveOpen(false);
    } catch {
      message.error("Failed to archive job");
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!job) {
    return null;
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    {
      label: location?.name ?? locationId,
      href: `/locations/${locationId}`,
    },
    {
      label: asset?.name ?? assetId,
      href: `/locations/${locationId}/assets/${assetId}`,
    },
    { label: "Jobs" },
    { label: job.title },
  ];

  const lifecycleActions = (
    <Space>
      {job.status === "PENDING" && (
        <Can permission={PERMISSIONS.JOB_EXECUTE}>
          <Button loading={starting} onClick={() => setStartOpen(true)}>
            Start
          </Button>
        </Can>
      )}
      {job.status === "IN_PROGRESS" && (
        <Can permission={PERMISSIONS.JOB_RECORD_COMPLIANCE}>
          <Button
            type="primary"
            loading={completing}
            onClick={() => setCompleteOpen(true)}
          >
            Complete
          </Button>
        </Can>
      )}
      {job.status === "COMPLETED" && (
        <Can permission={PERMISSIONS.JOB_ARCHIVE}>
          <Button loading={archiving} onClick={() => setArchiveOpen(true)}>
            Archive
          </Button>
        </Can>
      )}
      {job.status !== "ARCHIVED" && (
        <Can permission={PERMISSIONS.JOB_UPDATE}>
          <Button
            onClick={() => {
              editForm.setFieldsValue({
                ...job,
                dueDate: job.dueDate
                  ? (dayjs(job.dueDate) as unknown as string)
                  : undefined,
              });
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
        </Can>
      )}
    </Space>
  );

  const tabItems = [
    {
      key: "details",
      label: "Details",
      children: <DetailsTab job={job} />,
    },
    {
      key: "assignments",
      label: "Assignments",
      children: <AssignmentsTab job={job} jobId={jobId} />,
    },
    {
      key: "history",
      label: "History",
      children: <HistoryTab jobId={jobId} />,
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.JOB_READ}>
      <div>
        <PageHeader
          title={
            <Space>
              {job.title}
              <StatusTag status={job.status} />
              <PriorityTag priority={job.priority} />
            </Space>
          }
          breadcrumbs={breadcrumbs}
          actions={lifecycleActions}
        />

        <Tabs items={tabItems} />

        {/* Edit Job Drawer */}
        <Drawer
          title="Edit Job"
          open={editOpen}
          onClose={() => setEditOpen(false)}
          width={480}
          destroyOnHide
          footer={
            <Space>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="primary" loading={updating} onClick={handleEdit}>
                Save
              </Button>
            </Space>
          }
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
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
          </Form>
        </Drawer>

        {/* Start Confirm Modal */}
        <Modal
          title="Start Job"
          open={startOpen}
          onOk={handleStart}
          onCancel={() => setStartOpen(false)}
          okText="Start"
          confirmLoading={starting}
          destroyOnHide
        >
          <Typography.Text>
            Are you sure you want to start this job? It will transition from
            Pending to In Progress.
          </Typography.Text>
        </Modal>

        {/* Complete Job Modal */}
        <Modal
          title="Complete Job"
          open={completeOpen}
          onOk={handleComplete}
          onCancel={() => {
            setCompleteOpen(false);
            completeForm.resetFields();
          }}
          okText="Complete"
          confirmLoading={completing}
          destroyOnHide
        >
          <Form form={completeForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="complianceResult"
              label="Compliance Result"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                options={[
                  { label: "Pass", value: "PASS" },
                  { label: "Fail", value: "FAIL" },
                  { label: "Not Applicable", value: "NOT_APPLICABLE" },
                ]}
              />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Archive Confirm */}
        <ConfirmDelete
          open={archiveOpen}
          onConfirm={handleArchive}
          onCancel={() => setArchiveOpen(false)}
          loading={archiving}
          title="Archive Job"
          description="This will archive the completed job."
          confirmText="Archive"
        />
      </div>
    </RequirePermission>
  );
}
