"use client";

import { useState } from "react";
import { Button, Select, Space } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import Link from "@/components/link";
import RequirePermission from "@/components/require-permission";
import {
  ComplianceResultTag,
  PriorityTag,
  StatusTag,
} from "@/components/status-tag";
import { useOrganisationLocations } from "@/hooks/data/use-locations";
import { useStartJob } from "@/hooks/data/use-jobs";
import { useOrganisationJobs } from "@/hooks/data/use-organisation-jobs";
import { useAppMessage } from "@/hooks/use-app-message";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type {
  JobPriority,
  JobStatus,
  OrganisationJobSummaryResponse,
} from "@/lib/api/types";

function JobStartButton({
  jobId,
  assetId,
  status,
}: {
  jobId: string;
  assetId: string;
  status?: JobStatus;
}) {
  const { message } = useAppMessage();
  const { trigger: startJob, isMutating } = useStartJob(jobId, assetId);

  if (status !== "PENDING") return null;

  const handleStart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await startJob();
      message.success("Job started");
    } catch {
      message.error("Failed to start job");
    }
  };

  return (
    <Can permission={PERMISSIONS.JOB_EXECUTE}>
      <Button size="small" loading={isMutating} onClick={handleStart}>
        Start
      </Button>
    </Can>
  );
}

export default function OperationsJobsPage() {
  const orgId = useOrgId();
  const [locationFilter, setLocationFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<JobStatus | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<JobPriority | undefined>();

  const { data: locations } = useOrganisationLocations(orgId);
  const { data, isLoading, error } = useOrganisationJobs(orgId, {
    locationId: locationFilter,
    status: statusFilter,
    priority: priorityFilter,
  });

  const columns: TableColumnsType<OrganisationJobSummaryResponse> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title ?? "").localeCompare(b.title ?? ""),
      render: (title: string, record) => (
        <Link
          href={`/locations/${record.locationId}/assets/${record.assetId}/jobs/${record.id}`}
        >
          {title}
        </Link>
      ),
    },
    {
      title: "Asset",
      dataIndex: "assetName",
      key: "assetName",
      render: (name: string | undefined, record) =>
        name && record.assetId && record.locationId ? (
          <Link
            href={`/locations/${record.locationId}/assets/${record.assetId}`}
          >
            {name}
          </Link>
        ) : (
          name ?? "—"
        ),
    },
    {
      title: "Location",
      dataIndex: "locationName",
      key: "locationName",
      render: (name: string | undefined, record) =>
        name && record.locationId ? (
          <Link href={`/locations/${record.locationId}`}>{name}</Link>
        ) : (
          name ?? "—"
        ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (v?: string) => <PriorityTag priority={v} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v?: string) => <StatusTag status={v} />,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf(),
      defaultSortOrder: "ascend",
      render: (v?: string) => {
        if (!v) return "—";
        const due = dayjs(v);
        const overdue =
          due.isBefore(dayjs(), "day") &&
          statusFilter !== "COMPLETED" &&
          statusFilter !== "ARCHIVED";
        return (
          <span style={overdue ? { color: "#cf1322", fontWeight: 500 } : undefined}>
            {due.format("YYYY-MM-DD")}
          </span>
        );
      },
    },
    {
      title: "Compliance",
      dataIndex: "complianceResult",
      key: "complianceResult",
      render: (v?: string) => <ComplianceResultTag result={v} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.id && record.assetId ? (
          <JobStartButton
            jobId={record.id}
            assetId={record.assetId}
            status={record.status}
          />
        ) : null,
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.JOB_READ}>
      <DashboardPageShell
        title="Jobs"
        subtitle="Operations queue across all locations"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Jobs" },
        ]}
        filters={
          <Space wrap>
            <Select
              allowClear
              placeholder="All locations"
              style={{ minWidth: 200 }}
              value={locationFilter}
              onChange={setLocationFilter}
              options={locations?.map((loc) => ({
                label: loc.name,
                value: loc.id,
              }))}
            />
            <Select
              allowClear
              placeholder="All statuses"
              style={{ minWidth: 160 }}
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
              placeholder="All priorities"
              style={{ minWidth: 160 }}
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { label: "Low", value: "LOW" },
                { label: "Medium", value: "MEDIUM" },
                { label: "High", value: "HIGH" },
                { label: "Critical", value: "CRITICAL" },
              ]}
            />
          </Space>
        }
      >
        <DataTable<OrganisationJobSummaryResponse>
          isLoading={isLoading}
          error={error}
          dataSource={data}
          columns={columns}
        />
      </DashboardPageShell>
    </RequirePermission>
  );
}
