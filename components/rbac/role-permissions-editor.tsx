"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import {
  getOrganisationRole,
  listPermissions,
  updateOrganisationRolePermissions,
} from "@/lib/api/api";

export default function RolePermissionsEditor({
  orgId,
  roleId,
}: {
  orgId: string;
  roleId: string;
}) {
  const { data: role, error, isLoading } = useSWR(
    ["organisation-role", orgId, roleId],
    () => getOrganisationRole(orgId, roleId)
  );
  const { data: permissionGroups } = useSWR("permissions", listPermissions);
  const [selected, setSelected] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role?.permissions) {
      setSelected(role.permissions.map((p) => p.id!).filter(Boolean));
    }
  }, [role]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateOrganisationRolePermissions(orgId, roleId, {
        permissionIds: selected,
      });
      await mutate(["organisation-role", orgId, roleId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <PageHeader title={`Permissions for ${role?.name ?? "role"}`} />
      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}

      {permissionGroups?.map((group) => (
        <Box key={group.group} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {group.group}
          </Typography>
          <FormGroup>
            {group.permissions?.map((perm) => (
              <FormControlLabel
                key={perm.id}
                control={
                  <Checkbox
                    checked={selected.includes(perm.id!)}
                    onChange={() => toggle(perm.id!)}
                  />
                }
                label={`${perm.name}${perm.description ? ` — ${perm.description}` : ""}`}
              />
            ))}
          </FormGroup>
        </Box>
      ))}

      <Button variant="contained" onClick={handleSave} disabled={saving}>
        Save permissions
      </Button>
    </Box>
  );
}
