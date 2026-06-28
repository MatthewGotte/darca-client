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
import type {
  CreateComplianceScheduleRequest,
  UpdateComplianceScheduleRequest,
} from "@/lib/api/types";

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
  return useApiMutation<
    CreateComplianceScheduleRequest,
    Awaited<ReturnType<typeof createAssetComplianceSchedule>>
  >(
    `mutation:create-compliance-schedule:${assetId}`,
    (body) => createAssetComplianceSchedule(assetId, body),
    { invalidate: [queryKeys.complianceSchedules(assetId)] }
  );
}

export function useUpdateAssetComplianceSchedule(
  assetId: string,
  scheduleId: string
) {
  return useApiMutation<
    UpdateComplianceScheduleRequest,
    Awaited<ReturnType<typeof updateAssetComplianceSchedule>>
  >(
    `mutation:update-compliance-schedule:${assetId}:${scheduleId}`,
    (body) => updateAssetComplianceSchedule(assetId, scheduleId, body),
    {
      invalidate: [
        queryKeys.complianceSchedules(assetId),
        queryKeys.complianceSchedule(assetId, scheduleId),
      ],
    }
  );
}

export function useDeleteAssetComplianceSchedule(
  assetId: string,
  scheduleId: string
) {
  return useApiMutation<void, void>(
    `mutation:delete-compliance-schedule:${assetId}:${scheduleId}`,
    () => deleteAssetComplianceSchedule(assetId, scheduleId),
    {
      invalidate: [
        queryKeys.complianceSchedules(assetId),
        queryKeys.complianceSchedule(assetId, scheduleId),
      ],
    }
  );
}
