"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import { listOrganisationRoles } from "@/lib/api/api";
import { orgPath } from "@/lib/routes";

export default function RolesList({ orgId }: { orgId: string }) {
  const { data, error, isLoading } = useSWR(["organisation-roles", orgId], () =>
    listOrganisationRoles(orgId)
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Roles"
        actions={
          <Button component={Link} href={orgPath(orgId, "/roles/new")} variant="contained">
            Add role
          </Button>
        }
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell>System</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((role) => (
            <TableRow key={role.id} hover>
              <TableCell>
                <Link href={orgPath(orgId, `/roles/${role.id}`)}>{role.name}</Link>
              </TableCell>
              <TableCell>{role.description ?? "—"}</TableCell>
              <TableCell>{role.permissionCount ?? 0}</TableCell>
              <TableCell>{role.system ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
