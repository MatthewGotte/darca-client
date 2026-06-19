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
import { listTypes } from "@/lib/api/api";

export default function TypesList() {
  const { data, error, isLoading } = useSWR("types", listTypes);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Types"
        actions={
          <Button component={Link} href="/settings/types/new" variant="contained">
            Add type
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
          {data?.map((type) => (
            <TableRow key={type.id} hover>
              <TableCell>
                <Link href={`/settings/types/${type.id}`}>{type.name}</Link>
              </TableCell>
              <TableCell>{type.description ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
