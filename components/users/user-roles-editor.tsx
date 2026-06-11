"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import {
  getOrganisationUser,
  listOrganisationLocations,
  listOrganisationRoles,
  updateUserLocationRoles,
  updateUserOrganisationRoles,
} from "@/lib/api/api";

export default function UserRolesEditor({
  orgId,
  userId,
}: {
  orgId: string;
  userId: string;
}) {
  const { data: user, error: userError, isLoading: userLoading } = useSWR(
    ["organisation-user", orgId, userId],
    () => getOrganisationUser(orgId, userId)
  );
  const { data: roles } = useSWR(["organisation-roles", orgId], () =>
    listOrganisationRoles(orgId)
  );
  const { data: locations } = useSWR(["organisation-locations", orgId], () =>
    listOrganisationLocations(orgId)
  );

  const [orgRoleIds, setOrgRoleIds] = useState<string[]>([]);
  const [locationId, setLocationId] = useState("");
  const [locationRoleIds, setLocationRoleIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (locations?.length && !locationId) {
      setLocationId(locations[0].id!);
    }
  }, [locations, locationId]);

  if (userLoading) return <LoadingState />;
  if (userError) return <ErrorState error={userError} />;

  function toggleRole(id: string, selected: string[], setter: (ids: string[]) => void) {
    if (selected.includes(id)) {
      setter(selected.filter((r) => r !== id));
    } else {
      setter([...selected, id]);
    }
  }

  async function saveOrgRoles() {
    setSaving(true);
    setError(null);
    try {
      await updateUserOrganisationRoles(userId, { roleIds: orgRoleIds });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save org roles");
    } finally {
      setSaving(false);
    }
  }

  async function saveLocationRoles() {
    if (!locationId) return;
    setSaving(true);
    setError(null);
    try {
      await updateUserLocationRoles(userId, locationId, { roleIds: locationRoleIds });
      await mutate(["organisation-user", orgId, userId]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save location roles");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <PageHeader title={`Roles for ${user?.name ?? "user"}`} />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Organisation roles
          </Typography>
          <FormGroup>
            {roles?.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={orgRoleIds.includes(role.id!)}
                    onChange={() => toggleRole(role.id!, orgRoleIds, setOrgRoleIds)}
                  />
                }
                label={role.name}
              />
            ))}
          </FormGroup>
          <Button sx={{ mt: 1 }} variant="contained" onClick={saveOrgRoles} disabled={saving}>
            Save organisation roles
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Location roles
          </Typography>
          <FormControl fullWidth sx={{ mb: 2, maxWidth: 320 }}>
            <InputLabel>Location</InputLabel>
            <Select
              label="Location"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            >
              {locations?.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormGroup>
            {roles?.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={locationRoleIds.includes(role.id!)}
                    onChange={() =>
                      toggleRole(role.id!, locationRoleIds, setLocationRoleIds)
                    }
                  />
                }
                label={role.name}
              />
            ))}
          </FormGroup>
          <Button sx={{ mt: 1 }} variant="contained" onClick={saveLocationRoles} disabled={saving}>
            Save location roles
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
