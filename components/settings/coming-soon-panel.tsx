"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";

export default function ComingSoonPanel({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets?: string[];
}) {
  return (
    <SettingsPanelFrame title={title} description={description} showActions={false}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px dashed ${DARCA_COLORS.settingsPanelBorder}`,
          bgcolor: "rgba(15,23,42,0.35)",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
          Coming soon
        </Typography>
        <Typography variant="body2" sx={{ color: DARCA_COLORS.settingsMuted, mb: bullets ? 2 : 0 }}>
          This section will be available once authentication and account security APIs are
          implemented.
        </Typography>
        {bullets ? (
          <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.5, color: DARCA_COLORS.settingsMuted }}>
            {bullets.map((item) => (
              <Typography key={item} component="li" variant="body2">
                {item}
              </Typography>
            ))}
          </Stack>
        ) : null}
      </Box>
    </SettingsPanelFrame>
  );
}
