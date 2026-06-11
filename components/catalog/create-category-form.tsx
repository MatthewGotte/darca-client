"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import PageHeader from "@/components/common/page-header";
import { createCategory } from "@/lib/api/api";

export default function CreateCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const category = await createCategory({
        name,
        description: description || undefined,
      });
      router.push(`/settings/categories/${category.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>
      <PageHeader title="Create category" />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        <TextField required label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit" variant="contained" disabled={loading || !name}>
          Create category
        </Button>
      </Stack>
    </Box>
  );
}
