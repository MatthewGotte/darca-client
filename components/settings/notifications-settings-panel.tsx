"use client";

import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";

const NOTIFICATION_OPTIONS = [
  { label: "Job assignments", defaultChecked: true },
  { label: "Compliance due dates", defaultChecked: true },
  { label: "Maintenance alerts", defaultChecked: false },
  { label: "Asset status changes", defaultChecked: false },
  { label: "Weekly activity digest", defaultChecked: true },
  { label: "Role assignment updates", defaultChecked: false },
];

export default function NotificationsSettingsPanel() {
  return (
    <SettingsPanelFrame title="Notifications" showActions={false}>
      <Stack spacing={2}>
        <Typography variant="body2" sx={{ color: "#fff", maxWidth: 720 }}>
          Choose the types of alerts you want to receive. Preferences will be saved once
          notification delivery is available.
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
          These options are preview-only for now.
        </Typography>
        <Grid container spacing={1}>
          {NOTIFICATION_OPTIONS.map((option) => (
            <Grid key={option.label} size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                disabled
                control={
                  <Checkbox
                    defaultChecked={option.defaultChecked}
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      "&.Mui-checked": { color: DARCA_COLORS.settingsAccent },
                    }}
                  />
                }
                label={option.label}
                sx={{
                  color: "#fff",
                  "& .MuiFormControlLabel-label.Mui-disabled": {
                    color: "rgba(255,255,255,0.85)",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </SettingsPanelFrame>
  );
}
