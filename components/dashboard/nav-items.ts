import HomeIcon from "@mui/icons-material/Home";
import type { SvgIconComponent } from "@mui/icons-material";

export type NavItem = {
  label: string;
  href: string;
  icon: SvgIconComponent;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: HomeIcon },
];
