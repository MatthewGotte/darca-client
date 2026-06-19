"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import useSWR, { mutate } from "swr";
import Link from "@/components/link";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import SyncLocationFromPath from "@/components/layout/sync-location-from-path";
import { createLocationLine, listLocationLines } from "@/lib/api/api";
import { locationPath } from "@/lib/routes";

export default function LinesList({
  orgId,
  locationId,
}: {
  orgId: string;
  locationId: string;
}) {
  const { data, error, isLoading } = useSWR(
    ["location-lines", locationId],
    () => listLocationLines(locationId)
  );
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleCreate() {
    setCreating(true);
    try {
      await createLocationLine(locationId, {
        name,
        description: description || undefined,
      });
      await mutate(["location-lines", locationId]);
      setOpen(false);
      setName("");
      setDescription("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Box>
      <SyncLocationFromPath orgId={orgId} locationId={locationId} />
      <PageHeader
        title="Lines"
        actions={
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add line
          </Button>
        }
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((line) => (
            <TableRow key={line.id} hover>
              <TableCell>
                <Link href={locationPath(orgId, locationId, `/lines/${line.id}`)}>
                  {line.name}
                </Link>
              </TableCell>
              <TableCell>{line.description ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create line</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating || !name.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
