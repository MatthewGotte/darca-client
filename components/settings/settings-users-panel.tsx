"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import { useOrgContext } from "@/lib/context/org-context";
import { orgPath } from "@/lib/routes";

export default function SettingsUsersPanel() {
  const { orgId, isReady } = useOrgContext();

  if (!isReady) {
    return (
      <SettingsPanelFrame title="Users & access" showActions={false}>
        <Typography sx={{ color: DARCA_COLORS.settingsMuted }}>Loading…</Typography>
      </SettingsPanelFrame>
    );
  }

  if (!orgId) {
    return (
      <SettingsPanelFrame
        title="Users & access"
        description="Manage people in your organisation and assign roles."
        showActions={false}
      >
        <Alert severity="info" sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#dbeafe" }}>
          Select an organisation to manage users and access.
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
    <SettingsPanelFrame
      title="Users & access"
      description="Manage people in your organisation, assign roles, and control access."
      showActions={false}
    >
      <Typography variant="body2" sx={{ color: DARCA_COLORS.settingsMuted, mb: 2 }}>
        User management lives in the People area for your organisation.
      </Typography>
      <Button component={Link} href={orgPath(orgId, "/users")} variant="contained">
        Open people dashboard
      </Button>
    </SettingsPanelFrame>
  );
}
