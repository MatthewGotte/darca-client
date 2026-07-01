import {
  ApartmentOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  HomeOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import type { PermissionCode } from "@/lib/auth/permissions";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ComponentType;
  permission?: PermissionCode;
  any?: PermissionCode[];
};

export type NavGroup = {
  key: string;
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    key: "general",
    label: "General",
    items: [
      { key: "home", label: "Home", href: "/", icon: HomeOutlined },
      {
        key: "settings",
        label: "Settings",
        href: "/settings",
        icon: SettingOutlined,
      },
    ],
  },
  {
    key: "admin",
    label: "Admin",
    items: [
      {
        key: "admin-users",
        label: "Users",
        href: "/admin/users",
        icon: TeamOutlined,
        permission: "user:read",
      },
      {
        key: "admin-roles",
        label: "Roles",
        href: "/admin/roles",
        icon: KeyOutlined,
        permission: "role:read",
      },
      {
        key: "admin-permissions",
        label: "Permissions",
        href: "/admin/permissions",
        icon: UnorderedListOutlined,
        permission: "permission:read",
      },
    ],
  },
  {
    key: "reference",
    label: "Reference",
    items: [
      {
        key: "reference-categories",
        label: "Categories",
        href: "/reference/categories",
        icon: DatabaseOutlined,
        permission: "category:read",
      },
      {
        key: "reference-types",
        label: "Types",
        href: "/reference/types",
        icon: TagsOutlined,
        permission: "type:read",
      },
      {
        key: "reference-custom-fields",
        label: "Custom Fields",
        href: "/reference/custom-fields",
        icon: DatabaseOutlined,
        permission: "custom_field:read",
      },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    items: [
      {
        key: "locations",
        label: "Locations",
        href: "/locations",
        icon: ApartmentOutlined,
        permission: "location:read",
      },
      {
        key: "operations-assets",
        label: "Assets",
        href: "/operations/assets",
        icon: AppstoreOutlined,
        permission: "asset:read",
      },
      {
        key: "operations-jobs",
        label: "Jobs",
        href: "/operations/jobs",
        icon: ToolOutlined,
        permission: "job:read",
      },
      {
        key: "operations-compliance",
        label: "Compliance",
        href: "/operations/compliance",
        icon: SafetyCertificateOutlined,
        permission: "compliance_schedule:read",
      },
    ],
  },
];

export function getSelectedNavKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/admin/users")) return "admin-users";
  if (pathname.startsWith("/admin/roles")) return "admin-roles";
  if (pathname.startsWith("/admin/permissions")) return "admin-permissions";
  if (pathname.startsWith("/reference/categories")) return "reference-categories";
  if (pathname.startsWith("/reference/types")) return "reference-types";
  if (pathname.startsWith("/reference/custom-fields")) return "reference-custom-fields";
  if (pathname.startsWith("/locations")) return "locations";
  if (pathname.startsWith("/operations/assets")) return "operations-assets";
  if (pathname.startsWith("/operations/jobs")) return "operations-jobs";
  if (pathname.startsWith("/operations/compliance")) return "operations-compliance";
  return "home";
}
