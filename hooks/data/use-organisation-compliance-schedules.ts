"use client";

import useSWR from "swr";
import { listOrganisationComplianceSchedules } from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";

export function useOrganisationComplianceSchedules(
  orgId: string | undefined,
  params?: {
    locationId?: string;
    active?: boolean;
    overdue?: boolean;
  }
) {
  return useSWR(
    orgId ? queryKeys.organisationComplianceSchedules(orgId, params) : null,
    () => listOrganisationComplianceSchedules(orgId!, params)
  );
}
