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
import { deleteCustomField, getCustomField, updateCustomField } from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";

export default function CustomFieldDetail({ fieldId }: { fieldId: string }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(["custom-field", fieldId], () =>
    getCustomField(fieldId)
  );
  const [form, setForm] = useState<Schema<"UpdateCustomFieldRequest">>({
    label: "",
    dataType: "TEXT",
    required: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        label: data.label ?? "",
        dataType: data.dataType ?? "TEXT",
        required: data.required ?? false,
      });
    }
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateCustomField(fieldId, form);
      await mutate(["custom-field", fieldId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await deleteCustomField(fieldId);
    router.push("/settings/custom-fields");
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <PageHeader
        title={data?.label ?? "Custom field"}
        actions={
          <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        }
      />
      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}
      <Stack spacing={2}>
        <TextField
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
                dataType: e.target.value as Schema<"UpdateCustomFieldRequest">["dataType"],
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
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save changes
        </Button>
      </Stack>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete custom field"
        message="This will permanently delete the custom field."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
