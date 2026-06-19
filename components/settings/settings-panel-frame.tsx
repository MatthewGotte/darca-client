"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";

export default function SettingsPanelFrame({
  title,
  description,
  children,
  onSave,
  onDiscard,
  saveLabel = "Save changes",
  discardLabel = "Discard changes",
  saving = false,
  saveDisabled = false,
  showActions = true,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  onDiscard?: () => void;
  saveLabel?: string;
  discardLabel?: string;
  saving?: boolean;
  saveDisabled?: boolean;
  showActions?: boolean;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: description ? 1 : 0 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" sx={{ color: DARCA_COLORS.settingsMuted, maxWidth: 720 }}>
            {description}
          </Typography>
        ) : null}
      </Box>

      <Box>{children}</Box>

      {showActions && onSave && onDiscard ? (
        <>
          <Divider sx={{ my: 3, borderColor: DARCA_COLORS.settingsPanelBorder }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={onDiscard}
              disabled={saving}
              sx={{ color: DARCA_COLORS.settingsMuted, textTransform: "none" }}
            >
              {discardLabel}
            </Button>
            <Button
              variant="contained"
              onClick={onSave}
              disabled={saving || saveDisabled}
              sx={{
                px: 3,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: DARCA_COLORS.settingsAccent,
                "&:hover": { bgcolor: DARCA_COLORS.settingsAccentDark },
              }}
            >
              {saving ? "Saving…" : saveLabel}
            </Button>
          </Box>
        </>
      ) : null}
    </Box>
  );
}
