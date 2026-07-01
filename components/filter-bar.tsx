"use client";

import type { ReactNode } from "react";
import { Space } from "antd";

type FilterBarProps = {
  children: ReactNode;
};

export default function FilterBar({ children }: FilterBarProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Space wrap>{children}</Space>
    </div>
  );
}
