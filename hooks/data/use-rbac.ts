"use client";

import useSWR from "swr";
import {
  createOrganisationRole,
  deleteOrganisationRole,
  getOrganisationRole,
  listOrganisationRoles,
  listPermissions,
  updateOrganisationRole,
  updateOrganisationRolePermissions,
  updateUserLocationRoles,
  updateUserOrganisationRoles,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type {
  AssignPermissionsRequest,
  AssignRolesRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/lib/api/types";

export function usePermissions() {
  return useSWR(queryKeys.permissions(), listPermissions);
}

export function useOrganisationRoles(orgId: string | undefined) {
  return useSWR(
    orgId ? queryKeys.roles(orgId) : null,
    () => listOrganisationRoles(orgId!)
  );
}

export function useOrganisationRole(
  orgId: string | undefined,
  roleId: string | undefined
) {
  return useSWR(
    orgId && roleId ? queryKeys.role(orgId, roleId) : null,
    () => getOrganisationRole(orgId!, roleId!)
  );
}

export function useCreateOrganisationRole(orgId: string) {
  return useApiMutation<
    CreateRoleRequest,
    Awaited<ReturnType<typeof createOrganisationRole>>
  >(
    `mutation:create-role:${orgId}`,
    (body) => createOrganisationRole(orgId, body),
    { invalidate: [queryKeys.roles(orgId)] }
  );
}

export function useUpdateOrganisationRole(orgId: string, roleId: string) {
  return useApiMutation<
    UpdateRoleRequest,
    Awaited<ReturnType<typeof updateOrganisationRole>>
  >(
    `mutation:update-role:${orgId}:${roleId}`,
    (body) => updateOrganisationRole(orgId, roleId, body),
    {
      invalidate: [
        queryKeys.roles(orgId),
        queryKeys.role(orgId, roleId),
      ],
    }
  );
}

export function useUpdateOrganisationRolePermissions(
  orgId: string,
  roleId: string
) {
  return useApiMutation<
    AssignPermissionsRequest,
    Awaited<ReturnType<typeof updateOrganisationRolePermissions>>
  >(
    `mutation:update-role-permissions:${orgId}:${roleId}`,
    (body) => updateOrganisationRolePermissions(orgId, roleId, body),
    {
      invalidate: [
        queryKeys.roles(orgId),
        queryKeys.role(orgId, roleId),
      ],
    }
  );
}

export function useDeleteOrganisationRole(orgId: string, roleId: string) {
  return useApiMutation<void, void>(
    `mutation:delete-role:${orgId}:${roleId}`,
    () => deleteOrganisationRole(orgId, roleId),
    {
      invalidate: [
        queryKeys.roles(orgId),
        queryKeys.role(orgId, roleId),
      ],
    }
  );
}

export function useUpdateUserOrganisationRoles(userId: string) {
  return useApiMutation<
    AssignRolesRequest,
    Awaited<ReturnType<typeof updateUserOrganisationRoles>>
  >(
    `mutation:update-user-org-roles:${userId}`,
    (body) => updateUserOrganisationRoles(userId, body),
    { invalidate: [queryKeys.userOrganisationRoles(userId)] }
  );
}

export function useUpdateUserLocationRoles(
  userId: string,
  locationId: string
) {
  return useApiMutation<
    AssignRolesRequest,
    Awaited<ReturnType<typeof updateUserLocationRoles>>
  >(
    `mutation:update-user-location-roles:${userId}:${locationId}`,
    (body) => updateUserLocationRoles(userId, locationId, body),
    { invalidate: [queryKeys.userLocationRoles(userId, locationId)] }
  );
}
