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
import { deleteType, getType, updateType } from "@/lib/api/api";

export default function TypeDetail({ typeId }: { typeId: string }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(["type", typeId], () => getType(typeId));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      await updateType(typeId, { name, description: description || undefined });
      await mutate(["type", typeId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await deleteType(typeId);
    router.push("/settings/types");
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <PageHeader
        title={data?.name ?? "Type"}
        actions={
          <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        }
      />
      {saveError ? <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert> : null}
      <Stack spacing={2}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save changes
        </Button>
      </Stack>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete type"
        message="This will permanently delete the type."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
