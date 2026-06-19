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
import { listCustomFields } from "@/lib/api/api";

export default function CustomFieldsList() {
  const { data, error, isLoading } = useSWR("custom-fields", listCustomFields);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Custom fields"
        actions={
          <Button component={Link} href="/settings/custom-fields/new" variant="contained">
            Add custom field
          </Button>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Label</TableCell>
            <TableCell>Data type</TableCell>
            <TableCell>Required</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((field) => (
            <TableRow key={field.id} hover>
              <TableCell>
                <Link href={`/settings/custom-fields/${field.id}`}>{field.label}</Link>
              </TableCell>
              <TableCell>{field.dataType}</TableCell>
              <TableCell>{field.required ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
