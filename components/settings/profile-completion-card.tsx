"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import { useOrgContext } from "@/lib/context/org-context";

const MOCK_PROFILE = {
  firstName: "Samantha",
  lastName: "William",
  email: "sam@email.com",
};

function useProfileCompletionPercent(): number {
  const { orgId } = useOrgContext();

  let completed = 0;
  const total = 4;

  if (MOCK_PROFILE.firstName.trim()) completed += 1;
  if (MOCK_PROFILE.lastName.trim()) completed += 1;
  if (MOCK_PROFILE.email.trim()) completed += 1;
  if (orgId) completed += 1;

  return Math.round((completed / total) * 100);
}

export default function ProfileCompletionCard() {
  const percent = useProfileCompletionPercent();

  return (
    <Box
      sx={{
        mx: 2,
        mb: 2,
        p: 2,
        borderRadius: 2.5,
        bgcolor: DARCA_COLORS.settingsAccent,
        backgroundImage: `linear-gradient(135deg, ${DARCA_COLORS.settingsAccent}, ${DARCA_COLORS.settingsAccentDark})`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={percent}
            size={52}
            thickness={4}
            sx={{ color: "rgba(255,255,255,0.25)" }}
          />
          <CircularProgress
            variant="determinate"
            value={percent}
            size={52}
            thickness={4}
            sx={{
              color: "#fff",
              position: "absolute",
              left: 0,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700 }}>
              {percent}%
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>
            Profile information
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
            Complete your profile to unlock all features.
          </Typography>
        </Box>
      </Box>
      <Button
        component={Link}
        href="/settings/account"
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#fff",
          color: DARCA_COLORS.settingsAccentDark,
          fontWeight: 700,
          "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
        }}
      >
        Complete my profile
      </Button>
    </Box>
  );
}
