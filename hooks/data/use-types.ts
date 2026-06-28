"use client";

import useSWR from "swr";
import {
  createType,
  deleteType,
  getType,
  listTypes,
  updateType,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type { CreateTypeRequest, UpdateTypeRequest } from "@/lib/api/types";

export function useTypes() {
  return useSWR(queryKeys.types(), listTypes);
}

export function useType(id: string | undefined) {
  return useSWR(
    id ? queryKeys.type(id) : null,
    () => getType(id!)
  );
}

export function useCreateType() {
  return useApiMutation<
    CreateTypeRequest,
    Awaited<ReturnType<typeof createType>>
  >(
    "mutation:create-type",
    (body) => createType(body),
    { invalidate: [queryKeys.types()] }
  );
}

export function useUpdateType(id: string) {
  return useApiMutation<
    UpdateTypeRequest,
    Awaited<ReturnType<typeof updateType>>
  >(
    `mutation:update-type:${id}`,
    (body) => updateType(id, body),
    {
      invalidate: [
        queryKeys.types(),
        queryKeys.type(id),
      ],
    }
  );
}

export function useDeleteType(id: string) {
  return useApiMutation<void, void>(
    `mutation:delete-type:${id}`,
    () => deleteType(id),
    {
      invalidate: [
        queryKeys.types(),
        queryKeys.type(id),
      ],
    }
  );
}
