import { api } from "./axios-config";
import type {
  AssetAssignmentResponse,
  AssetDetailResponse,
  AssetIdentifierRequest,
  AssetCustomFieldValueRequest,
  AssetStatus,
  AssetSummaryResponse,
  AssignAssetUserRequest,
  AssignCustomFieldsRequest,
  AssignJobUserRequest,
  AssignPermissionsRequest,
  AssignRolesRequest,
  AttachmentResponse,
  CategoryDetailResponse,
  CategoryResponse,
  CompleteJobRequest,
  ComplianceScheduleResponse,
  CreateAssetRequest,
  CreateCategoryRequest,
  CreateComplianceScheduleRequest,
  CreateCustomFieldRequest,
  CreateJobRequest,
  CreateLineRequest,
  CreateLocationRequest,
  CreateOrganisationRequest,
  CreateRoleRequest,
  CreateTypeRequest,
  CreateUserRequest,
  CustomFieldResponse,
  JobAssignmentResponse,
  JobDetailResponse,
  JobHistoryResponse,
  JobPriority,
  JobStatus,
  JobSummaryResponse,
  LineResponse,
  LocationResponse,
  OrganisationResponse,
  PermissionGroupResponse,
  RoleDetailResponse,
  RoleSummaryResponse,
  TypeResponse,
  UpdateAssetRequest,
  UpdateCategoryRequest,
  UpdateComplianceScheduleRequest,
  UpdateCustomFieldRequest,
  UpdateJobRequest,
  UpdateLineRequest,
  UpdateLocationRequest,
  UpdateOrganisationRequest,
  UpdateRoleRequest,
  UpdateTypeRequest,
  UpdateUserRequest,
  UserResponse,
  UserRoleAssignmentResponse,
} from "./types";

// Organisations

export async function createOrganisation(
  body: CreateOrganisationRequest
): Promise<OrganisationResponse> {
  const { data } = await api.post<OrganisationResponse>(
    "/organisations",
    body
  );
  return data;
}

export async function getOrganisation(
  id: string
): Promise<OrganisationResponse> {
  const { data } = await api.get<OrganisationResponse>(
    `/organisations/${id}`
  );
  return data;
}

export async function updateOrganisation(
  id: string,
  body: UpdateOrganisationRequest
): Promise<OrganisationResponse> {
  const { data } = await api.put<OrganisationResponse>(
    `/organisations/${id}`,
    body
  );
  return data;
}

// Users

export async function createOrganisationUser(
  organisationId: string,
  body: CreateUserRequest
): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>(
    `/organisations/${organisationId}/users`,
    body
  );
  return data;
}

export async function listOrganisationUsers(
  organisationId: string,
  params?: { includeDecommissioned?: boolean }
): Promise<UserResponse[]> {
  const { data } = await api.get<UserResponse[]>(
    `/organisations/${organisationId}/users`,
    { params }
  );
  return data;
}

export async function getOrganisationUser(
  organisationId: string,
  userId: string
): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>(
    `/organisations/${organisationId}/users/${userId}`
  );
  return data;
}

export async function updateOrganisationUser(
  organisationId: string,
  userId: string,
  body: UpdateUserRequest
): Promise<UserResponse> {
  const { data } = await api.put<UserResponse>(
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
  body: CreateLocationRequest
): Promise<LocationResponse> {
  const { data } = await api.post<LocationResponse>(
    `/organisations/${organisationId}/locations`,
    body
  );
  return data;
}

export async function listOrganisationLocations(
  organisationId: string
): Promise<LocationResponse[]> {
  const { data } = await api.get<LocationResponse[]>(
    `/organisations/${organisationId}/locations`
  );
  return data;
}

export async function getOrganisationLocation(
  organisationId: string,
  locationId: string
): Promise<LocationResponse> {
  const { data } = await api.get<LocationResponse>(
    `/organisations/${organisationId}/locations/${locationId}`
  );
  return data;
}

export async function updateOrganisationLocation(
  organisationId: string,
  locationId: string,
  body: UpdateLocationRequest
): Promise<LocationResponse> {
  const { data } = await api.put<LocationResponse>(
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
  body: CreateLineRequest
): Promise<LineResponse> {
  const { data } = await api.post<LineResponse>(
    `/locations/${locationId}/lines`,
    body
  );
  return data;
}

export async function listLocationLines(
  locationId: string
): Promise<LineResponse[]> {
  const { data } = await api.get<LineResponse[]>(
    `/locations/${locationId}/lines`
  );
  return data;
}

export async function getLocationLine(
  locationId: string,
  lineId: string
): Promise<LineResponse> {
  const { data } = await api.get<LineResponse>(
    `/locations/${locationId}/lines/${lineId}`
  );
  return data;
}

export async function updateLocationLine(
  locationId: string,
  lineId: string,
  body: UpdateLineRequest
): Promise<LineResponse> {
  const { data } = await api.put<LineResponse>(
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
  body: CreateAssetRequest
): Promise<AssetDetailResponse> {
  const { data } = await api.post<AssetDetailResponse>(
    `/locations/${locationId}/assets`,
    body
  );
  return data;
}

export async function listLocationAssets(
  locationId: string,
  params?: { status?: AssetStatus; categoryId?: string }
): Promise<AssetSummaryResponse[]> {
  const { data } = await api.get<AssetSummaryResponse[]>(
    `/locations/${locationId}/assets`,
    { params }
  );
  return data;
}

export async function getLocationAsset(
  locationId: string,
  assetId: string
): Promise<AssetDetailResponse> {
  const { data } = await api.get<AssetDetailResponse>(
    `/locations/${locationId}/assets/${assetId}`
  );
  return data;
}

export async function updateLocationAsset(
  locationId: string,
  assetId: string,
  body: UpdateAssetRequest
): Promise<AssetDetailResponse> {
  const { data } = await api.put<AssetDetailResponse>(
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
  body: AssetIdentifierRequest
): Promise<AssetDetailResponse> {
  const { data } = await api.put<AssetDetailResponse>(
    `/assets/${assetId}/identifiers`,
    body
  );
  return data;
}

export async function replaceAssetCustomFields(
  assetId: string,
  body: AssetCustomFieldValueRequest
): Promise<AssetDetailResponse> {
  const { data } = await api.put<AssetDetailResponse>(
    `/assets/${assetId}/custom-fields`,
    body
  );
  return data;
}

export async function uploadAssetAttachment(
  assetId: string,
  file: File | Blob
): Promise<AttachmentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<AttachmentResponse>(
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
): Promise<AttachmentResponse[]> {
  const { data } = await api.get<AttachmentResponse[]>(
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
  body: AssignAssetUserRequest
): Promise<AssetAssignmentResponse> {
  const { data } = await api.post<AssetAssignmentResponse>(
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
  body: CreateComplianceScheduleRequest
): Promise<ComplianceScheduleResponse> {
  const { data } = await api.post<ComplianceScheduleResponse>(
    `/assets/${assetId}/compliance-schedules`,
    body
  );
  return data;
}

export async function listAssetComplianceSchedules(
  assetId: string
): Promise<ComplianceScheduleResponse[]> {
  const { data } = await api.get<ComplianceScheduleResponse[]>(
    `/assets/${assetId}/compliance-schedules`
  );
  return data;
}

export async function getAssetComplianceSchedule(
  assetId: string,
  scheduleId: string
): Promise<ComplianceScheduleResponse> {
  const { data } = await api.get<ComplianceScheduleResponse>(
    `/assets/${assetId}/compliance-schedules/${scheduleId}`
  );
  return data;
}

export async function updateAssetComplianceSchedule(
  assetId: string,
  scheduleId: string,
  body: UpdateComplianceScheduleRequest
): Promise<ComplianceScheduleResponse> {
  const { data } = await api.put<ComplianceScheduleResponse>(
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
  body: CreateJobRequest
): Promise<JobDetailResponse> {
  const { data } = await api.post<JobDetailResponse>(
    `/assets/${assetId}/jobs`,
    body
  );
  return data;
}

export async function listAssetJobs(
  assetId: string,
  params?: { status?: JobStatus; priority?: JobPriority }
): Promise<JobSummaryResponse[]> {
  const { data } = await api.get<JobSummaryResponse[]>(
    `/assets/${assetId}/jobs`,
    { params }
  );
  return data;
}

export async function getJob(jobId: string): Promise<JobDetailResponse> {
  const { data } = await api.get<JobDetailResponse>(`/jobs/${jobId}`);
  return data;
}

export async function updateJob(
  jobId: string,
  body: UpdateJobRequest
): Promise<JobDetailResponse> {
  const { data } = await api.put<JobDetailResponse>(
    `/jobs/${jobId}`,
    body
  );
  return data;
}

export async function startJob(jobId: string): Promise<JobDetailResponse> {
  const { data } = await api.post<JobDetailResponse>(
    `/jobs/${jobId}/start`
  );
  return data;
}

export async function completeJob(
  jobId: string,
  body: CompleteJobRequest
): Promise<JobDetailResponse> {
  const { data } = await api.post<JobDetailResponse>(
    `/jobs/${jobId}/complete`,
    body
  );
  return data;
}

export async function archiveJob(jobId: string): Promise<JobDetailResponse> {
  const { data } = await api.post<JobDetailResponse>(
    `/jobs/${jobId}/archive`
  );
  return data;
}

export async function assignJobUser(
  jobId: string,
  body: AssignJobUserRequest
): Promise<JobAssignmentResponse> {
  const { data } = await api.post<JobAssignmentResponse>(
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
): Promise<JobHistoryResponse[]> {
  const { data } = await api.get<JobHistoryResponse[]>(
    `/jobs/${jobId}/history`
  );
  return data;
}

// Categories

export async function createCategory(
  body: CreateCategoryRequest
): Promise<CategoryDetailResponse> {
  const { data } = await api.post<CategoryDetailResponse>(
    "/categories",
    body
  );
  return data;
}

export async function listCategories(): Promise<CategoryResponse[]> {
  const { data } = await api.get<CategoryResponse[]>("/categories");
  return data;
}

export async function getCategory(
  id: string
): Promise<CategoryDetailResponse> {
  const { data } = await api.get<CategoryDetailResponse>(
    `/categories/${id}`
  );
  return data;
}

export async function updateCategory(
  id: string,
  body: UpdateCategoryRequest
): Promise<CategoryDetailResponse> {
  const { data } = await api.put<CategoryDetailResponse>(
    `/categories/${id}`,
    body
  );
  return data;
}

export async function updateCategoryCustomFields(
  id: string,
  body: AssignCustomFieldsRequest
): Promise<CategoryDetailResponse> {
  const { data } = await api.put<CategoryDetailResponse>(
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
  body: CreateTypeRequest
): Promise<TypeResponse> {
  const { data } = await api.post<TypeResponse>("/types", body);
  return data;
}

export async function listTypes(): Promise<TypeResponse[]> {
  const { data } = await api.get<TypeResponse[]>("/types");
  return data;
}

export async function getType(id: string): Promise<TypeResponse> {
  const { data } = await api.get<TypeResponse>(`/types/${id}`);
  return data;
}

export async function updateType(
  id: string,
  body: UpdateTypeRequest
): Promise<TypeResponse> {
  const { data } = await api.put<TypeResponse>(`/types/${id}`, body);
  return data;
}

export async function deleteType(id: string): Promise<void> {
  await api.delete(`/types/${id}`);
}

// Custom fields

export async function createCustomField(
  body: CreateCustomFieldRequest
): Promise<CustomFieldResponse> {
  const { data } = await api.post<CustomFieldResponse>(
    "/custom-fields",
    body
  );
  return data;
}

export async function listCustomFields(): Promise<CustomFieldResponse[]> {
  const { data } = await api.get<CustomFieldResponse[]>(
    "/custom-fields"
  );
  return data;
}

export async function getCustomField(
  id: string
): Promise<CustomFieldResponse> {
  const { data } = await api.get<CustomFieldResponse>(
    `/custom-fields/${id}`
  );
  return data;
}

export async function updateCustomField(
  id: string,
  body: UpdateCustomFieldRequest
): Promise<CustomFieldResponse> {
  const { data } = await api.put<CustomFieldResponse>(
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
  PermissionGroupResponse[]
> {
  const { data } = await api.get<PermissionGroupResponse[]>(
    "/permissions"
  );
  return data;
}

export async function listOrganisationRoles(
  organisationId: string
): Promise<RoleSummaryResponse[]> {
  const { data } = await api.get<RoleSummaryResponse[]>(
    `/organisations/${organisationId}/roles`
  );
  return data;
}

export async function createOrganisationRole(
  organisationId: string,
  body: CreateRoleRequest
): Promise<RoleDetailResponse> {
  const { data } = await api.post<RoleDetailResponse>(
    `/organisations/${organisationId}/roles`,
    body
  );
  return data;
}

export async function getOrganisationRole(
  organisationId: string,
  roleId: string
): Promise<RoleDetailResponse> {
  const { data } = await api.get<RoleDetailResponse>(
    `/organisations/${organisationId}/roles/${roleId}`
  );
  return data;
}

export async function updateOrganisationRole(
  organisationId: string,
  roleId: string,
  body: UpdateRoleRequest
): Promise<RoleDetailResponse> {
  const { data } = await api.put<RoleDetailResponse>(
    `/organisations/${organisationId}/roles/${roleId}`,
    body
  );
  return data;
}

export async function updateOrganisationRolePermissions(
  organisationId: string,
  roleId: string,
  body: AssignPermissionsRequest
): Promise<RoleDetailResponse> {
  const { data } = await api.put<RoleDetailResponse>(
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
  body: AssignRolesRequest
): Promise<UserRoleAssignmentResponse> {
  const { data } = await api.put<UserRoleAssignmentResponse>(
    `/users/${userId}/organisation-roles`,
    body
  );
  return data;
}

export async function updateUserLocationRoles(
  userId: string,
  locationId: string,
  body: AssignRolesRequest
): Promise<UserRoleAssignmentResponse> {
  const { data } = await api.put<UserRoleAssignmentResponse>(
    `/users/${userId}/locations/${locationId}/roles`,
    body
  );
  return data;
}
