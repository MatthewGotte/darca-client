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
import { createAssetJob } from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";
import { jobPath } from "@/lib/routes";

export default function CreateJobForm({ assetId }: { assetId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Schema<"CreateJobRequest">>({
    title: "",
    type: "PREVENTATIVE",
    priority: "MEDIUM",
    dueDate: new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const job = await createAssetJob(assetId, form);
      router.push(jobPath(job.id!));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 560 }}>
      <PageHeader title="Create job" />
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
          multiline
          minRows={3}
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={form.type ?? "PREVENTATIVE"}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as Schema<"CreateJobRequest">["type"],
              })
            }
          >
            {["PREVENTATIVE", "CORRECTIVE", "INSPECTION", "EMERGENCY"].map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={form.priority ?? "MEDIUM"}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as Schema<"CreateJobRequest">["priority"],
              })
            }
          >
            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          type="datetime-local"
          label="Due date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.dueDate.slice(0, 16)}
          onChange={(e) =>
            setForm({ ...form, dueDate: new Date(e.target.value).toISOString() })
          }
        />
        <Button type="submit" variant="contained" disabled={loading || !form.title}>
          Create job
        </Button>
      </Stack>
    </Box>
  );
}
