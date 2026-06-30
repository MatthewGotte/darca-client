"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "@/hooks/use-auth";
import { useOrganisationJobs } from "@/hooks/data/use-jobs";
import type { JobSummaryResponse, JobStatus } from "@/lib/api/types";

const { Title, Text } = Typography;

const statusColors: Record<JobStatus, string> = {
  PENDING: "gold",
  IN_PROGRESS: "processing",
  COMPLETED: "success",
  ARCHIVED: "default",
};

const columns: ColumnsType<JobSummaryResponse> = [
  {
    title: "Job",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Asset",
    dataIndex: "assetName",
    key: "assetName",
    render: (value: string | undefined) => value ?? "—",
  },
  {
    title: "Location",
    dataIndex: "locationName",
    key: "locationName",
    render: (value: string | undefined) => value ?? "—",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: JobStatus | undefined) =>
      status ? <Tag color={statusColors[status]}>{status.replace("_", " ")}</Tag> : "—",
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
  },
  {
    title: "Due",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (value: string | undefined) =>
      value ? new Date(value).toLocaleDateString() : "—",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const orgId = user?.organisationId;
  const { data: jobs, isLoading } = useOrganisationJobs(orgId, {
    status: "PENDING",
  });
  const { data: inProgressJobs, isLoading: inProgressLoading } =
    useOrganisationJobs(orgId, { status: "IN_PROGRESS" });

  const queue = [...(jobs ?? []), ...(inProgressJobs ?? [])];

  return (
    <div>
      <Title level={2}>Home</Title>
      <Text type="secondary">
        Organisation-wide job queue across all locations.
      </Text>

      <Card title="Open jobs" style={{ marginTop: 24 }}>
        <Table
          rowKey="id"
          loading={isLoading || inProgressLoading}
          columns={columns}
          dataSource={queue}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No open jobs across your sites." }}
        />
      </Card>
    </div>
  );
}
