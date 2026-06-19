"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useSWR, { mutate } from "swr";
import Link from "@/components/link";
import ConfirmDialog from "@/components/common/confirm-dialog";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import {
  deleteOrganisationRole,
  getOrganisationRole,
  updateOrganisationRole,
} from "@/lib/api/api";
import { orgPath } from "@/lib/routes";

export default function RoleDetail({
  orgId,
  roleId,
}: {
  orgId: string;
  roleId: string;
}) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    ["organisation-role", orgId, roleId],
    () => getOrganisationRole(orgId, roleId)
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setDescription(data.description ?? "");
    }
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateOrganisationRole(orgId, roleId, {
        name,
        description: description || undefined,
      });
      await mutate(["organisation-role", orgId, roleId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await deleteOrganisationRole(orgId, roleId);
    router.push(orgPath(orgId, "/roles"));
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <PageHeader
        title={data?.name ?? "Role"}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              href={orgPath(orgId, `/roles/${roleId}/permissions`)}
              variant="outlined"
            >
              Manage permissions
            </Button>
            {!data?.system ? (
              <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
                Delete
              </Button>
            ) : null}
          </Stack>
        }
      />
      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}
      <Stack spacing={2}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={data?.system} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button variant="contained" onClick={handleSave} disabled={saving || !name.trim() || data?.system}>
          Save changes
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete role"
        message="This will permanently delete the role."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
