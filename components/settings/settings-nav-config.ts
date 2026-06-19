import type { SvgIconComponent } from "@mui/icons-material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";

export type SettingsNavItem = {
  label: string;
  subtitle: string;
  href: string;
  icon: SvgIconComponent;
};

export type SettingsNavGroup = {
  label: string;
  items: SettingsNavItem[];
};

export const SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    label: "Personal",
    items: [
      {
        label: "Account Settings",
        subtitle: "Name, email, and profile",
        href: "/settings/account",
        icon: PersonOutlinedIcon,
      },
      {
        label: "Appearance",
        subtitle: "Dark and light mode",
        href: "/settings/appearance",
        icon: PaletteOutlinedIcon,
      },
      {
        label: "Security",
        subtitle: "Password and sign-in",
        href: "/settings/security",
        icon: LockOutlinedIcon,
      },
      {
        label: "Notifications",
        subtitle: "Job and compliance alerts",
        href: "/settings/notifications",
        icon: NotificationsOutlinedIcon,
      },
    ],
  },
  {
    label: "Organisation",
    items: [
      {
        label: "Organisation",
        subtitle: "Organisation name and profile",
        href: "/settings/organisation",
        icon: BusinessOutlinedIcon,
      },
      {
        label: "Categories",
        subtitle: "Asset category catalog",
        href: "/settings/categories",
        icon: CategoryOutlinedIcon,
      },
      {
        label: "Types",
        subtitle: "Asset type definitions",
        href: "/settings/types",
        icon: ViewModuleOutlinedIcon,
      },
      {
        label: "Custom fields",
        subtitle: "Extensible field definitions",
        href: "/settings/custom-fields",
        icon: TuneOutlinedIcon,
      },
      {
        label: "Roles",
        subtitle: "Access roles and permissions",
        href: "/settings/roles",
        icon: AccountTreeOutlinedIcon,
      },
      {
        label: "Permissions",
        subtitle: "System permission reference",
        href: "/settings/permissions",
        icon: SecurityOutlinedIcon,
      },
      {
        label: "Users & access",
        subtitle: "People and role assignment",
        href: "/settings/users",
        icon: PeopleOutlinedIcon,
      },
    ],
  },
];

export function isSettingsNavActive(pathname: string, href: string): boolean {
  if (href === "/settings/categories") {
    return pathname.startsWith("/settings/categories");
  }
  if (href === "/settings/types") {
    return pathname.startsWith("/settings/types");
  }
  if (href === "/settings/custom-fields") {
    return pathname.startsWith("/settings/custom-fields");
  }
  if (href === "/settings/roles") {
    return pathname.startsWith("/settings/roles");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
