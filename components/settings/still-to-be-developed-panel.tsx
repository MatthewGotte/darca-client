"use client";

import Typography from "@mui/material/Typography";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";

export default function StillToBeDevelopedPanel({ title }: { title: string }) {
  return (
    <SettingsPanelFrame title={title} showActions={false}>
      <Typography variant="body1" sx={{ color: "#fff" }}>
        Still to be developed
      </Typography>
      <Typography variant="body2" sx={{ color: DARCA_COLORS.settingsMuted, mt: 1 }}>
        This section is not available yet.
      </Typography>
    </SettingsPanelFrame>
  );
}
