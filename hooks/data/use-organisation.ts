"use client";

import useSWR from "swr";
import { getOrganisation, updateOrganisation } from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type { UpdateOrganisationRequest } from "@/lib/api/types";

export function useOrganisation(id: string | undefined) {
  return useSWR(
    id ? queryKeys.organisation(id) : null,
    () => getOrganisation(id!)
  );
}

export function useUpdateOrganisation(id: string) {
  return useApiMutation<UpdateOrganisationRequest, Awaited<ReturnType<typeof updateOrganisation>>>(
    `mutation:update-organisation:${id}`,
    (body) => updateOrganisation(id, body),
    { invalidate: [queryKeys.organisation(id)] }
  );
}
