"use client";

import { useMemo, useState } from "react";
import { Card, Col, Row, Select, Space, Tag } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import DataTable from "@/components/data-table";
import Link from "@/components/link";
import RequirePermission from "@/components/require-permission";
import { useOrganisationLocations } from "@/hooks/data/use-locations";
import { useOrganisationComplianceSchedules } from "@/hooks/data/use-organisation-compliance-schedules";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { ComplianceScheduleSummaryResponse } from "@/lib/api/types";

function DueDateCell({ value }: { value?: string }) {
  if (!value) return <>—</>;
  const due = dayjs(value);
  const overdue = due.isBefore(dayjs(), "day");
  const dueSoon =
    !overdue && due.isBefore(dayjs().add(7, "day"), "day");
  return (
    <Space>
      <span
        style={
          overdue
            ? { color: "#cf1322", fontWeight: 600 }
            : dueSoon
              ? { color: "#d48806", fontWeight: 500 }
              : undefined
        }
      >
        {due.format("YYYY-MM-DD")}
      </span>
      {overdue ? <Tag color="red">Overdue</Tag> : null}
      {dueSoon ? <Tag color="orange">Due soon</Tag> : null}
    </Space>
  );
}

export default function OperationsCompliancePage() {
  const orgId = useOrgId();
  const [locationFilter, setLocationFilter] = useState<string | undefined>();
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(true);
  const [overdueFilter, setOverdueFilter] = useState<boolean | undefined>();

  const { data: locations } = useOrganisationLocations(orgId);
  const { data: allSchedules } = useOrganisationComplianceSchedules(orgId, {
    active: true,
  });
  const { data, isLoading, error } = useOrganisationComplianceSchedules(orgId, {
    locationId: locationFilter,
    active: activeFilter,
    overdue: overdueFilter,
  });

  const stats = useMemo(() => {
    const now = dayjs();
    const schedules = allSchedules ?? [];
    const overdue = schedules.filter(
      (s) => s.nextDueDate && dayjs(s.nextDueDate).isBefore(now, "day")
    ).length;
    const dueThisWeek = schedules.filter((s) => {
      if (!s.nextDueDate) return false;
      const due = dayjs(s.nextDueDate);
      return (
        !due.isBefore(now, "day") &&
        due.isBefore(now.add(7, "day"), "day")
      );
    }).length;
    return {
      active: schedules.length,
      overdue,
      dueThisWeek,
    };
  }, [allSchedules]);

  const columns: TableColumnsType<ComplianceScheduleSummaryResponse> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title ?? "").localeCompare(b.title ?? ""),
      render: (title: string, record) =>
        record.assetId && record.locationId && record.id ? (
          <Link
            href={`/locations/${record.locationId}/assets/${record.assetId}/compliance/${record.id}`}
          >
            {title}
          </Link>
        ) : (
          title
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
      title: "Frequency",
      key: "frequency",
      render: (_, record) =>
        `${record.frequencyInterval} ${record.frequencyUnit}`,
    },
    {
      title: "Next Due",
      dataIndex: "nextDueDate",
      key: "nextDueDate",
      sorter: (a, b) =>
        dayjs(a.nextDueDate).valueOf() - dayjs(b.nextDueDate).valueOf(),
      defaultSortOrder: "ascend",
      render: (v?: string) => <DueDateCell value={v} />,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active?: boolean) =>
        active ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.COMPLIANCE_SCHEDULE_READ}>
      <DashboardPageShell
        title="Compliance"
        subtitle="Upcoming and overdue compliance schedules across your organisation"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compliance" },
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
              style={{ minWidth: 140 }}
              value={activeFilter}
              onChange={setActiveFilter}
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
            />
            <Select
              allowClear
              placeholder="All due dates"
              style={{ minWidth: 160 }}
              value={overdueFilter}
              onChange={setOverdueFilter}
              options={[
                { label: "Overdue", value: true },
                { label: "Upcoming", value: false },
              ]}
            />
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.active}</div>
              <div style={{ color: "#8c8c8c" }}>Active schedules</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#cf1322" }}>
                {stats.overdue}
              </div>
              <div style={{ color: "#8c8c8c" }}>Overdue</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#d48806" }}>
                {stats.dueThisWeek}
              </div>
              <div style={{ color: "#8c8c8c" }}>Due this week</div>
            </Card>
          </Col>
        </Row>

        <DataTable<ComplianceScheduleSummaryResponse>
          isLoading={isLoading}
          error={error}
          dataSource={data}
          columns={columns}
        />
      </DashboardPageShell>
    </RequirePermission>
  );
}
