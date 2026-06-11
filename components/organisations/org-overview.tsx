"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";
import Link from "@/components/link";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import { getOrganisation, updateOrganisation } from "@/lib/api/api";
import { useOrgContext } from "@/lib/context/org-context";
import { orgPath } from "@/lib/routes";

export default function OrgOverview({ orgId }: { orgId: string }) {
  const { setOrgId } = useOrgContext();
  const { data, error, isLoading } = useSWR(["organisation", orgId], () =>
    getOrganisation(orgId)
  );
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setOrgId(orgId);
  }, [orgId, setOrgId]);

  useEffect(() => {
    if (data?.name) setName(data.name);
  }, [data?.name]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateOrganisation(orgId, { name });
      await mutate(["organisation", orgId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <PageHeader
        title={data?.name ?? "Organisation"}
        description="Manage organisation settings and navigate to key areas."
      />

      {saveError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      ) : null}

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !name.trim()}
            >
              Save changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick links
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              <Button component={Link} href={orgPath(orgId, "/locations")} variant="outlined">
                Locations
              </Button>
              <Button component={Link} href={orgPath(orgId, "/users")} variant="outlined">
                Users
              </Button>
              <Button component={Link} href={orgPath(orgId, "/roles")} variant="outlined">
                Roles
              </Button>
              <Button component={Link} href="/settings/categories" variant="outlined">
                Categories
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
