"use client";

import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { usePermission } from "@/hooks/use-permission";
import {
  filterTabsByPermission,
  type PermissionTabDef,
} from "@/lib/permission-tabs";

type PermissionAwareTabsProps = Omit<TabsProps, "items"> & {
  tabs: PermissionTabDef[];
};

export default function PermissionAwareTabs({
  tabs,
  defaultActiveKey,
  ...rest
}: PermissionAwareTabsProps) {
  const { has, hasAny } = usePermission();
  const items = filterTabsByPermission(tabs, has, hasAny);

  return (
    <Tabs
      items={items}
      defaultActiveKey={defaultActiveKey ?? items[0]?.key}
      {...rest}
    />
  );
}
