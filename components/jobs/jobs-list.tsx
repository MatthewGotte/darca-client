"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import useSWR from "swr";
import Link from "@/components/link";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import StatusChip from "@/components/common/status-chip";
import { listAssetJobs } from "@/lib/api/api";
import type { JobPriority, JobStatus } from "@/lib/api/types";
import { assetPath, jobPath } from "@/lib/routes";

function JobsListContent({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") as JobStatus | null) ?? undefined;
  const priority = (searchParams.get("priority") as JobPriority | null) ?? undefined;
  const filters = useMemo(() => ({ status, priority }), [status, priority]);

  const { data, error, isLoading } = useSWR(
    ["asset-jobs", assetId, filters],
    () => listAssetJobs(assetId, filters)
  );

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Jobs"
        actions={
          <Button
            component={Link}
            href={assetPath(assetId, locationId, "/jobs/new")}
            variant="contained"
          >
            Create job
          </Button>
        }
      />

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status ?? ""}
            onChange={(e) => updateFilter("status", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {["PENDING", "IN_PROGRESS", "COMPLETED", "ARCHIVED"].map((s) => (
              <MenuItem key={s} value={s}>
                {s.replace(/_/g, " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={priority ?? ""}
            onChange={(e) => updateFilter("priority", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Due</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((job) => (
            <TableRow key={job.id} hover>
              <TableCell>
                <Link href={jobPath(job.id!)}>{job.title}</Link>
              </TableCell>
              <TableCell>{job.type?.replace(/_/g, " ") ?? "—"}</TableCell>
              <TableCell>
                <StatusChip label={job.status} />
              </TableCell>
              <TableCell>
                <StatusChip label={job.priority} />
              </TableCell>
              <TableCell>
                {job.dueDate ? new Date(job.dueDate).toLocaleString() : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default function JobsList({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <JobsListContent assetId={assetId} locationId={locationId} />
    </Suspense>
  );
}
