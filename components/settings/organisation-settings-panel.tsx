"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";
import Link from "@/components/link";
import SettingsPanelFrame from "@/components/settings/settings-panel-frame";
import { getOrganisation, updateOrganisation } from "@/lib/api/api";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import { useOrgContext } from "@/lib/context/org-context";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(15,23,42,0.55)",
    color: "#fff",
    "& fieldset": { borderColor: DARCA_COLORS.settingsPanelBorder },
    "&:hover fieldset": { borderColor: "rgba(148,163,184,0.6)" },
    "&.Mui-focused fieldset": { borderColor: DARCA_COLORS.settingsAccent },
  },
  "& .MuiInputLabel-root": { color: DARCA_COLORS.settingsMuted },
};

export default function OrganisationSettingsPanel() {
  const { orgId, isReady } = useOrgContext();
  const { data, error, isLoading } = useSWR(
    orgId ? ["organisation", orgId] : null,
    () => getOrganisation(orgId!)
  );
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.name) {
      setName(data.name);
      setSavedName(data.name);
    }
  }, [data?.name]);

  async function handleSave() {
    if (!orgId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateOrganisation(orgId, { name });
      setSavedName(name);
      await mutate(["organisation", orgId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save organisation");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setName(savedName);
    setSaveError(null);
  }

  if (!isReady) {
    return (
      <SettingsPanelFrame title="Organisation" showActions={false}>
        <Typography sx={{ color: DARCA_COLORS.settingsMuted }}>Loading…</Typography>
      </SettingsPanelFrame>
    );
  }

  if (!orgId) {
    return (
      <SettingsPanelFrame
        title="Organisation"
        description="Select an organisation to manage its profile and settings."
        showActions={false}
      >
        <Alert severity="info" sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#dbeafe" }}>
          No organisation selected. Go to the home page to choose or create an organisation.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={Link} href="/" variant="contained">
            Go to home
          </Button>
        </Box>
      </SettingsPanelFrame>
    );
  }

  if (isLoading) {
    return (
      <SettingsPanelFrame title="Organisation" showActions={false}>
        <Typography sx={{ color: DARCA_COLORS.settingsMuted }}>Loading organisation…</Typography>
      </SettingsPanelFrame>
    );
  }

  if (error) {
    return (
      <SettingsPanelFrame title="Organisation" showActions={false}>
        <Alert severity="error">{error instanceof Error ? error.message : "Failed to load organisation"}</Alert>
      </SettingsPanelFrame>
    );
  }

  return (
    <SettingsPanelFrame
      title="Organisation"
      description="Update your organisation profile. Additional organisation settings will be added here."
      onSave={handleSave}
      onDiscard={handleDiscard}
      saving={saving}
      saveDisabled={!name.trim() || name === savedName}
    >
      <Stack spacing={2}>
        {saveError ? <Alert severity="error">{saveError}</Alert> : null}
        <TextField
          fullWidth
          label="Organisation name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={fieldSx}
        />
      </Stack>
    </SettingsPanelFrame>
  );
}
