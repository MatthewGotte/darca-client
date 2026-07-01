"use client";

import { Suspense, useMemo } from "react";
import { Select, Tag } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import DashboardPageShell from "@/components/dashboard/dashboard-page-shell";
import DataTable from "@/components/data-table";
import FilterBar from "@/components/filter-bar";
import Link from "@/components/link";
import RequirePermission from "@/components/require-permission";
import { AssetStatusTag, CriticalityTag } from "@/components/status-tag";
import { useAssetStatuses } from "@/hooks/data/use-assets";
import { useCategories } from "@/hooks/data/use-categories";
import { useOrganisationLocations } from "@/hooks/data/use-locations";
import { useOrganisationAssets } from "@/hooks/data/use-organisation-assets";
import { useOrgId } from "@/hooks/use-org-id";
import { useUrlFilter } from "@/hooks/use-url-filters";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { AssetStatus, AssetSummaryResponse } from "@/lib/api/types";

function OperationsAssetsContent() {
  const orgId = useOrgId();
  const [locationFilter, setLocationFilter] = useUrlFilter("locationId");
  const [statusFilter, setStatusFilter] = useUrlFilter("status");
  const [categoryFilter, setCategoryFilter] = useUrlFilter("categoryId");

  const { data: locations } = useOrganisationLocations(orgId);
  const { data: categories } = useCategories();
  const { data: assetStatuses } = useAssetStatuses();
  const { data, isLoading, error } = useOrganisationAssets(orgId, {
    locationId: locationFilter,
    status: statusFilter as AssetStatus | undefined,
    categoryId: categoryFilter,
  });

  const locationNameById = useMemo(() => {
    const map = new Map<string, string>();
    locations?.forEach((loc) => {
      if (loc.id) map.set(loc.id, loc.name ?? loc.id);
    });
    return map;
  }, [locations]);

  const columns: TableColumnsType<AssetSummaryResponse> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
      render: (name: string, record) => (
        <Link href={`/locations/${record.locationId}/assets/${record.id}`}>
          {name}
        </Link>
      ),
    },
    {
      title: "Location",
      dataIndex: "locationId",
      key: "locationId",
      render: (locationId?: string) => {
        if (!locationId) return "—";
        const name = locationNameById.get(locationId) ?? locationId;
        return (
          <Link href={`/locations/${locationId}`}>{name}</Link>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Type",
      dataIndex: "typeName",
      key: "typeName",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Line",
      dataIndex: "lineName",
      key: "lineName",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Status",
      dataIndex: "statusLabel",
      key: "statusLabel",
      render: (statusLabel?: string) => (
        <AssetStatusTag statusLabel={statusLabel} />
      ),
    },
    {
      title: "Criticality",
      dataIndex: "criticality",
      key: "criticality",
      render: (criticality?: string) => (
        <CriticalityTag criticality={criticality} />
      ),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) =>
        dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
      defaultSortOrder: "descend",
      render: (v?: string) => (v ? dayjs(v).format("YYYY-MM-DD") : "—"),
    },
    {
      title: "State",
      dataIndex: "decommissionedAt",
      key: "decommissionedAt",
      render: (decommissionedAt?: string) =>
        decommissionedAt ? (
          <Tag color="red">Decommissioned</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
  ];

  return (
    <RequirePermission permission={PERMISSIONS.ASSET_READ}>
      <DashboardPageShell
        title="Assets"
        subtitle="Search and triage assets across all locations"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Assets" },
        ]}
        filters={
          <FilterBar>
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
              options={assetStatuses?.map((s) => ({
                label: s.label,
                value: s.code,
              }))}
            />
            <Select
              allowClear
              placeholder="All categories"
              style={{ minWidth: 180 }}
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories?.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </FilterBar>
        }
      >
        <DataTable<AssetSummaryResponse>
          isLoading={isLoading}
          error={error}
          dataSource={data}
          columns={columns}
        />
      </DashboardPageShell>
    </RequirePermission>
  );
}

export default function OperationsAssetsPage() {
  return (
    <Suspense fallback={null}>
      <OperationsAssetsContent />
    </Suspense>
  );
}
