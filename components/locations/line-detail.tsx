"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useSWR, { mutate } from "swr";
import ConfirmDialog from "@/components/common/confirm-dialog";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import SyncLocationFromPath from "@/components/layout/sync-location-from-path";
import {
  deleteLocationLine,
  getLocationLine,
  updateLocationLine,
} from "@/lib/api/api";
import { locationPath } from "@/lib/routes";

export default function LineDetail({
  orgId,
  locationId,
  lineId,
}: {
  orgId: string;
  locationId: string;
  lineId: string;
}) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    ["location-line", locationId, lineId],
    () => getLocationLine(locationId, lineId)
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
      await updateLocationLine(locationId, lineId, {
        name,
        description: description || undefined,
      });
      await mutate(["location-line", locationId, lineId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDecommission() {
    await deleteLocationLine(locationId, lineId);
    router.push(locationPath(orgId, locationId, "/lines"));
  }

  return (
    <Box>
      <SyncLocationFromPath orgId={orgId} locationId={locationId} />
      <PageHeader
        title={data?.name ?? "Line"}
        actions={
          <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
            Decommission
          </Button>
        }
      />

      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}

      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button variant="contained" onClick={handleSave} disabled={saving || !name.trim()}>
          Save changes
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Decommission line"
        message="This will decommission the line. Continue?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDecommission}
      />
    </Box>
  );
}
