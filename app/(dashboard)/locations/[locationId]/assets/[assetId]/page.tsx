"use client";

import { useParams } from "next/navigation";
import { Space } from "antd";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import PermissionAwareTabs from "@/components/permission-aware-tabs";
import PageLoadingSkeleton from "@/components/page-loading-skeleton";
import RequirePermission from "@/components/require-permission";
import { AssetStatusTag, CriticalityTag } from "@/components/status-tag";
import { useAsset } from "@/hooks/data/use-assets";
import { useOrganisationLocation } from "@/hooks/data/use-locations";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import {
  OverviewTab,
  IdentifiersTab,
  CustomFieldsTab,
  AttachmentsTab,
  AssignmentsTab,
  StatusHistoryTab,
  ComplianceTab,
  JobsTab,
} from "@/components/locations/asset/asset-detail-tabs";

export default function AssetDetailPage() {
  const { locationId, assetId } = useParams<{ locationId: string; assetId: string }>();
  const orgId = useOrgId();
  const { data: location } = useOrganisationLocation(orgId, locationId);
  const { data: asset, isLoading } = useAsset(locationId, assetId);

  if (isLoading || !asset) {
    return <PageLoadingSkeleton />;
  }

  const breadcrumbs = [
    { label: "Locations", href: "/locations" },
    { label: location?.name ?? locationId, href: `/locations/${locationId}` },
    { label: asset.name ?? assetId },
  ];

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      permission: PERMISSIONS.ASSET_READ,
      children: (
        <OverviewTab asset={asset} locationId={locationId} assetId={assetId} />
      ),
    },
    {
      key: "identifiers",
      label: "Identifiers",
      permission: PERMISSIONS.ASSET_READ,
      children: (
        <IdentifiersTab asset={asset} assetId={assetId} locationId={locationId} />
      ),
    },
    {
      key: "custom-fields",
      label: "Custom Fields",
      permission: PERMISSIONS.ASSET_READ,
      children: (
        <CustomFieldsTab asset={asset} assetId={assetId} locationId={locationId} />
      ),
    },
    {
      key: "attachments",
      label: "Attachments",
      permission: PERMISSIONS.ASSET_ATTACHMENT_READ,
      children: <AttachmentsTab assetId={assetId} />,
    },
    {
      key: "assignments",
      label: "Assignments",
      permission: PERMISSIONS.ASSET_READ,
      children: (
        <AssignmentsTab asset={asset} assetId={assetId} locationId={locationId} />
      ),
    },
    {
      key: "status-history",
      label: "Status History",
      permission: PERMISSIONS.ASSET_READ,
      children: <StatusHistoryTab assetId={assetId} />,
    },
    {
      key: "compliance",
      label: "Compliance",
      permission: PERMISSIONS.COMPLIANCE_SCHEDULE_READ,
      children: <ComplianceTab assetId={assetId} locationId={locationId} />,
    },
    {
      key: "jobs",
      label: "Jobs",
      permission: PERMISSIONS.JOB_READ,
      children: <JobsTab assetId={assetId} locationId={locationId} />,
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.ASSET_READ}>
      <DashboardPageShell
        title={
          <Space>
            {asset.name}
            <AssetStatusTag statusLabel={asset.statusLabel} />
            <CriticalityTag criticality={asset.criticality} />
          </Space>
        }
        breadcrumbs={breadcrumbs}
      >
        <PermissionAwareTabs
          tabs={tabItems}
          rootClassName="tabs-nav-flush"
        />
      </DashboardPageShell>
    </RequirePermission>
  );
}
