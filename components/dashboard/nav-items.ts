import {
  DatabaseOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: HomeOutlined },
  {
    label: "Reference data",
    href: "/settings/reference-data",
    icon: DatabaseOutlined,
  },
];
