"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import PageHeader from "@/components/common/page-header";
import { createAssetComplianceSchedule } from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";
import { assetPath } from "@/lib/routes";

export default function CreateComplianceScheduleForm({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Schema<"CreateComplianceScheduleRequest">>({
    title: "",
    frequencyInterval: 1,
    frequencyUnit: "MONTHS",
    nextDueDate: new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const schedule = await createAssetComplianceSchedule(assetId, form);
      router.push(
        assetPath(assetId, locationId, `/compliance-schedules/${schedule.id}`)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 560 }}>
      <PageHeader title="Create compliance schedule" />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        <TextField
          required
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
          required
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
                frequencyUnit: e.target.value as Schema<"CreateComplianceScheduleRequest">["frequencyUnit"],
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
          required
          type="datetime-local"
          label="Next due date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.nextDueDate.slice(0, 16)}
          onChange={(e) =>
            setForm({ ...form, nextDueDate: new Date(e.target.value).toISOString() })
          }
        />
        <Button type="submit" variant="contained" disabled={loading || !form.title}>
          Create schedule
        </Button>
      </Stack>
    </Box>
  );
}
