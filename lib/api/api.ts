import { api } from "./axios-config";
import type {
  AssetStatus,
  JobPriority,
  JobStatus,
  Schema,
} from "./types";

// Organisations

export async function createOrganisation(
  body: Schema<"CreateOrganisationRequest">
): Promise<Schema<"OrganisationResponse">> {
  const { data } = await api.post<Schema<"OrganisationResponse">>(
    "/organisations",
    body
  );
  return data;
}

export async function getOrganisation(
  id: string
): Promise<Schema<"OrganisationResponse">> {
  const { data } = await api.get<Schema<"OrganisationResponse">>(
    `/organisations/${id}`
  );
  return data;
}

export async function updateOrganisation(
  id: string,
  body: Schema<"UpdateOrganisationRequest">
): Promise<Schema<"OrganisationResponse">> {
  const { data } = await api.put<Schema<"OrganisationResponse">>(
    `/organisations/${id}`,
    body
  );
  return data;
}

// Users

export async function createOrganisationUser(
  organisationId: string,
  body: Schema<"CreateUserRequest">
): Promise<Schema<"UserResponse">> {
  const { data } = await api.post<Schema<"UserResponse">>(
    `/organisations/${organisationId}/users`,
    body
  );
  return data;
}

export async function listOrganisationUsers(
  organisationId: string,
  params?: { includeDecommissioned?: boolean }
): Promise<Schema<"UserResponse">[]> {
  const { data } = await api.get<Schema<"UserResponse">[]>(
    `/organisations/${organisationId}/users`,
    { params }
  );
  return data;
}

export async function getOrganisationUser(
  organisationId: string,
  userId: string
): Promise<Schema<"UserResponse">> {
  const { data } = await api.get<Schema<"UserResponse">>(
    `/organisations/${organisationId}/users/${userId}`
  );
  return data;
}

export async function updateOrganisationUser(
  organisationId: string,
  userId: string,
  body: Schema<"UpdateUserRequest">
): Promise<Schema<"UserResponse">> {
  const { data } = await api.put<Schema<"UserResponse">>(
    `/organisations/${organisationId}/users/${userId}`,
    body
  );
  return data;
}

export async function deleteOrganisationUser(
  organisationId: string,
  userId: string
): Promise<void> {
  await api.delete(`/organisations/${organisationId}/users/${userId}`);
}

// Locations

export async function createOrganisationLocation(
  organisationId: string,
  body: Schema<"CreateLocationRequest">
): Promise<Schema<"LocationResponse">> {
  const { data } = await api.post<Schema<"LocationResponse">>(
    `/organisations/${organisationId}/locations`,
    body
  );
  return data;
}

export async function listOrganisationLocations(
  organisationId: string
): Promise<Schema<"LocationResponse">[]> {
  const { data } = await api.get<Schema<"LocationResponse">[]>(
    `/organisations/${organisationId}/locations`
  );
  return data;
}

export async function getOrganisationLocation(
  organisationId: string,
  locationId: string
): Promise<Schema<"LocationResponse">> {
  const { data } = await api.get<Schema<"LocationResponse">>(
    `/organisations/${organisationId}/locations/${locationId}`
  );
  return data;
}

export async function updateOrganisationLocation(
  organisationId: string,
  locationId: string,
  body: Schema<"UpdateLocationRequest">
): Promise<Schema<"LocationResponse">> {
  const { data } = await api.put<Schema<"LocationResponse">>(
    `/organisations/${organisationId}/locations/${locationId}`,
    body
  );
  return data;
}

export async function deleteOrganisationLocation(
  organisationId: string,
  locationId: string
): Promise<void> {
  await api.delete(
    `/organisations/${organisationId}/locations/${locationId}`
  );
}

// Lines

export async function createLocationLine(
  locationId: string,
  body: Schema<"CreateLineRequest">
): Promise<Schema<"LineResponse">> {
  const { data } = await api.post<Schema<"LineResponse">>(
    `/locations/${locationId}/lines`,
    body
  );
  return data;
}

export async function listLocationLines(
  locationId: string
): Promise<Schema<"LineResponse">[]> {
  const { data } = await api.get<Schema<"LineResponse">[]>(
    `/locations/${locationId}/lines`
  );
  return data;
}

export async function getLocationLine(
  locationId: string,
  lineId: string
): Promise<Schema<"LineResponse">> {
  const { data } = await api.get<Schema<"LineResponse">>(
    `/locations/${locationId}/lines/${lineId}`
  );
  return data;
}

export async function updateLocationLine(
  locationId: string,
  lineId: string,
  body: Schema<"UpdateLineRequest">
): Promise<Schema<"LineResponse">> {
  const { data } = await api.put<Schema<"LineResponse">>(
    `/locations/${locationId}/lines/${lineId}`,
    body
  );
  return data;
}

export async function deleteLocationLine(
  locationId: string,
  lineId: string
): Promise<void> {
  await api.delete(`/locations/${locationId}/lines/${lineId}`);
}

// Assets

export async function createLocationAsset(
  locationId: string,
  body: Schema<"CreateAssetRequest">
): Promise<Schema<"AssetDetailResponse">> {
  const { data } = await api.post<Schema<"AssetDetailResponse">>(
    `/locations/${locationId}/assets`,
    body
  );
  return data;
}

export async function listLocationAssets(
  locationId: string,
  params?: { status?: AssetStatus; categoryId?: string }
): Promise<Schema<"AssetSummaryResponse">[]> {
  const { data } = await api.get<Schema<"AssetSummaryResponse">[]>(
    `/locations/${locationId}/assets`,
    { params }
  );
  return data;
}

export async function getLocationAsset(
  locationId: string,
  assetId: string
): Promise<Schema<"AssetDetailResponse">> {
  const { data } = await api.get<Schema<"AssetDetailResponse">>(
    `/locations/${locationId}/assets/${assetId}`
  );
  return data;
}

export async function updateLocationAsset(
  locationId: string,
  assetId: string,
  body: Schema<"UpdateAssetRequest">
): Promise<Schema<"AssetDetailResponse">> {
  const { data } = await api.put<Schema<"AssetDetailResponse">>(
    `/locations/${locationId}/assets/${assetId}`,
    body
  );
  return data;
}

export async function deleteLocationAsset(
  locationId: string,
  assetId: string
): Promise<void> {
  await api.delete(`/locations/${locationId}/assets/${assetId}`);
}

export async function replaceAssetIdentifiers(
  assetId: string,
  body: Schema<"AssetIdentifierRequest">
): Promise<Schema<"AssetDetailResponse">> {
  const { data } = await api.put<Schema<"AssetDetailResponse">>(
    `/assets/${assetId}/identifiers`,
    body
  );
  return data;
}

export async function replaceAssetCustomFields(
  assetId: string,
  body: Schema<"AssetCustomFieldValueRequest">
): Promise<Schema<"AssetDetailResponse">> {
  const { data } = await api.put<Schema<"AssetDetailResponse">>(
    `/assets/${assetId}/custom-fields`,
    body
  );
  return data;
}

export async function uploadAssetAttachment(
  assetId: string,
  file: File | Blob
): Promise<Schema<"AttachmentResponse">> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<Schema<"AttachmentResponse">>(
    `/assets/${assetId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

export async function listAssetAttachments(
  assetId: string
): Promise<Schema<"AttachmentResponse">[]> {
  const { data } = await api.get<Schema<"AttachmentResponse">[]>(
    `/assets/${assetId}/attachments`
  );
  return data;
}

export async function deleteAssetAttachment(
  assetId: string,
  attachmentId: string
): Promise<void> {
  await api.delete(`/assets/${assetId}/attachments/${attachmentId}`);
}

export async function assignAssetUser(
  assetId: string,
  body: Schema<"AssignAssetUserRequest">
): Promise<Schema<"AssetAssignmentResponse">> {
  const { data } = await api.post<Schema<"AssetAssignmentResponse">>(
    `/assets/${assetId}/assignments`,
    body
  );
  return data;
}

export async function unassignAssetUser(
  assetId: string,
  userId: string
): Promise<void> {
  await api.delete(`/assets/${assetId}/assignments/${userId}`);
}

// Compliance schedules

export async function createAssetComplianceSchedule(
  assetId: string,
  body: Schema<"CreateComplianceScheduleRequest">
): Promise<Schema<"ComplianceScheduleResponse">> {
  const { data } = await api.post<Schema<"ComplianceScheduleResponse">>(
    `/assets/${assetId}/compliance-schedules`,
    body
  );
  return data;
}

export async function listAssetComplianceSchedules(
  assetId: string
): Promise<Schema<"ComplianceScheduleResponse">[]> {
  const { data } = await api.get<Schema<"ComplianceScheduleResponse">[]>(
    `/assets/${assetId}/compliance-schedules`
  );
  return data;
}

export async function getAssetComplianceSchedule(
  assetId: string,
  scheduleId: string
): Promise<Schema<"ComplianceScheduleResponse">> {
  const { data } = await api.get<Schema<"ComplianceScheduleResponse">>(
    `/assets/${assetId}/compliance-schedules/${scheduleId}`
  );
  return data;
}

export async function updateAssetComplianceSchedule(
  assetId: string,
  scheduleId: string,
  body: Schema<"UpdateComplianceScheduleRequest">
): Promise<Schema<"ComplianceScheduleResponse">> {
  const { data } = await api.put<Schema<"ComplianceScheduleResponse">>(
    `/assets/${assetId}/compliance-schedules/${scheduleId}`,
    body
  );
  return data;
}

export async function deleteAssetComplianceSchedule(
  assetId: string,
  scheduleId: string
): Promise<void> {
  await api.delete(`/assets/${assetId}/compliance-schedules/${scheduleId}`);
}

// Jobs

export async function createAssetJob(
  assetId: string,
  body: Schema<"CreateJobRequest">
): Promise<Schema<"JobDetailResponse">> {
  const { data } = await api.post<Schema<"JobDetailResponse">>(
    `/assets/${assetId}/jobs`,
    body
  );
  return data;
}

export async function listAssetJobs(
  assetId: string,
  params?: { status?: JobStatus; priority?: JobPriority }
): Promise<Schema<"JobSummaryResponse">[]> {
  const { data } = await api.get<Schema<"JobSummaryResponse">[]>(
    `/assets/${assetId}/jobs`,
    { params }
  );
  return data;
}

export async function getJob(jobId: string): Promise<Schema<"JobDetailResponse">> {
  const { data } = await api.get<Schema<"JobDetailResponse">>(`/jobs/${jobId}`);
  return data;
}

export async function updateJob(
  jobId: string,
  body: Schema<"UpdateJobRequest">
): Promise<Schema<"JobDetailResponse">> {
  const { data } = await api.put<Schema<"JobDetailResponse">>(
    `/jobs/${jobId}`,
    body
  );
  return data;
}

export async function startJob(jobId: string): Promise<Schema<"JobDetailResponse">> {
  const { data } = await api.post<Schema<"JobDetailResponse">>(
    `/jobs/${jobId}/start`
  );
  return data;
}

export async function completeJob(
  jobId: string,
  body: Schema<"CompleteJobRequest">
): Promise<Schema<"JobDetailResponse">> {
  const { data } = await api.post<Schema<"JobDetailResponse">>(
    `/jobs/${jobId}/complete`,
    body
  );
  return data;
}

export async function archiveJob(jobId: string): Promise<Schema<"JobDetailResponse">> {
  const { data } = await api.post<Schema<"JobDetailResponse">>(
    `/jobs/${jobId}/archive`
  );
  return data;
}

export async function assignJobUser(
  jobId: string,
  body: Schema<"AssignJobUserRequest">
): Promise<Schema<"JobAssignmentResponse">> {
  const { data } = await api.post<Schema<"JobAssignmentResponse">>(
    `/jobs/${jobId}/assignments`,
    body
  );
  return data;
}

export async function unassignJobUser(
  jobId: string,
  userId: string
): Promise<void> {
  await api.delete(`/jobs/${jobId}/assignments/${userId}`);
}

export async function getJobHistory(
  jobId: string
): Promise<Schema<"JobHistoryResponse">[]> {
  const { data } = await api.get<Schema<"JobHistoryResponse">[]>(
    `/jobs/${jobId}/history`
  );
  return data;
}

// Categories

export async function createCategory(
  body: Schema<"CreateCategoryRequest">
): Promise<Schema<"CategoryDetailResponse">> {
  const { data } = await api.post<Schema<"CategoryDetailResponse">>(
    "/categories",
    body
  );
  return data;
}

export async function listCategories(): Promise<Schema<"CategoryResponse">[]> {
  const { data } = await api.get<Schema<"CategoryResponse">[]>("/categories");
  return data;
}

export async function getCategory(
  id: string
): Promise<Schema<"CategoryDetailResponse">> {
  const { data } = await api.get<Schema<"CategoryDetailResponse">>(
    `/categories/${id}`
  );
  return data;
}

export async function updateCategory(
  id: string,
  body: Schema<"UpdateCategoryRequest">
): Promise<Schema<"CategoryDetailResponse">> {
  const { data } = await api.put<Schema<"CategoryDetailResponse">>(
    `/categories/${id}`,
    body
  );
  return data;
}

export async function updateCategoryCustomFields(
  id: string,
  body: Schema<"AssignCustomFieldsRequest">
): Promise<Schema<"CategoryDetailResponse">> {
  const { data } = await api.put<Schema<"CategoryDetailResponse">>(
    `/categories/${id}/custom-fields`,
    body
  );
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}

// Types

export async function createType(
  body: Schema<"CreateTypeRequest">
): Promise<Schema<"TypeResponse">> {
  const { data } = await api.post<Schema<"TypeResponse">>("/types", body);
  return data;
}

export async function listTypes(): Promise<Schema<"TypeResponse">[]> {
  const { data } = await api.get<Schema<"TypeResponse">[]>("/types");
  return data;
}

export async function getType(id: string): Promise<Schema<"TypeResponse">> {
  const { data } = await api.get<Schema<"TypeResponse">>(`/types/${id}`);
  return data;
}

export async function updateType(
  id: string,
  body: Schema<"UpdateTypeRequest">
): Promise<Schema<"TypeResponse">> {
  const { data } = await api.put<Schema<"TypeResponse">>(`/types/${id}`, body);
  return data;
}

export async function deleteType(id: string): Promise<void> {
  await api.delete(`/types/${id}`);
}

// Custom fields

export async function createCustomField(
  body: Schema<"CreateCustomFieldRequest">
): Promise<Schema<"CustomFieldResponse">> {
  const { data } = await api.post<Schema<"CustomFieldResponse">>(
    "/custom-fields",
    body
  );
  return data;
}

export async function listCustomFields(): Promise<Schema<"CustomFieldResponse">[]> {
  const { data } = await api.get<Schema<"CustomFieldResponse">[]>(
    "/custom-fields"
  );
  return data;
}

export async function getCustomField(
  id: string
): Promise<Schema<"CustomFieldResponse">> {
  const { data } = await api.get<Schema<"CustomFieldResponse">>(
    `/custom-fields/${id}`
  );
  return data;
}

export async function updateCustomField(
  id: string,
  body: Schema<"UpdateCustomFieldRequest">
): Promise<Schema<"CustomFieldResponse">> {
  const { data } = await api.put<Schema<"CustomFieldResponse">>(
    `/custom-fields/${id}`,
    body
  );
  return data;
}

export async function deleteCustomField(id: string): Promise<void> {
  await api.delete(`/custom-fields/${id}`);
}

// RBAC

export async function listPermissions(): Promise<
  Schema<"PermissionGroupResponse">[]
> {
  const { data } = await api.get<Schema<"PermissionGroupResponse">[]>(
    "/permissions"
  );
  return data;
}

export async function listOrganisationRoles(
  organisationId: string
): Promise<Schema<"RoleSummaryResponse">[]> {
  const { data } = await api.get<Schema<"RoleSummaryResponse">[]>(
    `/organisations/${organisationId}/roles`
  );
  return data;
}

export async function createOrganisationRole(
  organisationId: string,
  body: Schema<"CreateRoleRequest">
): Promise<Schema<"RoleDetailResponse">> {
  const { data } = await api.post<Schema<"RoleDetailResponse">>(
    `/organisations/${organisationId}/roles`,
    body
  );
  return data;
}

export async function getOrganisationRole(
  organisationId: string,
  roleId: string
): Promise<Schema<"RoleDetailResponse">> {
  const { data } = await api.get<Schema<"RoleDetailResponse">>(
    `/organisations/${organisationId}/roles/${roleId}`
  );
  return data;
}

export async function updateOrganisationRole(
  organisationId: string,
  roleId: string,
  body: Schema<"UpdateRoleRequest">
): Promise<Schema<"RoleDetailResponse">> {
  const { data } = await api.put<Schema<"RoleDetailResponse">>(
    `/organisations/${organisationId}/roles/${roleId}`,
    body
  );
  return data;
}

export async function updateOrganisationRolePermissions(
  organisationId: string,
  roleId: string,
  body: Schema<"AssignPermissionsRequest">
): Promise<Schema<"RoleDetailResponse">> {
  const { data } = await api.put<Schema<"RoleDetailResponse">>(
    `/organisations/${organisationId}/roles/${roleId}/permissions`,
    body
  );
  return data;
}

export async function deleteOrganisationRole(
  organisationId: string,
  roleId: string
): Promise<void> {
  await api.delete(`/organisations/${organisationId}/roles/${roleId}`);
}

export async function updateUserOrganisationRoles(
  userId: string,
  body: Schema<"AssignRolesRequest">
): Promise<Schema<"UserRoleAssignmentResponse">> {
  const { data } = await api.put<Schema<"UserRoleAssignmentResponse">>(
    `/users/${userId}/organisation-roles`,
    body
  );
  return data;
}

export async function updateUserLocationRoles(
  userId: string,
  locationId: string,
  body: Schema<"AssignRolesRequest">
): Promise<Schema<"UserRoleAssignmentResponse">> {
  const { data } = await api.put<Schema<"UserRoleAssignmentResponse">>(
    `/users/${userId}/locations/${locationId}/roles`,
    body
  );
  return data;
}
