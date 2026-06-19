"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";

const INITIAL = {
  firstName: "Samantha",
  lastName: "William",
  email: "sam@email.com",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(15,23,42,0.55)",
    color: "#fff",
    "& input": { color: "#fff" },
    "& fieldset": { borderColor: DARCA_COLORS.settingsPanelBorder },
    "&:hover fieldset": { borderColor: "rgba(148,163,184,0.6)" },
    "&.Mui-focused fieldset": { borderColor: DARCA_COLORS.settingsAccent },
    "&.Mui-disabled": {
      color: "rgba(255,255,255,0.7)",
      "& input": { color: "rgba(255,255,255,0.7)", WebkitTextFillColor: "rgba(255,255,255,0.7)" },
    },
  },
  "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.75)" },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="label"
      variant="body2"
      sx={{ display: "block", color: "#fff", fontWeight: 600, mb: 0.75 }}
    >
      {children}
    </Typography>
  );
}

export default function AccountSettingsPanel() {
  const [form, setForm] = useState(INITIAL);
  const [savedSnapshot, setSavedSnapshot] = useState(INITIAL);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  function handleDiscard() {
    setForm(savedSnapshot);
    setInfoMessage(null);
  }

  function handleSave() {
    setSavedSnapshot(form);
    setInfoMessage("Changes are not persisted until sign-in is implemented.");
  }

  return (
    <SettingsPanelFrame
      title="Account Settings"
      description="Manage your personal information. Email changes require an administrator."
      onSave={handleSave}
      onDiscard={handleDiscard}
    >
      <Stack spacing={4}>
        {infoMessage ? (
          <Alert severity="info" sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#dbeafe" }}>
            {infoMessage}
          </Alert>
        ) : null}

        <Box>
          <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
            Personal information
          </Typography>
          <Typography variant="body2" sx={{ color: DARCA_COLORS.settingsMuted, mb: 2 }}>
            Update your display name used across DARCA.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel>First name</FieldLabel>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel>Last name</FieldLabel>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldLabel>Email address</FieldLabel>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Email address"
                value={form.email}
                disabled
                helperText="Contact an administrator to change email."
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip
                          size="small"
                          icon={<CheckCircleOutlinedIcon />}
                          label="Email verified"
                          sx={{
                            bgcolor: "rgba(22,163,74,0.15)",
                            color: "#86efac",
                            "& .MuiChip-icon": { color: "#86efac" },
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
            Notifications preview
          </Typography>
          <Typography variant="body2" sx={{ color: DARCA_COLORS.settingsMuted, mb: 2 }}>
            Notification preferences will be configurable here once alerts are available.
          </Typography>
          <Grid container spacing={1}>
            {[
              "Job assignments",
              "Compliance due dates",
              "Maintenance alerts",
            ].map((label) => (
              <Grid key={label} size={{ xs: 12, md: 6 }}>
                <FormControlLabel
                  disabled
                  control={
                    <Checkbox
                      checked
                      sx={{
                        color: DARCA_COLORS.settingsMuted,
                        "&.Mui-checked": { color: DARCA_COLORS.settingsAccent },
                      }}
                    />
                  }
                  label={label}
                  sx={{
                    color: "#fff",
                    "& .MuiFormControlLabel-label.Mui-disabled": { color: "rgba(255,255,255,0.7)" },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </SettingsPanelFrame>
  );
}
