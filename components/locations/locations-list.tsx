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
import {
  createOrganisationLocation,
  listOrganisationLocations,
} from "@/lib/api/api";
import { locationPath } from "@/lib/routes";

export default function LocationsList({ orgId }: { orgId: string }) {
  const { data, error, isLoading } = useSWR(
    ["organisation-locations", orgId],
    () => listOrganisationLocations(orgId)
  );
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [timezone, setTimezone] = useState("");
  const [creating, setCreating] = useState(false);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleCreate() {
    setCreating(true);
    try {
      await createOrganisationLocation(orgId, {
        name,
        address: address || undefined,
        timezone: timezone || undefined,
      });
      await mutate(["organisation-locations", orgId]);
      setOpen(false);
      setName("");
      setAddress("");
      setTimezone("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Box>
      <PageHeader
        title="Locations"
        actions={
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add location
          </Button>
        }
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Timezone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((location) => (
            <TableRow key={location.id} hover>
              <TableCell>
                <Link href={locationPath(orgId, location.id!)}>
                  {location.name}
                </Link>
              </TableCell>
              <TableCell>{location.address ?? "—"}</TableCell>
              <TableCell>{location.timezone ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create location</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <TextField label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
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
