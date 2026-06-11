"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import PageHeader from "@/components/common/page-header";
import { createOrganisationRole } from "@/lib/api/api";
import { orgPath } from "@/lib/routes";

export default function CreateRoleForm({ orgId }: { orgId: string }) {
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
      const role = await createOrganisationRole(orgId, {
        name,
        description: description || undefined,
      });
      router.push(orgPath(orgId, `/roles/${role.id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>
      <PageHeader title="Create role" />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        <TextField required label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit" variant="contained" disabled={loading || !name}>
          Create role
        </Button>
      </Stack>
    </Box>
  );
}
