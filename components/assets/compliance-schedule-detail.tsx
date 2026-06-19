"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import useSWR, { mutate } from "swr";
import ConfirmDialog from "@/components/common/confirm-dialog";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import {
  deleteAssetComplianceSchedule,
  getAssetComplianceSchedule,
  updateAssetComplianceSchedule,
} from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";
import { assetPath } from "@/lib/routes";

export default function ComplianceScheduleDetail({
  assetId,
  locationId,
  scheduleId,
}: {
  assetId: string;
  locationId: string;
  scheduleId: string;
}) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    ["asset-compliance-schedule", assetId, scheduleId],
    () => getAssetComplianceSchedule(assetId, scheduleId)
  );
  const [form, setForm] = useState<Schema<"UpdateComplianceScheduleRequest">>({
    title: "",
    frequencyInterval: 1,
    frequencyUnit: "MONTHS",
    nextDueDate: new Date().toISOString(),
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title ?? "",
        description: data.description,
        frequencyInterval: data.frequencyInterval ?? 1,
        frequencyUnit: data.frequencyUnit ?? "MONTHS",
        nextDueDate: data.nextDueDate ?? new Date().toISOString(),
        active: data.active ?? true,
      });
    }
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateAssetComplianceSchedule(assetId, scheduleId, form);
      await mutate(["asset-compliance-schedule", assetId, scheduleId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDecommission() {
    await deleteAssetComplianceSchedule(assetId, scheduleId);
    router.push(assetPath(assetId, locationId, "/compliance-schedules"));
  }

  return (
    <Box sx={{ maxWidth: 560 }}>
      <PageHeader
        title={data?.title ?? "Compliance schedule"}
        actions={
          <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
            Decommission
          </Button>
        }
      />
      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Description"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <TextField
          type="number"
          label="Frequency interval"
          value={form.frequencyInterval}
          onChange={(e) =>
            setForm({ ...form, frequencyInterval: Number(e.target.value) })
          }
        />
        <FormControl>
          <InputLabel>Frequency unit</InputLabel>
          <Select
            label="Frequency unit"
            value={form.frequencyUnit}
            onChange={(e) =>
              setForm({
                ...form,
                frequencyUnit: e.target.value as Schema<"UpdateComplianceScheduleRequest">["frequencyUnit"],
              })
            }
          >
            {["HOURS", "DAYS", "WEEKS", "MONTHS", "YEARS"].map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="datetime-local"
          label="Next due date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.nextDueDate.slice(0, 16)}
          onChange={(e) =>
            setForm({ ...form, nextDueDate: new Date(e.target.value).toISOString() })
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.active ?? true}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
          }
          label="Active"
        />
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save changes
        </Button>
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Decommission schedule"
        message="This will decommission the compliance schedule."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDecommission}
      />
    </Box>
  );
}
