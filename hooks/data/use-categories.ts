"use client";

import useSWR from "swr";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
  updateCategoryCustomFields,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type {
  AssignCustomFieldsRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/api/types";

export function useCategories() {
  return useSWR(queryKeys.categories(), listCategories);
}

export function useCategory(id: string | undefined) {
  return useSWR(
    id ? queryKeys.category(id) : null,
    () => getCategory(id!)
  );
}

export function useCreateCategory() {
  return useApiMutation<
    CreateCategoryRequest,
    Awaited<ReturnType<typeof createCategory>>
  >(
    "mutation:create-category",
    (body) => createCategory(body),
    { invalidate: [queryKeys.categories()] }
  );
}

export function useUpdateCategory(id: string) {
  return useApiMutation<
    UpdateCategoryRequest,
    Awaited<ReturnType<typeof updateCategory>>
  >(
    `mutation:update-category:${id}`,
    (body) => updateCategory(id, body),
    {
      invalidate: [
        queryKeys.categories(),
        queryKeys.category(id),
      ],
    }
  );
}

export function useUpdateCategoryCustomFields(id: string) {
  return useApiMutation<
    AssignCustomFieldsRequest,
    Awaited<ReturnType<typeof updateCategoryCustomFields>>
  >(
    `mutation:update-category-custom-fields:${id}`,
    (body) => updateCategoryCustomFields(id, body),
    {
      invalidate: [
        queryKeys.categories(),
        queryKeys.category(id),
      ],
    }
  );
}

export function useDeleteCategory(id: string) {
  return useApiMutation<void, void>(
    `mutation:delete-category:${id}`,
    () => deleteCategory(id),
    {
      invalidate: [
        queryKeys.categories(),
        queryKeys.category(id),
      ],
    }
  );
}
