"use client";

import {
  ApartmentOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Card, Col, List, Row, Skeleton, Space, Tag, Typography } from "antd";
import Link from "@/components/link";
import Can from "@/components/can";
import { useAuth } from "@/hooks/use-auth";
import { useOrgId } from "@/hooks/use-org-id";
import { useOrganisationLocations } from "@/hooks/data/use-locations";
import { PERMISSIONS } from "@/lib/auth/permissions";

const { Title, Text } = Typography;

const SHORTCUT_TILES = [
  {
    label: "Admin",
    description: "Manage users, roles & permissions",
    href: "/admin/users",
    icon: <TeamOutlined style={{ fontSize: 28, color: "#1677ff" }} />,
    permission: PERMISSIONS.USER_READ,
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
    href: "/locations",
    icon: <AppstoreOutlined style={{ fontSize: 28, color: "#722ed1" }} />,
    permission: PERMISSIONS.ASSET_READ,
  },
  {
    label: "Jobs",
    description: "Work orders and compliance jobs",
    href: "/locations",
    icon: <ToolOutlined style={{ fontSize: 28, color: "#eb2f96" }} />,
    permission: PERMISSIONS.JOB_READ,
  },
];

export default function HomePage() {
  const { user, roles } = useAuth();
  const orgId = useOrgId();
  const { data: locations, isLoading: locationsLoading } =
    useOrganisationLocations(orgId);

  return (
    <div>
      <Title level={2} style={{ marginBottom: 4 }}>
        Welcome back{user?.name ? `, ${user.name}` : ""}
      </Title>
      <Space style={{ marginBottom: 24 }}>
        {roles.map((role) => (
          <Tag key={role} color="blue">
            {role}
          </Tag>
        ))}
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {SHORTCUT_TILES.map(({ label, description, href, icon, permission }) => (
          <Can key={label} permission={permission}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Link href={href}>
                <Card
                  hoverable
                  style={{ height: "100%" }}
                  styles={{ body: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 } }}
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

      <Can permission={PERMISSIONS.LOCATION_READ}>
        <Title level={4}>Quick Location Jump</Title>
        {locationsLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <List
            dataSource={locations ?? []}
            locale={{ emptyText: "No locations found" }}
            renderItem={(loc) => (
              <List.Item>
                <Link href={`/locations/${loc.id}`}>
                  <Text>{loc.name}</Text>
                  {loc.address && (
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                      {loc.address}
                    </Text>
                  )}
                </Link>
              </List.Item>
            )}
            style={{ maxWidth: 480 }}
          />
        )}
      </Can>
    </div>
  );
}
