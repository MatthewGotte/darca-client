"use client";

import useSWR from "swr";
import {
  createOrganisationUser,
  deleteOrganisationUser,
  getOrganisationUser,
  listOrganisationUsers,
  setUserPassword,
  updateOrganisationUser,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type {
  CreateUserRequest,
  SetPasswordRequest,
  UpdateUserRequest,
} from "@/lib/api/types";

export function useOrganisationUsers(
  orgId: string | undefined,
  params?: { includeDecommissioned?: boolean }
) {
  return useSWR(
    orgId ? queryKeys.users(orgId, params) : null,
    () => listOrganisationUsers(orgId!, params)
  );
}

export function useOrganisationUser(
  orgId: string | undefined,
  userId: string | undefined
) {
  return useSWR(
    orgId && userId ? queryKeys.user(orgId, userId) : null,
    () => getOrganisationUser(orgId!, userId!)
  );
}

export function useCreateOrganisationUser(orgId: string) {
  return useApiMutation<CreateUserRequest, Awaited<ReturnType<typeof createOrganisationUser>>>(
    `mutation:create-user:${orgId}`,
    (body) => createOrganisationUser(orgId, body),
    { invalidate: [queryKeys.users(orgId)] }
  );
}

export function useUpdateOrganisationUser(orgId: string, userId: string) {
  return useApiMutation<UpdateUserRequest, Awaited<ReturnType<typeof updateOrganisationUser>>>(
    `mutation:update-user:${orgId}:${userId}`,
    (body) => updateOrganisationUser(orgId, userId, body),
    {
      invalidate: [
        queryKeys.users(orgId),
        queryKeys.user(orgId, userId),
      ],
    }
  );
}

export function useDeleteOrganisationUser(orgId: string, userId: string) {
  return useApiMutation<void, void>(
    `mutation:delete-user:${orgId}:${userId}`,
    () => deleteOrganisationUser(orgId, userId),
    {
      invalidate: [
        queryKeys.users(orgId),
        queryKeys.user(orgId, userId),
      ],
    }
  );
}

export function useSetUserPassword(userId: string) {
  return useApiMutation<SetPasswordRequest, void>(
    `mutation:set-user-password:${userId}`,
    (body) => setUserPassword(userId, body)
  );
}
