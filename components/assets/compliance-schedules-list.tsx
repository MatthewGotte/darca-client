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
import { listAssetComplianceSchedules } from "@/lib/api/api";
import { assetPath } from "@/lib/routes";

export default function ComplianceSchedulesList({
  assetId,
  locationId,
}: {
  assetId: string;
  locationId: string;
}) {
  const { data, error, isLoading } = useSWR(
    ["asset-compliance-schedules", assetId],
    () => listAssetComplianceSchedules(assetId)
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Compliance schedules"
        actions={
          <Button
            component={Link}
            href={assetPath(assetId, locationId, "/compliance-schedules/new")}
            variant="contained"
          >
            Add schedule
          </Button>
        }
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Frequency</TableCell>
            <TableCell>Next due</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((schedule) => (
            <TableRow key={schedule.id} hover>
              <TableCell>
                <Link
                  href={assetPath(
                    assetId,
                    locationId,
                    `/compliance-schedules/${schedule.id}`
                  )}
                >
                  {schedule.title}
                </Link>
              </TableCell>
              <TableCell>
                Every {schedule.frequencyInterval} {schedule.frequencyUnit?.toLowerCase()}
              </TableCell>
              <TableCell>
                {schedule.nextDueDate
                  ? new Date(schedule.nextDueDate).toLocaleString()
                  : "—"}
              </TableCell>
              <TableCell>{schedule.active ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
