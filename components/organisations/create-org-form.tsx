"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createOrganisation } from "@/lib/api/api";
import { useOrgContext } from "@/lib/context/org-context";
import PageHeader from "@/components/common/page-header";
import { orgPath } from "@/lib/routes";

export default function CreateOrgForm() {
  const router = useRouter();
  const { setOrgId } = useOrgContext();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const org = await createOrganisation({ name });
      if (org.id) {
        setOrgId(org.id);
        router.push(orgPath(org.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organisation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>
      <PageHeader title="Create organisation" />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <TextField
        fullWidth
        required
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" disabled={loading || !name.trim()}>
        Create
      </Button>
    </Box>
  );
}
