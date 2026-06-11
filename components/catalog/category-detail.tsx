"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";
import ConfirmDialog from "@/components/common/confirm-dialog";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import {
  deleteCategory,
  getCategory,
  listCustomFields,
  updateCategory,
  updateCategoryCustomFields,
} from "@/lib/api/api";

export default function CategoryDetail({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(["category", categoryId], () =>
    getCategory(categoryId)
  );
  const { data: allFields } = useSWR("custom-fields", listCustomFields);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldIds, setFieldIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setDescription(data.description ?? "");
      setFieldIds(data.customFields?.map((f) => f.id!).filter(Boolean) ?? []);
    }
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateCategory(categoryId, {
        name,
        description: description || undefined,
      });
      await mutate(["category", categoryId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveFields() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateCategoryCustomFields(categoryId, { customFieldIds: fieldIds });
      await mutate(["category", categoryId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save fields");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await deleteCategory(categoryId);
    router.push("/settings/categories");
  }

  return (
    <Box sx={{ maxWidth: 640 }}>
      <PageHeader
        title={data?.name ?? "Category"}
        actions={
          <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        }
      />
      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}
      <Stack spacing={3}>
        <Stack spacing={2}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            Save details
          </Button>
        </Stack>

        <Box>
          <Typography variant="h6" gutterBottom>
            Custom fields
          </Typography>
          <FormGroup>
            {allFields?.map((field) => (
              <FormControlLabel
                key={field.id}
                control={
                  <Checkbox
                    checked={fieldIds.includes(field.id!)}
                    onChange={() =>
                      setFieldIds((prev) =>
                        prev.includes(field.id!)
                          ? prev.filter((id) => id !== field.id)
                          : [...prev, field.id!]
                      )
                    }
                  />
                }
                label={field.label}
              />
            ))}
          </FormGroup>
          <Button sx={{ mt: 1 }} variant="contained" onClick={handleSaveFields} disabled={saving}>
            Save custom fields
          </Button>
        </Box>
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete category"
        message="This will permanently delete the category."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
