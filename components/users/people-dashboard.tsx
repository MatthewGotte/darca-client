"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import useSWR from "swr";
import Link from "@/components/link";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import AddPersonWizard from "@/components/users/add-person-wizard";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import { listOrganisationUsers } from "@/lib/api/api";
import { orgPath } from "@/lib/routes";

export default function PeopleDashboard({ orgId }: { orgId: string }) {
  const [search, setSearch] = useState("");
  const [includeDecommissioned, setIncludeDecommissioned] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    ["organisation-users", orgId, includeDecommissioned],
    () => listOrganisationUsers(orgId, { includeDecommissioned })
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [data, search]);

  const active = filtered.filter((u) => u.active).length;

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => mutate()} />;

  return (
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fff",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search team members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, maxWidth: 400 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {active} active · {filtered.length} total
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setPersonOpen(true)}>
            Add Person
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h5" gutterBottom>
          People
        </Typography>

        <Grid container spacing={2}>
          {filtered.map((user) => (
            <Grid key={user.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ overflow: "hidden" }}>
                <Box
                  sx={{
                    bgcolor: DARCA_COLORS.cardHeader,
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <PeopleOutlinedIcon sx={{ color: "#fff" }} />
                  <Box>
                    <Typography
                      component={Link}
                      href={orgPath(orgId, `/users/${user.id}`)}
                      variant="subtitle2"
                      sx={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}
                    >
                      {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
                      Team member
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.active ? "Active" : "Inactive"}
                    size="small"
                    color={user.active ? "success" : "default"}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <AddPersonWizard open={personOpen} onClose={() => setPersonOpen(false)} orgId={orgId} />
    </Box>
  );
}
