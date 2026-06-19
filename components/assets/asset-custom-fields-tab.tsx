"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useSWR, { mutate } from "swr";
import { getCategory, replaceAssetCustomFields } from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";

export default function AssetCustomFieldsTab({
  assetId,
  categoryId,
  customFields,
}: {
  assetId: string;
  categoryId?: string;
  customFields?: Schema<"AssetCustomFieldValueResponse">[];
}) {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const { data: category } = useSWR(
    categoryId ? ["category", categoryId] : null,
    () => getCategory(categoryId!)
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initial: Record<string, string> = {};
    customFields?.forEach((f) => {
      if (f.customFieldId) initial[f.customFieldId] = f.value ?? "";
    });
    category?.customFields?.forEach((f) => {
      if (f.id && !(f.id in initial)) initial[f.id] = "";
    });
    setValues(initial);
  }, [customFields, category]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await replaceAssetCustomFields(assetId, {
        values: Object.entries(values).map(([customFieldId, value]) => ({
          customFieldId,
          value,
        })),
      });
      if (locationId) await mutate(["location-asset", locationId, assetId]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const fields =
    category?.customFields?.length
      ? category.customFields
      : customFields?.map((f) => ({
          id: f.customFieldId,
          label: f.label,
          dataType: f.dataType,
        })) ?? [];

  return (
    <Box sx={{ maxWidth: 480 }}>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        {fields.map((field) => (
          <TextField
            key={field.id}
            label={field.label}
            value={values[field.id!] ?? ""}
            onChange={(e) =>
              setValues({ ...values, [field.id!]: e.target.value })
            }
          />
        ))}
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save custom fields
        </Button>
      </Stack>
    </Box>
  );
}
