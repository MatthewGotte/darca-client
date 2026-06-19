"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import PageHeader from "@/components/common/page-header";
import { createOrganisationUser } from "@/lib/api/api";
import { orgPath } from "@/lib/routes";

export default function CreateUserForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await createOrganisationUser(orgId, { name, email });
      router.push(orgPath(orgId, `/users/${user.id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>
      <PageHeader title="Create user" />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        <TextField required label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField required type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="contained" disabled={loading || !name || !email}>
          Create user
        </Button>
      </Stack>
    </Box>
  );
}
