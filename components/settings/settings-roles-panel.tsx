"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import RolesList from "@/components/rbac/roles-list";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import { useOrgContext } from "@/lib/context/org-context";

export default function SettingsRolesPanel() {
  const { orgId, isReady } = useOrgContext();

  if (!isReady) {
    return (
      <SettingsPanelFrame title="Roles" showActions={false}>
        <Typography sx={{ color: DARCA_COLORS.settingsMuted }}>Loading…</Typography>
      </SettingsPanelFrame>
    );
  }

  if (!orgId) {
    return (
      <SettingsPanelFrame
        title="Roles"
        description="Manage organisation roles and their permissions."
        showActions={false}
      >
        <Alert severity="info" sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#dbeafe" }}>
          Select an organisation to manage roles.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={Link} href="/" variant="contained">
            Go to home
          </Button>
        </Box>
      </SettingsPanelFrame>
    );
  }

  return (
    <Box sx={{ "& .MuiTypography-h4": { color: "#fff" }, "& .MuiTypography-body1": { color: DARCA_COLORS.settingsMuted } }}>
      <RolesList orgId={orgId} />
    </Box>
  );
}
