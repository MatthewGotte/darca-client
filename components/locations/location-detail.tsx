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
import Link from "@/components/link";
import {
  deleteOrganisationLocation,
  getOrganisationLocation,
  updateOrganisationLocation,
} from "@/lib/api/api";
import { locationPath, orgPath } from "@/lib/routes";

export default function LocationDetail({
  orgId,
  locationId,
}: {
  orgId: string;
  locationId: string;
}) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    ["organisation-location", orgId, locationId],
    () => getOrganisationLocation(orgId, locationId)
  );
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [timezone, setTimezone] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setAddress(data.address ?? "");
      setTimezone(data.timezone ?? "");
    }
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateOrganisationLocation(orgId, locationId, {
        name,
        address: address || undefined,
        timezone: timezone || undefined,
      });
      await mutate(["organisation-location", orgId, locationId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDecommission() {
    await deleteOrganisationLocation(orgId, locationId);
    router.push(orgPath(orgId, "/locations"));
  }

  return (
    <Box>
      <SyncLocationFromPath orgId={orgId} locationId={locationId} />
      <PageHeader
        title={data?.name ?? "Location"}
        actions={
          <Stack direction="row" spacing={1}>
            <Button component={Link} href={locationPath(orgId, locationId, "/lines")} variant="outlined">
              Lines
            </Button>
            <Button component={Link} href={locationPath(orgId, locationId, "/assets")} variant="outlined">
              Assets
            </Button>
            <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
              Decommission
            </Button>
          </Stack>
        }
      />

      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}

      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <TextField label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        <Button variant="contained" onClick={handleSave} disabled={saving || !name.trim()}>
          Save changes
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Decommission location"
        message="This will decommission the location. Continue?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDecommission}
      />
    </Box>
  );
}
