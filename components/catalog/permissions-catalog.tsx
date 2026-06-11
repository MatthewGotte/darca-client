"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import { listPermissions } from "@/lib/api/api";

export default function PermissionsCatalog() {
  const { data, error, isLoading } = useSWR("permissions", listPermissions);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="Permissions"
        description="Read-only reference of all available permissions in the system."
      />
      <Stack spacing={2}>
        {data?.map((group) => (
          <Paper key={group.group} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {group.group}
            </Typography>
            <Stack spacing={1}>
              {group.permissions?.map((perm) => (
                <Box key={perm.id}>
                  <Typography variant="subtitle2">{perm.name}</Typography>
                  {perm.description ? (
                    <Typography variant="body2" color="text.secondary">
                      {perm.description}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
