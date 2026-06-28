"use client";

import useSWR from "swr";
import {
  createOrganisationLocation,
  deleteOrganisationLocation,
  getOrganisationLocation,
  listOrganisationLocations,
  updateOrganisationLocation,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type { CreateLocationRequest, UpdateLocationRequest } from "@/lib/api/types";

export function useOrganisationLocations(orgId: string | undefined) {
  return useSWR(
    orgId ? queryKeys.locations(orgId) : null,
    () => listOrganisationLocations(orgId!)
  );
}

export function useOrganisationLocation(
  orgId: string | undefined,
  locationId: string | undefined
) {
  return useSWR(
    orgId && locationId ? queryKeys.location(orgId, locationId) : null,
    () => getOrganisationLocation(orgId!, locationId!)
  );
}

export function useCreateOrganisationLocation(orgId: string) {
  return useApiMutation<
    CreateLocationRequest,
    Awaited<ReturnType<typeof createOrganisationLocation>>
  >(
    `mutation:create-location:${orgId}`,
    (body) => createOrganisationLocation(orgId, body),
    { invalidate: [queryKeys.locations(orgId)] }
  );
}

export function useUpdateOrganisationLocation(orgId: string, locationId: string) {
  return useApiMutation<
    UpdateLocationRequest,
    Awaited<ReturnType<typeof updateOrganisationLocation>>
  >(
    `mutation:update-location:${orgId}:${locationId}`,
    (body) => updateOrganisationLocation(orgId, locationId, body),
    {
      invalidate: [
        queryKeys.locations(orgId),
        queryKeys.location(orgId, locationId),
      ],
    }
  );
}

export function useDeleteOrganisationLocation(orgId: string, locationId: string) {
  return useApiMutation<void, void>(
    `mutation:delete-location:${orgId}:${locationId}`,
    () => deleteOrganisationLocation(orgId, locationId),
    {
      invalidate: [
        queryKeys.locations(orgId),
        queryKeys.location(orgId, locationId),
      ],
    }
  );
}
