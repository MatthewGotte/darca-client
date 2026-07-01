"use client";

import { useState } from "react";
import { Button, Form, Input, Modal, Tag, message } from "antd";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/page-header";
import DataTable from "@/components/data-table";
import Can from "@/components/can";
import RequirePermission from "@/components/require-permission";
import Link from "@/components/link";
import {
  useOrganisationLocations,
  useCreateOrganisationLocation,
} from "@/hooks/data/use-locations";
import { useOrgId } from "@/hooks/use-org-id";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { CreateLocationRequest, LocationResponse } from "@/lib/api/types";

export default function LocationsPage() {
  const orgId = useOrgId();
  const { data, isLoading, error } = useOrganisationLocations(orgId);
  const { trigger: createLocation, isMutating } = useCreateOrganisationLocation(orgId ?? "");

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<CreateLocationRequest>();

  const columns: TableColumnsType<LocationResponse> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
      render: (name: string, record) => (
        <Link href={`/locations/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "Timezone",
      dataIndex: "timezone",
      key: "timezone",
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

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createLocation(values);
      message.success("Location created successfully");
      form.resetFields();
      setModalOpen(false);
    } catch {
      message.error("Failed to create location");
    }
  };

  return (
    <RequirePermission permission={PERMISSIONS.LOCATION_READ}>
      <div>
        <PageHeader
          title="Locations"
          subtitle="Manage your organisation's locations"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Locations" },
          ]}
          actions={
            <Can permission={PERMISSIONS.LOCATION_CREATE}>
              <Button type="primary" onClick={() => setModalOpen(true)}>
                New Location
              </Button>
            </Can>
          }
        />

        <DataTable<LocationResponse>
          isLoading={isLoading}
          error={error}
          dataSource={data}
          columns={columns}
        />

        <Modal
          title="New Location"
          open={modalOpen}
          onOk={handleCreate}
          onCancel={() => {
            setModalOpen(false);
            form.resetFields();
          }}
          okText="Create"
          confirmLoading={isMutating}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
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
      </div>
    </RequirePermission>
  );
}
