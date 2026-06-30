import {
  ApartmentOutlined,
  DatabaseOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import type { PermissionCode } from "@/lib/auth/permissions";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType;
  permission?: PermissionCode;
  any?: PermissionCode[];
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: HomeOutlined },
  { label: "Settings", href: "/settings", icon: SettingOutlined },
  {
    label: "Admin",
    href: "/admin/users",
    icon: TeamOutlined,
    any: ["user:read", "role:read", "permission:read"],
  },
  {
    label: "Reference",
    href: "/reference/categories",
    icon: DatabaseOutlined,
    any: ["category:read", "type:read", "custom_field:read"],
  },
  {
    label: "Locations",
    href: "/locations",
    icon: ApartmentOutlined,
    permission: "location:read",
  },
];
