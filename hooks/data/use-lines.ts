"use client";

import useSWR from "swr";
import {
  createLocationLine,
  deleteLocationLine,
  getLocationLine,
  listLocationLines,
  updateLocationLine,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type { CreateLineRequest, UpdateLineRequest } from "@/lib/api/types";

export function useLocationLines(locationId: string | undefined) {
  return useSWR(
    locationId ? queryKeys.lines(locationId) : null,
    () => listLocationLines(locationId!)
  );
}

export function useLocationLine(
  locationId: string | undefined,
  lineId: string | undefined
) {
  return useSWR(
    locationId && lineId ? queryKeys.line(locationId, lineId) : null,
    () => getLocationLine(locationId!, lineId!)
  );
}

export function useCreateLocationLine(locationId: string) {
  return useApiMutation<
    CreateLineRequest,
    Awaited<ReturnType<typeof createLocationLine>>
  >(
    `mutation:create-line:${locationId}`,
    (body) => createLocationLine(locationId, body),
    { invalidate: [queryKeys.lines(locationId)] }
  );
}

export function useUpdateLocationLine(locationId: string, lineId: string) {
  return useApiMutation<
    UpdateLineRequest,
    Awaited<ReturnType<typeof updateLocationLine>>
  >(
    `mutation:update-line:${locationId}:${lineId}`,
    (body) => updateLocationLine(locationId, lineId, body),
    {
      invalidate: [
        queryKeys.lines(locationId),
        queryKeys.line(locationId, lineId),
      ],
    }
  );
}

export function useDeleteLocationLine(locationId: string, lineId: string) {
  return useApiMutation<void, void>(
    `mutation:delete-line:${locationId}:${lineId}`,
    () => deleteLocationLine(locationId, lineId),
    {
      invalidate: [
        queryKeys.lines(locationId),
        queryKeys.line(locationId, lineId),
      ],
    }
  );
}
