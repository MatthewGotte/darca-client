"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Skeleton,
  Space,
  Tag,
  Tabs,
  message,
} from "antd";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import ConfirmDelete from "@/components/confirm-delete";
import Link from "@/components/link";
import { AssetStatusTag, CriticalityTag } from "@/components/status-tag";
import {
  useOrganisationLocation,
  useUpdateOrganisationLocation,
  useDeleteOrganisationLocation,
} from "@/hooks/data/use-locations";
import {
  useLocationLines,
  useCreateLocationLine,
} from "@/hooks/data/use-lines";
import {
  useLocationAssets,
  useAssetStatuses,
  useCreateAsset,
} from "@/hooks/data/use-assets";
import { useCategories } from "@/hooks/data/use-categories";
import { useTypes } from "@/hooks/data/use-types";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type {
  AssetSummaryResponse,
  CreateAssetRequest,
  CreateLineRequest,
  LineResponse,
  UpdateLocationRequest,
} from "@/lib/api/types";

export default function LocationDetailPage() {
  const { locationId } = useParams<{ locationId: string }>();
  const orgId = useOrgId();
  const router = useRouter();

  const { data: location, isLoading: locationLoading } = useOrganisationLocation(orgId, locationId);
  const { trigger: updateLocation, isMutating: updatingLocation } = useUpdateOrganisationLocation(orgId ?? "", locationId);
  const { trigger: deleteLocation, isMutating: deletingLocation } = useDeleteOrganisationLocation(orgId ?? "", locationId);

  // Lines
  const { data: lines, isLoading: linesLoading, error: linesError } = useLocationLines(locationId);
  const { trigger: createLine, isMutating: creatingLine } = useCreateLocationLine(locationId);

  // Assets
  const [assetStatusFilter, setAssetStatusFilter] = useState<string | undefined>();
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<string | undefined>();
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useLocationAssets(locationId, {
    status: assetStatusFilter,
    categoryId: assetCategoryFilter,
  });
  const { data: assetStatuses } = useAssetStatuses();
  const { data: categories } = useCategories();
  const { data: types } = useTypes();
  const { trigger: createAsset, isMutating: creatingAsset } = useCreateAsset(locationId);

  // Modal/Drawer state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [decommissionOpen, setDecommissionOpen] = useState(false);
  const [newLineModalOpen, setNewLineModalOpen] = useState(false);
  const [newAssetDrawerOpen, setNewAssetDrawerOpen] = useState(false);

  const [editForm] = Form.useForm<UpdateLocationRequest>();
  const [lineForm] = Form.useForm<CreateLineRequest>();
  const [assetForm] = Form.useForm<CreateAssetRequest>();

  const lineColumns: TableColumnsType<LineResponse> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
      render: (name: string, record) => (
        <Link href={`/locations/${locationId}/lines/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Status",
      dataIndex: "decommissionedAt",
      key: "status",
      render: (decommissionedAt?: string) =>
        decommissionedAt ? (
          <Tag color="red">Decommissioned</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
  ];

  const assetColumns: TableColumnsType<AssetSummaryResponse> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
      render: (name: string, record) => (
        <Link href={`/locations/${locationId}/assets/${record.id}`}>{name}</Link>
      ),
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
      render: (statusLabel?: string) => <AssetStatusTag statusLabel={statusLabel} />,
    },
    {
      title: "Criticality",
      dataIndex: "criticality",
      key: "criticality",
      render: (criticality?: string) => <CriticalityTag criticality={criticality} />,
    },
  ];

  const handleEditLocation = async () => {
    const values = await editForm.validateFields();
    try {
      await updateLocation(values);
      message.success("Location updated successfully");
      setEditModalOpen(false);
    } catch {
      message.error("Failed to update location");
    }
  };

  const handleDecommissionLocation = async () => {
    try {
      await deleteLocation();
      message.success("Location decommissioned");
      router.push("/locations");
    } catch {
      message.error("Failed to decommission location");
    }
  };

  const handleCreateLine = async () => {
    const values = await lineForm.validateFields();
    try {
      await createLine(values);
      message.success("Line created successfully");
      lineForm.resetFields();
      setNewLineModalOpen(false);
    } catch {
      message.error("Failed to create line");
    }
  };

  const handleCreateAsset = async () => {
    const values = await assetForm.validateFields();
    const payload: CreateAssetRequest = {
      ...values,
      purchaseDate: values.purchaseDate
        ? (values.purchaseDate as unknown as { format: (f: string) => string }).format("YYYY-MM-DD")
        : undefined,
      warrantyExpiry: values.warrantyExpiry
        ? (values.warrantyExpiry as unknown as { format: (f: string) => string }).format("YYYY-MM-DD")
        : undefined,
    };
    try {
      await createAsset(payload);
      message.success("Asset created successfully");
      assetForm.resetFields();
      setNewAssetDrawerOpen(false);
    } catch {
      message.error("Failed to create asset");
    }
  };

  if (locationLoading) {
    return <Skeleton active />;
  }

  return (
    <RequirePermission permission={PERMISSIONS.LOCATION_READ}>
      <div>
        <PageHeader
          title={location?.name ?? "Location"}
          subtitle={location?.address}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Locations", href: "/locations" },
            { label: location?.name ?? "Location" },
          ]}
          actions={
            <Space>
              <Can permission={PERMISSIONS.LOCATION_UPDATE}>
                <Button
                  onClick={() => {
                    editForm.setFieldsValue({
                      name: location?.name,
                      address: location?.address ?? undefined,
                      timezone: location?.timezone ?? undefined,
                    });
                    setEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
              </Can>
              {!location?.decommissionedAt && (
                <Can permission={PERMISSIONS.LOCATION_DECOMMISSION}>
                  <Button danger onClick={() => setDecommissionOpen(true)}>
                    Decommission
                  </Button>
                </Can>
              )}
            </Space>
          }
        />

        <Tabs
          defaultActiveKey="lines"
          items={[
            {
              key: "lines",
              label: "Lines",
              children: (
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                    <Can permission={PERMISSIONS.LINE_CREATE}>
                      <Button type="primary" onClick={() => setNewLineModalOpen(true)}>
                        New Line
                      </Button>
                    </Can>
                  </div>
                  <DataTable<LineResponse>
                    isLoading={linesLoading}
                    error={linesError}
                    dataSource={lines}
                    columns={lineColumns}
                  />
                </div>
              ),
            },
            {
              key: "assets",
              label: "Assets",
              children: (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <Space wrap>
                      <Select
                        allowClear
                        placeholder="Filter by status"
                        style={{ minWidth: 180 }}
                        value={assetStatusFilter}
                        onChange={(v) => setAssetStatusFilter(v)}
                        options={assetStatuses?.map((s) => ({
                          value: s.code,
                          label: s.label,
                        }))}
                      />
                      <Select
                        allowClear
                        placeholder="Filter by category"
                        style={{ minWidth: 180 }}
                        value={assetCategoryFilter}
                        onChange={(v) => setAssetCategoryFilter(v)}
                        options={categories?.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                      />
                    </Space>
                    <Can permission={PERMISSIONS.ASSET_CREATE}>
                      <Button type="primary" onClick={() => setNewAssetDrawerOpen(true)}>
                        New Asset
                      </Button>
                    </Can>
                  </div>
                  <DataTable<AssetSummaryResponse>
                    isLoading={assetsLoading}
                    error={assetsError}
                    dataSource={assets}
                    columns={assetColumns}
                  />
                </div>
              ),
            },
          ]}
        />

        {/* Edit Location Modal */}
        <Modal
          title="Edit Location"
          open={editModalOpen}
          onOk={handleEditLocation}
          onCancel={() => setEditModalOpen(false)}
          okText="Save"
          confirmLoading={updatingLocation}
          destroyOnHidden
        >
          <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
            <Form.Item name="timezone" label="Timezone">
              <Input placeholder="e.g. Africa/Johannesburg" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Decommission Confirm */}
        <ConfirmDelete
          open={decommissionOpen}
          onConfirm={handleDecommissionLocation}
          onCancel={() => setDecommissionOpen(false)}
          loading={deletingLocation}
          title="Decommission Location"
          description={`Are you sure you want to decommission "${location?.name}"? This action cannot be undone.`}
          confirmText="Decommission"
        />

        {/* New Line Modal */}
        <Modal
          title="New Line"
          open={newLineModalOpen}
          onOk={handleCreateLine}
          onCancel={() => {
            setNewLineModalOpen(false);
            lineForm.resetFields();
          }}
          okText="Create"
          confirmLoading={creatingLine}
          destroyOnHidden
        >
          <Form form={lineForm} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* New Asset Drawer */}
        <Drawer
          title="New Asset"
          open={newAssetDrawerOpen}
          onClose={() => {
            setNewAssetDrawerOpen(false);
            assetForm.resetFields();
          }}
          width={520}
          destroyOnHidden
          extra={
            <Space>
              <Button onClick={() => {
                setNewAssetDrawerOpen(false);
                assetForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" loading={creatingAsset} onClick={handleCreateAsset}>
                Create
              </Button>
            </Space>
          }
        >
          <Form form={assetForm} layout="vertical">
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                options={categories?.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Form.Item>
            <Form.Item
              name="typeId"
              label="Type"
              rules={[{ required: true, message: "Please select a type" }]}
            >
              <Select
                placeholder="Select type"
                options={types?.map((t) => ({ value: t.id, label: t.name }))}
              />
            </Form.Item>
            <Form.Item name="lineId" label="Line">
              <Select
                allowClear
                placeholder="Select line (optional)"
                options={lines?.map((l) => ({ value: l.id, label: l.name }))}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="modelNumber" label="Model Number">
              <Input />
            </Form.Item>
            <Form.Item name="manufacturer" label="Manufacturer">
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select
                allowClear
                placeholder="Select status"
                options={assetStatuses?.map((s) => ({ value: s.code, label: s.label }))}
              />
            </Form.Item>
            <Form.Item name="criticality" label="Criticality">
              <Select
                allowClear
                placeholder="Select criticality"
                options={[
                  { value: "LOW", label: "Low" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "HIGH", label: "High" },
                  { value: "CRITICAL", label: "Critical" },
                ]}
              />
            </Form.Item>
            <Form.Item name="purchaseDate" label="Purchase Date">
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="purchaseCost" label="Purchase Cost">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="warrantyExpiry" label="Warranty Expiry">
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="specificLocationDetails" label="Specific Location Details">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="geoLatitude" label="Latitude">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="geoLongitude" label="Longitude">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </RequirePermission>
  );
}
