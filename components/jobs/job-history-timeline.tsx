"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import StatusChip from "@/components/common/status-chip";
import { getJobHistory } from "@/lib/api/api";

export default function JobHistoryTimeline({ jobId }: { jobId: string }) {
  const { data, error, isLoading } = useSWR(["job-history", jobId], () =>
    getJobHistory(jobId)
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Stack spacing={2}>
      {data?.map((entry) => (
        <Paper key={entry.id} sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
            <StatusChip label={entry.status} />
            {entry.complianceResult ? (
              <StatusChip label={entry.complianceResult} />
            ) : null}
            <Typography variant="caption" color="text.secondary">
              {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}
            </Typography>
          </Box>
          <Typography variant="body2">
            Changed by: {entry.changedByUserName ?? entry.changedByUserId ?? "—"}
          </Typography>
          {entry.performedByUserName ? (
            <Typography variant="body2">Performed by: {entry.performedByUserName}</Typography>
          ) : null}
          {entry.notes ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {entry.notes}
            </Typography>
          ) : null}
        </Paper>
      ))}
      {!data?.length ? (
        <Typography color="text.secondary">No history entries yet.</Typography>
      ) : null}
    </Stack>
  );
}
