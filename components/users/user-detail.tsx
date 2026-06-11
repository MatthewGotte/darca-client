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
  deleteOrganisationUser,
  getOrganisationUser,
  updateOrganisationUser,
} from "@/lib/api/api";
import { orgPath } from "@/lib/routes";

export default function UserDetail({
  orgId,
  userId,
}: {
  orgId: string;
  userId: string;
}) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    ["organisation-user", orgId, userId],
    () => getOrganisationUser(orgId, userId)
  );
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data?.name) setName(data.name);
  }, [data?.name]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateOrganisationUser(orgId, userId, { name });
      await mutate(["organisation-user", orgId, userId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDecommission() {
    await deleteOrganisationUser(orgId, userId);
    router.push(orgPath(orgId, "/users"));
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <PageHeader
        title={data?.name ?? "User"}
        description={data?.email}
        actions={
          <Stack direction="row" spacing={1}>
            <Button component={Link} href={orgPath(orgId, `/users/${userId}/roles`)} variant="outlined">
              Manage roles
            </Button>
            <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
              Decommission
            </Button>
          </Stack>
        }
      />
      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}
      <Stack spacing={2}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" value={data?.email ?? ""} disabled />
        <Button variant="contained" onClick={handleSave} disabled={saving || !name.trim()}>
          Save changes
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Decommission user"
        message="This will decommission the user."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDecommission}
      />
    </Box>
  );
}
