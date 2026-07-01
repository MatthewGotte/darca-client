"use client";

import useSWR from "swr";
import { listOrganisationAssets } from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import type { AssetStatus } from "@/lib/api/types";

export function useOrganisationAssets(
  orgId: string | undefined,
  params?: { locationId?: string; status?: AssetStatus; categoryId?: string }
) {
  return useSWR(
    orgId ? queryKeys.organisationAssets(orgId, params) : null,
    () => listOrganisationAssets(orgId!, params)
  );
}
