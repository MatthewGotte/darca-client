"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSWR, { mutate } from "swr";
import {
  assignAssetUser,
  listOrganisationUsers,
  unassignAssetUser,
} from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";
import { useOrgContext } from "@/lib/context/org-context";

export default function AssetAssignmentsTab({
  assetId,
  assignments,
}: {
  assetId: string;
  assignments?: Schema<"AssetAssignmentResponse">[];
}) {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const { orgId } = useOrgContext();
  const { data: users } = useSWR(
    orgId ? ["organisation-users", orgId] : null,
    () => listOrganisationUsers(orgId!)
  );
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const assignedIds = new Set(assignments?.map((a) => a.userId));

  async function handleAssign() {
    if (!userId) return;
    setError(null);
    try {
      await assignAssetUser(assetId, { userId });
      if (locationId) await mutate(["location-asset", locationId, assetId]);
      setUserId("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to assign");
    }
  }

  async function handleUnassign(uid: string) {
    await unassignAssetUser(assetId, uid);
    if (locationId) await mutate(["location-asset", locationId, assetId]);
  }

  return (
    <Box>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {!orgId ? (
        <Alert severity="info">Organisation context required to assign users.</Alert>
      ) : (
        <Box sx={{ display: "flex", gap: 1, mb: 2, maxWidth: 400 }}>
          <FormControl fullWidth size="small">
            <InputLabel>User</InputLabel>
            <Select label="User" value={userId} onChange={(e) => setUserId(e.target.value)}>
              {users
                ?.filter((u) => u.id && !assignedIds.has(u.id))
                .map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAssign} disabled={!userId}>
            Assign
          </Button>
        </Box>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments?.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.userName ?? a.userId}</TableCell>
              <TableCell>
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleUnassign(a.userId!)}
                >
                  Unassign
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
