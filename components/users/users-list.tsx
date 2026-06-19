"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSWR from "swr";
import Link from "@/components/link";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import { listOrganisationUsers } from "@/lib/api/api";
import { orgPath } from "@/lib/routes";

export default function UsersList({ orgId }: { orgId: string }) {
  const [includeDecommissioned, setIncludeDecommissioned] = useState(false);
  const { data, error, isLoading } = useSWR(
    ["organisation-users", orgId, includeDecommissioned],
    () => listOrganisationUsers(orgId, { includeDecommissioned })
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Users"
        actions={
          <Button component={Link} href={orgPath(orgId, "/users/new")} variant="contained">
            Add user
          </Button>
        }
      />

      <FormControlLabel
        control={
          <Switch
            checked={includeDecommissioned}
            onChange={(e) => setIncludeDecommissioned(e.target.checked)}
          />
        }
        label="Include decommissioned"
        sx={{ mb: 2 }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Link href={orgPath(orgId, `/users/${user.id}`)}>{user.name}</Link>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.active ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
