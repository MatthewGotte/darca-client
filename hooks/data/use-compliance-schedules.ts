"use client";

import useSWR from "swr";
import {
  createAssetComplianceSchedule,
  deleteAssetComplianceSchedule,
  getAssetComplianceSchedule,
  listAssetComplianceSchedules,
  updateAssetComplianceSchedule,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import { useOrgId } from "@/hooks/use-org-id";
import type {
  CreateComplianceScheduleRequest,
  UpdateComplianceScheduleRequest,
} from "@/lib/api/types";

function complianceListInvalidation(assetId: string, orgId: string | undefined) {
  return [
    queryKeys.complianceSchedules(assetId),
    ...(orgId ? [queryKeys.organisationComplianceSchedulesList(orgId)] : []),
  ];
}

export function useAssetComplianceSchedules(assetId: string | undefined) {
  return useSWR(
    assetId ? queryKeys.complianceSchedules(assetId) : null,
    () => listAssetComplianceSchedules(assetId!)
  );
}

export function useAssetComplianceSchedule(
  assetId: string | undefined,
  scheduleId: string | undefined
) {
  return useSWR(
    assetId && scheduleId
      ? queryKeys.complianceSchedule(assetId, scheduleId)
      : null,
    () => getAssetComplianceSchedule(assetId!, scheduleId!)
  );
}

export function useCreateAssetComplianceSchedule(assetId: string) {
  const orgId = useOrgId();
  return useApiMutation<
    CreateComplianceScheduleRequest,
    Awaited<ReturnType<typeof createAssetComplianceSchedule>>
  >(
    `mutation:create-compliance-schedule:${assetId}`,
    (body) => createAssetComplianceSchedule(assetId, body),
    { invalidate: complianceListInvalidation(assetId, orgId) }
  );
}

export function useUpdateAssetComplianceSchedule(
  assetId: string,
  scheduleId: string
) {
  const orgId = useOrgId();
  return useApiMutation<
    UpdateComplianceScheduleRequest,
    Awaited<ReturnType<typeof updateAssetComplianceSchedule>>
  >(
    `mutation:update-compliance-schedule:${assetId}:${scheduleId}`,
    (body) => updateAssetComplianceSchedule(assetId, scheduleId, body),
    {
      invalidate: [
        ...complianceListInvalidation(assetId, orgId),
        queryKeys.complianceSchedule(assetId, scheduleId),
      ],
    }
  );
}

export function useDeleteAssetComplianceSchedule(
  assetId: string,
  scheduleId: string
) {
  const orgId = useOrgId();
  return useApiMutation<void, void>(
    `mutation:delete-compliance-schedule:${assetId}:${scheduleId}`,
    () => deleteAssetComplianceSchedule(assetId, scheduleId),
    {
      invalidate: [
        ...complianceListInvalidation(assetId, orgId),
        queryKeys.complianceSchedule(assetId, scheduleId),
      ],
    }
  );
}
