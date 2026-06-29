import { HomeOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: HomeOutlined },
];
