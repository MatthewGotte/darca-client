"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import { useColorSchemePreference } from "@/lib/context/color-scheme-context";

export default function AppearanceSettingsPanel() {
  const { mode, setMode } = useColorSchemePreference();
  const isDark = mode === "dark";

  return (
    <SettingsPanelFrame
      title="Appearance"
      description="Choose how DARCA looks on this device. Your preference is saved locally."
      showActions={false}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: `1px solid ${DARCA_COLORS.settingsPanelBorder}`,
          bgcolor: "rgba(15,23,42,0.45)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700 }}>
              Dark mode
            </Typography>
            <Typography variant="body2" sx={{ color: DARCA_COLORS.settingsMuted }}>
              Reduce glare with a darker interface.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={(_, checked) => setMode(checked ? "dark" : "light")}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {isDark ? (
                  <>
                    <DarkModeOutlinedIcon fontSize="small" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <LightModeOutlinedIcon fontSize="small" />
                    <span>Light</span>
                  </>
                )}
              </Box>
            }
            sx={{ color: "#fff", m: 0 }}
          />
        </Box>
      </Box>
    </SettingsPanelFrame>
  );
}
