"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "@/components/link";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import { useOrgContext } from "@/lib/context/org-context";
import { orgPath } from "@/lib/routes";

const DRAWER_WIDTH = 248;

function useOrgIdFromPath(): string | null {
  const pathname = usePathname();
  const match = pathname.match(/^\/organisations\/([^/]+)/);
  return match?.[1] ?? null;
}

const navItemSx = (selected?: boolean, indent?: boolean) => ({
  pl: indent ? 4 : 2,
  py: 1,
  mx: 1,
  borderRadius: 1.5,
  color: "rgba(255,255,255,0.85)",
  "&.Mui-selected": {
    bgcolor: DARCA_COLORS.sidebarHover,
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    "&:hover": { bgcolor: DARCA_COLORS.sidebarHover },
  },
  "&:hover": { bgcolor: DARCA_COLORS.sidebarHover },
});

function NavItem({
  href,
  label,
  icon,
  selected,
  indent,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  indent?: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <ListItemButton selected={selected} sx={navItemSx(selected, indent)}>
        {icon ? (
          <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{icon}</ListItemIcon>
        ) : null}
        <ListItemText
          primary={label}
          slotProps={{
            primary: { sx: { fontSize: 14, fontWeight: selected ? 600 : 400 } },
          }}
        />
      </ListItemButton>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathOrgId = useOrgIdFromPath();
  const { orgId: contextOrgId } = useOrgContext();
  const orgId = pathOrgId ?? contextOrgId;

  const [assetsOpen, setAssetsOpen] = useState(true);

  const equipmentHref = orgId ? orgPath(orgId, "/equipment") : "/";

  const peopleHref = orgId ? orgPath(orgId, "/users") : "/";

  const isEquipment =
    pathname.includes("/equipment") ||
    (pathname.includes("/assets") && !pathname.includes("/assets/new"));
  const isPeople = pathname.includes("/users");

  const isSettings = pathname.startsWith("/settings");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: DARCA_COLORS.pageBg }}>
      <Box
        component="nav"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          bgcolor: DARCA_COLORS.sidebar,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${DARCA_COLORS.sidebarBorder}`,
        }}
      >
        <Box sx={{ px: 2, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              background: `linear-gradient(135deg, ${DARCA_COLORS.accent}, #f48c06)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            D
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#fff", lineHeight: 1.2 }}>
              DARCA
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
              Asset Management
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: DARCA_COLORS.sidebarBorder }} />

        <List sx={{ flex: 1, py: 1 }}>
          {orgId ? (
            <>
              <NavItem
                href={orgPath(orgId)}
                label="Dashboard"
                icon={<DashboardOutlinedIcon fontSize="small" />}
                selected={pathname === orgPath(orgId)}
              />

              <ListItemButton
                onClick={() => setAssetsOpen((o) => !o)}
                sx={{
                  py: 1,
                  mx: 1,
                  borderRadius: 1.5,
                  color: "rgba(255,255,255,0.85)",
                  "&:hover": { bgcolor: DARCA_COLORS.sidebarHover },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <Inventory2OutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Assets" slotProps={{ primary: { sx: { fontSize: 14 } } }} />
                {assetsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={assetsOpen}>
                <NavItem
                  href={peopleHref}
                  label="People"
                  icon={<PeopleOutlinedIcon fontSize="small" />}
                  selected={isPeople}
                  indent
                />
                <NavItem
                  href={equipmentHref}
                  label="Equipment"
                  icon={<PrecisionManufacturingOutlinedIcon fontSize="small" />}
                  selected={isEquipment}
                  indent
                />
              </Collapse>

              <NavItem
                href={orgPath(orgId, "/locations")}
                label="Asset Structure"
                icon={<AccountTreeOutlinedIcon fontSize="small" />}
                selected={pathname.includes("/locations") && !isEquipment}
              />

              <ListItemButton
                disabled
                sx={{
                  py: 1,
                  mx: 1,
                  borderRadius: 1.5,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <QrCodeScannerOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="QR Scans" slotProps={{ primary: { sx: { fontSize: 14 } } }} />
              </ListItemButton>

              <ListItemButton
                disabled
                sx={{
                  py: 1,
                  mx: 1,
                  borderRadius: 1.5,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <BuildOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Maintenance" slotProps={{ primary: { sx: { fontSize: 14 } } }} />
              </ListItemButton>

              <ListItemButton
                disabled
                sx={{
                  py: 1,
                  mx: 1,
                  borderRadius: 1.5,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <VerifiedUserOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Compliance" slotProps={{ primary: { sx: { fontSize: 14 } } }} />
              </ListItemButton>

              <ListItemButton
                disabled
                sx={{
                  py: 1,
                  mx: 1,
                  borderRadius: 1.5,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <FolderOpenOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Digital Records" slotProps={{ primary: { sx: { fontSize: 14 } } }} />
              </ListItemButton>
            </>
          ) : null}

          <Divider sx={{ my: 1, borderColor: DARCA_COLORS.sidebarBorder }} />

          <NavItem
            href="/settings/account"
            label="Settings"
            icon={<SettingsOutlinedIcon fontSize="small" />}
            selected={isSettings}
          />
        </List>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
