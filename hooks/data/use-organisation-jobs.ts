"use client";

import useSWR from "swr";
import { listOrganisationJobs } from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import type { JobPriority, JobStatus } from "@/lib/api/types";

export function useOrganisationJobs(
  orgId: string | undefined,
  params?: {
    locationId?: string;
    assetId?: string;
    status?: JobStatus;
    priority?: JobPriority;
    assignedUserId?: string;
  }
) {
  return useSWR(
    orgId ? queryKeys.organisationJobs(orgId, params) : null,
    () => listOrganisationJobs(orgId!, params)
  );
}
