"use client";

import { Alert, Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import Can from "@/components/can";
import {
  useCategories,
  useCustomFields,
  useTypes,
} from "@/hooks/data";
import type {
  CategoryResponse,
  CustomFieldResponse,
  TypeResponse,
} from "@/lib/api/types";
import { PERMISSIONS } from "@/lib/auth/permissions";

const { Title, Text } = Typography;

const categoryColumns: ColumnsType<CategoryResponse> = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Description", dataIndex: "description", key: "description" },
];

const typeColumns: ColumnsType<TypeResponse> = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Description", dataIndex: "description", key: "description" },
];

const customFieldColumns: ColumnsType<CustomFieldResponse> = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Data type", dataIndex: "dataType", key: "dataType" },
  { title: "Description", dataIndex: "description", key: "description" },
];

export default function ReferenceDataPage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: types, isLoading: typesLoading } = useTypes();
  const { data: customFields, isLoading: customFieldsLoading } =
    useCustomFields();

  return (
    <div>
      <Title level={2}>Reference data catalog</Title>
      <Text type="secondary">
        Shared system catalog used by all organisations when classifying assets.
      </Text>

      <Alert
        type="info"
        showIcon
        style={{ marginTop: 16 }}
        message="System-wide reference data"
        description="Categories, types, and custom fields are global — not scoped to your organisation. Changes affect how assets are classified across the platform."
      />

      <Can permission={PERMISSIONS.CATEGORY_READ}>
        <Card title="Categories" style={{ marginTop: 24 }}>
          <Table
            rowKey="id"
            loading={categoriesLoading}
            columns={categoryColumns}
            dataSource={categories ?? []}
            pagination={false}
          />
        </Card>
      </Can>

      <Can permission={PERMISSIONS.TYPE_READ}>
        <Card title="Types" style={{ marginTop: 24 }}>
          <Table
            rowKey="id"
            loading={typesLoading}
            columns={typeColumns}
            dataSource={types ?? []}
            pagination={false}
          />
        </Card>
      </Can>

      <Can permission={PERMISSIONS.CUSTOM_FIELD_READ}>
        <Card title="Custom fields" style={{ marginTop: 24 }}>
          <Table
            rowKey="id"
            loading={customFieldsLoading}
            columns={customFieldColumns}
            dataSource={customFields ?? []}
            pagination={false}
          />
        </Card>
      </Can>
    </div>
  );
}
