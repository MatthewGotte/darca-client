"use client";

import useSWR from "swr";
import {
  assignAssetUser,
  createLocationAsset,
  deleteAssetAttachment,
  deleteLocationAsset,
  getLocationAsset,
  listAssetAttachments,
  listAssetStatuses,
  listAssetStatusHistory,
  listLocationAssets,
  replaceAssetCustomFields,
  replaceAssetIdentifiers,
  unassignAssetUser,
  updateLocationAsset,
  uploadAssetAttachment,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import { useOrgId } from "@/hooks/use-org-id";
import type {
  AssetCustomFieldValueRequest,
  AssetIdentifierRequest,
  AssetStatus,
  AssignAssetUserRequest,
  CreateAssetRequest,
  UpdateAssetRequest,
} from "@/lib/api/types";

function assetListInvalidation(locationId: string, orgId: string | undefined) {
  return [
    queryKeys.assetsList(locationId),
    ...(orgId ? [queryKeys.organisationAssetsList(orgId)] : []),
  ];
}

export function useLocationAssets(
  locationId: string | undefined,
  params?: { status?: AssetStatus; categoryId?: string }
) {
  return useSWR(
    locationId ? queryKeys.assets(locationId, params) : null,
    () => listLocationAssets(locationId!, params)
  );
}

export function useAsset(
  locationId: string | undefined,
  assetId: string | undefined
) {
  return useSWR(
    locationId && assetId ? queryKeys.asset(locationId, assetId) : null,
    () => getLocationAsset(locationId!, assetId!)
  );
}

export function useAssetStatuses() {
  return useSWR(queryKeys.assetStatuses(), listAssetStatuses);
}

export function useAssetStatusHistory(assetId: string | undefined) {
  return useSWR(
    assetId ? queryKeys.assetStatusHistory(assetId) : null,
    () => listAssetStatusHistory(assetId!)
  );
}

export function useAssetAttachments(assetId: string | undefined) {
  return useSWR(
    assetId ? queryKeys.assetAttachments(assetId) : null,
    () => listAssetAttachments(assetId!)
  );
}

export function useCreateAsset(locationId: string) {
  const orgId = useOrgId();
  return useApiMutation<
    CreateAssetRequest,
    Awaited<ReturnType<typeof createLocationAsset>>
  >(
    `mutation:create-asset:${locationId}`,
    (body) => createLocationAsset(locationId, body),
    { invalidate: assetListInvalidation(locationId, orgId) }
  );
}

export function useUpdateAsset(locationId: string, assetId: string) {
  const orgId = useOrgId();
  return useApiMutation<
    UpdateAssetRequest,
    Awaited<ReturnType<typeof updateLocationAsset>>
  >(
    `mutation:update-asset:${locationId}:${assetId}`,
    (body) => updateLocationAsset(locationId, assetId, body),
    {
      invalidate: [
        ...assetListInvalidation(locationId, orgId),
        queryKeys.asset(locationId, assetId),
        queryKeys.assetStatusHistory(assetId),
      ],
    }
  );
}

export function useDeleteAsset(locationId: string, assetId: string) {
  const orgId = useOrgId();
  return useApiMutation<void, void>(
    `mutation:delete-asset:${locationId}:${assetId}`,
    () => deleteLocationAsset(locationId, assetId),
    {
      invalidate: [
        ...assetListInvalidation(locationId, orgId),
        queryKeys.asset(locationId, assetId),
      ],
    }
  );
}

export function useReplaceAssetIdentifiers(assetId: string, locationId: string) {
  return useApiMutation<
    AssetIdentifierRequest,
    Awaited<ReturnType<typeof replaceAssetIdentifiers>>
  >(
    `mutation:replace-asset-identifiers:${assetId}`,
    (body) => replaceAssetIdentifiers(assetId, body),
    { invalidate: [queryKeys.asset(locationId, assetId)] }
  );
}

export function useReplaceAssetCustomFields(assetId: string, locationId: string) {
  return useApiMutation<
    AssetCustomFieldValueRequest,
    Awaited<ReturnType<typeof replaceAssetCustomFields>>
  >(
    `mutation:replace-asset-custom-fields:${assetId}`,
    (body) => replaceAssetCustomFields(assetId, body),
    { invalidate: [queryKeys.asset(locationId, assetId)] }
  );
}

export function useUploadAssetAttachment(assetId: string) {
  return useApiMutation<
    File | Blob,
    Awaited<ReturnType<typeof uploadAssetAttachment>>
  >(
    `mutation:upload-asset-attachment:${assetId}`,
    (file) => uploadAssetAttachment(assetId, file),
    { invalidate: [queryKeys.assetAttachments(assetId)] }
  );
}

export function useDeleteAssetAttachment(assetId: string, attachmentId: string) {
  return useApiMutation<void, void>(
    `mutation:delete-asset-attachment:${assetId}:${attachmentId}`,
    () => deleteAssetAttachment(assetId, attachmentId),
    { invalidate: [queryKeys.assetAttachments(assetId)] }
  );
}

export function useAssignAssetUser(assetId: string, locationId: string) {
  return useApiMutation<
    AssignAssetUserRequest,
    Awaited<ReturnType<typeof assignAssetUser>>
  >(
    `mutation:assign-asset-user:${assetId}`,
    (body) => assignAssetUser(assetId, body),
    { invalidate: [queryKeys.asset(locationId, assetId)] }
  );
}

export function useUnassignAssetUser(
  assetId: string,
  locationId: string,
  userId: string
) {
  return useApiMutation<void, void>(
    `mutation:unassign-asset-user:${assetId}:${userId}`,
    () => unassignAssetUser(assetId, userId),
    { invalidate: [queryKeys.asset(locationId, assetId)] }
  );
}
