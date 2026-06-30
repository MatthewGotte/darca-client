"use client";

import type { TableProps } from "antd";
import { Alert, Table } from "antd";

type DataTableProps<T> = TableProps<T> & {
  isLoading?: boolean;
  error?: Error | unknown;
};

export default function DataTable<T extends object>({
  isLoading,
  error,
  ...tableProps
}: DataTableProps<T>) {
  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load data"
        description={(error as Error)?.message ?? "An unexpected error occurred"}
        showIcon
      />
    );
  }

  return (
    <Table<T>
      loading={isLoading}
      rowKey="id"
      pagination={{ pageSize: 20, showSizeChanger: true }}
      scroll={{ x: "max-content" }}
      {...tableProps}
    />
  );
}
