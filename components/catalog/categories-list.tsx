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
import { listCategories } from "@/lib/api/api";

export default function CategoriesList() {
  const { data, error, isLoading } = useSWR("categories", listCategories);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Categories"
        actions={
          <Button component={Link} href="/settings/categories/new" variant="contained">
            Add category
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
          {data?.map((category) => (
            <TableRow key={category.id} hover>
              <TableCell>
                <Link href={`/settings/categories/${category.id}`}>{category.name}</Link>
              </TableCell>
              <TableCell>{category.description ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
