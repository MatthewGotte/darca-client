"use client";

import { useState } from "react";
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
import PageHeader from "@/components/common/page-header";
import { createCustomField } from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";

export default function CreateCustomFieldForm() {
  const router = useRouter();
  const [form, setForm] = useState<Schema<"CreateCustomFieldRequest">>({
    label: "",
    dataType: "TEXT",
    required: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const field = await createCustomField(form);
      router.push(`/settings/custom-fields/${field.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create custom field");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>
      <PageHeader title="Create custom field" />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        <TextField
          required
          label="Label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <FormControl>
          <InputLabel>Data type</InputLabel>
          <Select
            label="Data type"
            value={form.dataType}
            onChange={(e) =>
              setForm({
                ...form,
                dataType: e.target.value as Schema<"CreateCustomFieldRequest">["dataType"],
              })
            }
          >
            {["TEXT", "NUMBER", "DATE", "BOOLEAN", "SELECT"].map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={form.required ?? false}
              onChange={(e) => setForm({ ...form, required: e.target.checked })}
            />
          }
          label="Required"
        />
        <Button type="submit" variant="contained" disabled={loading || !form.label}>
          Create custom field
        </Button>
      </Stack>
    </Box>
  );
}
