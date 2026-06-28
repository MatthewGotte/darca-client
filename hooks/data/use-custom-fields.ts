"use client";

import useSWR from "swr";
import {
  createCustomField,
  deleteCustomField,
  getCustomField,
  listCustomFields,
  updateCustomField,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type {
  CreateCustomFieldRequest,
  UpdateCustomFieldRequest,
} from "@/lib/api/types";

export function useCustomFields() {
  return useSWR(queryKeys.customFields(), listCustomFields);
}

export function useCustomField(id: string | undefined) {
  return useSWR(
    id ? queryKeys.customField(id) : null,
    () => getCustomField(id!)
  );
}

export function useCreateCustomField() {
  return useApiMutation<
    CreateCustomFieldRequest,
    Awaited<ReturnType<typeof createCustomField>>
  >(
    "mutation:create-custom-field",
    (body) => createCustomField(body),
    { invalidate: [queryKeys.customFields()] }
  );
}

export function useUpdateCustomField(id: string) {
  return useApiMutation<
    UpdateCustomFieldRequest,
    Awaited<ReturnType<typeof updateCustomField>>
  >(
    `mutation:update-custom-field:${id}`,
    (body) => updateCustomField(id, body),
    {
      invalidate: [
        queryKeys.customFields(),
        queryKeys.customField(id),
      ],
    }
  );
}

export function useDeleteCustomField(id: string) {
  return useApiMutation<void, void>(
    `mutation:delete-custom-field:${id}`,
    () => deleteCustomField(id),
    {
      invalidate: [
        queryKeys.customFields(),
        queryKeys.customField(id),
      ],
    }
  );
}
