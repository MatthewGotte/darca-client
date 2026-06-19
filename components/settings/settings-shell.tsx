"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import Link from "@/components/link";
import {
  isSettingsNavActive,
  SETTINGS_NAV_GROUPS,
} from "@/components/settings/settings-nav-config";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";

const SETTINGS_NAV_WIDTH = 300;

export default function SettingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        bgcolor: DARCA_COLORS.settingsBg,
        color: DARCA_COLORS.settingsText,
        overflowY: "auto",
      }}
    >
      <Box
        component="aside"
        sx={{
          width: SETTINGS_NAV_WIDTH,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          px: 2,
          py: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ px: 0.5, pb: 2, fontWeight: 700, color: "#fff" }}
        >
          Settings
        </Typography>

        <Box sx={{ flex: 1, pb: 2 }}>
          {SETTINGS_NAV_GROUPS.map((group) => (
            <Box key={group.label} sx={{ mb: 1.5 }}>
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  px: 0.5,
                  py: 1,
                  color: DARCA_COLORS.settingsMuted,
                  letterSpacing: "0.08em",
                }}
              >
                {group.label}
              </Typography>
              <List disablePadding>
                {group.items.map((item) => {
                  const selected = isSettingsNavActive(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListItemButton
                        selected={selected}
                        sx={{
                          mx: 0,
                          mb: 0.75,
                          px: 1.5,
                          borderRadius: 2.5,
                          py: 1.25,
                          color: "rgba(248,250,252,0.9)",
                          "&.Mui-selected": {
                            bgcolor: "rgba(59,130,246,0.22)",
                            color: "#fff",
                            "&:hover": {
                              bgcolor: "rgba(59,130,246,0.28)",
                            },
                          },
                          "&:hover": {
                            bgcolor: "rgba(148,163,184,0.1)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                          <Icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          secondary={item.subtitle}
                          slotProps={{
                            primary: {
                              sx: { fontSize: 14, fontWeight: selected ? 700 : 600 },
                            },
                            secondary: {
                              sx: {
                                fontSize: 12,
                                color: "rgba(148,163,184,0.95)",
                              },
                            },
                          }}
                        />
                      </ListItemButton>
                    </Link>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            bgcolor: DARCA_COLORS.settingsPanel,
            border: `1px solid ${DARCA_COLORS.settingsPanelBorder}`,
            borderRadius: 3,
            p: { xs: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
