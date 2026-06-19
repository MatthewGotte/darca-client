"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import LoadingState from "@/components/common/loading-state";

function RequireLocationIdContent({
  children,
}: {
  children: (locationId: string) => React.ReactNode;
}) {
  const locationId = useSearchParams().get("locationId");
  if (!locationId) {
    return (
      <Alert severity="warning">
        Missing locationId query parameter. Open this page from a location assets list.
      </Alert>
    );
  }
  return <>{children(locationId)}</>;
}

export default function RequireLocationId({
  children,
}: {
  children: (locationId: string) => React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <RequireLocationIdContent>{children}</RequireLocationIdContent>
    </Suspense>
  );
}
