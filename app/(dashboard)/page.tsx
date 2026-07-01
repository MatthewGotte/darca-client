"use client";

import {
  ApartmentOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Flex,
  List,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import Link from "@/components/link";
import Can from "@/components/can";
import { useAuth } from "@/hooks/use-auth";
import { useOrgId } from "@/hooks/use-org-id";
import { useOrganisationLocations } from "@/hooks/data/use-locations";
import { useOrganisationAssets } from "@/hooks/data/use-organisation-assets";
import { useOrganisationJobs } from "@/hooks/data/use-organisation-jobs";
import { useOrganisationComplianceSchedules } from "@/hooks/data/use-organisation-compliance-schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { PriorityTag, StatusTag } from "@/components/status-tag";

const { Text, Title } = Typography;

const SHORTCUT_TILES = [
  {
    label: "Admin",
    description: "Manage users, roles & permissions",
    href: "/admin/users",
    icon: <TeamOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
    any: [
      PERMISSIONS.USER_READ,
      PERMISSIONS.ROLE_READ,
      PERMISSIONS.PERMISSION_READ,
    ],
  },
  {
    label: "Reference",
    description: "Categories, types & custom fields",
    href: "/reference/categories",
    icon: <DatabaseOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
    permission: PERMISSIONS.CATEGORY_READ,
  },
  {
    label: "Locations",
    description: "Manage sites and production lines",
    href: "/locations",
    icon: <ApartmentOutlined style={{ fontSize: 28, color: "#faad14" }} />,
    permission: PERMISSIONS.LOCATION_READ,
  },
  {
    label: "Assets",
    description: "View and manage assets",
    href: "/operations/assets",
    icon: <AppstoreOutlined style={{ fontSize: 28, color: "#722ed1" }} />,
    permission: PERMISSIONS.ASSET_READ,
  },
  {
    label: "Jobs",
    description: "Work orders and compliance jobs",
    href: "/operations/jobs",
    icon: <ToolOutlined style={{ fontSize: 28, color: "#eb2f96" }} />,
    permission: PERMISSIONS.JOB_READ,
  },
  {
    label: "Compliance",
    description: "Schedules and due dates",
    href: "/operations/compliance",
    icon: (
      <SafetyCertificateOutlined style={{ fontSize: 28, color: "#13c2c2" }} />
    ),
    permission: PERMISSIONS.COMPLIANCE_SCHEDULE_READ,
  },
];

function StatCard({
  title,
  value,
  href,
  color,
  loading,
}: {
  title: string;
  value?: number;
  href: string;
  color?: string;
  loading?: boolean;
}) {
  return (
    <Link href={href}>
      <Card hoverable style={{ height: "100%" }}>
        {loading ? (
          <Skeleton active paragraph={false} />
        ) : (
          <>
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: color ?? "inherit",
                lineHeight: 1.2,
              }}
            >
              {value ?? 0}
            </div>
            <Text type="secondary">{title}</Text>
          </>
        )}
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const { user, roles } = useAuth();
  const orgId = useOrgId();

  const { data: locations, isLoading: locationsLoading } =
    useOrganisationLocations(orgId);
  const { data: assets, isLoading: assetsLoading } = useOrganisationAssets(orgId);
  const { data: openJobs, isLoading: jobsLoading } = useOrganisationJobs(orgId, {
    status: "IN_PROGRESS",
  });
  const { data: pendingJobs } = useOrganisationJobs(orgId, {
    status: "PENDING",
  });
  const { data: myJobs, isLoading: myJobsLoading } = useOrganisationJobs(
    orgId,
    user?.id ? { assignedUserId: user.id } : undefined
  );
  const { data: overdueCompliance, isLoading: complianceLoading } =
    useOrganisationComplianceSchedules(orgId, {
      active: true,
      overdue: true,
    });

  const openJobCount =
    (openJobs?.length ?? 0) + (pendingJobs?.length ?? 0);

  return (
    <DashboardPageShell
      title={`Welcome back${user?.name ? `, ${user.name}` : ""}`}
      subtitle="Your operations command center"
    >
      <Space style={{ marginBottom: 24 }}>
        {roles.map((role) => (
          <Tag key={role} color="blue">
            {role}
          </Tag>
        ))}
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Can permission={PERMISSIONS.LOCATION_READ}>
          <Col xs={12} sm={6}>
            <StatCard
              title="Locations"
              value={locations?.length}
              href="/locations"
              loading={locationsLoading}
            />
          </Col>
        </Can>
        <Can permission={PERMISSIONS.ASSET_READ}>
          <Col xs={12} sm={6}>
            <StatCard
              title="Assets"
              value={assets?.length}
              href="/operations/assets"
              loading={assetsLoading}
            />
          </Col>
        </Can>
        <Can permission={PERMISSIONS.JOB_READ}>
          <Col xs={12} sm={6}>
            <StatCard
              title="Open jobs"
              value={openJobCount}
              href="/operations/jobs"
              loading={jobsLoading}
            />
          </Col>
        </Can>
        <Can permission={PERMISSIONS.COMPLIANCE_SCHEDULE_READ}>
          <Col xs={12} sm={6}>
            <StatCard
              title="Overdue compliance"
              value={overdueCompliance?.length}
              href="/operations/compliance"
              color="#cf1322"
              loading={complianceLoading}
            />
          </Col>
        </Can>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {SHORTCUT_TILES.map(({ label, description, href, icon, permission, any }) => (
          <Can key={label} permission={permission} any={any}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Link href={href}>
                <Card
                  hoverable
                  style={{ height: "100%" }}
                  styles={{
                    body: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 8,
                    },
                  }}
                >
                  {icon}
                  <div>
                    <Text strong style={{ display: "block" }}>
                      {label}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {description}
                    </Text>
                  </div>
                </Card>
              </Link>
            </Col>
          </Can>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Can permission={PERMISSIONS.JOB_READ}>
          <Col xs={24} lg={12}>
            <Card title="My assigned jobs">
              {myJobsLoading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : (myJobs ?? []).length === 0 ? (
                <Text type="secondary">No jobs assigned to you</Text>
              ) : (
                <List
                  dataSource={(myJobs ?? []).slice(0, 5)}
                  renderItem={(job) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          job.id && job.assetId && job.locationId ? (
                            <Link
                              href={`/locations/${job.locationId}/assets/${job.assetId}/jobs/${job.id}`}
                            >
                              {job.title}
                            </Link>
                          ) : (
                            job.title
                          )
                        }
                        description={
                          <Space wrap>
                            <StatusTag status={job.status} />
                            <PriorityTag priority={job.priority} />
                            {job.dueDate ? (
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Due {dayjs(job.dueDate).format("YYYY-MM-DD")}
                              </Text>
                            ) : null}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
              {(myJobs ?? []).length > 5 ? (
                <Link href="/operations/jobs">
                  <Text type="secondary">View all jobs →</Text>
                </Link>
              ) : null}
            </Card>
          </Col>
        </Can>

        <Can permission={PERMISSIONS.LOCATION_READ}>
          <Col xs={24} lg={12}>
            <Title level={4} style={{ marginTop: 0 }}>
              Quick location jump
            </Title>
            {locationsLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (locations ?? []).length === 0 ? (
              <Text type="secondary">No locations found</Text>
            ) : (
              <Flex
                vertical
                style={{
                  maxWidth: 480,
                  border: "1px solid #f0f0f0",
                  borderRadius: 6,
                }}
              >
                {(locations ?? []).slice(0, 6).map((loc, index, items) => (
                  <Flex
                    key={loc.id}
                    align="center"
                    style={{
                      padding: "12px 16px",
                      borderBottom:
                        index < items.length - 1
                          ? "1px solid #f0f0f0"
                          : undefined,
                    }}
                  >
                    <Link href={`/locations/${loc.id}`}>
                      <Text>{loc.name}</Text>
                      {loc.address && (
                        <Text
                          type="secondary"
                          style={{ marginLeft: 8, fontSize: 12 }}
                        >
                          {loc.address}
                        </Text>
                      )}
                    </Link>
                  </Flex>
                ))}
              </Flex>
            )}
          </Col>
        </Can>
      </Row>
    </DashboardPageShell>
  );
}
