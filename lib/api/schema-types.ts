import type { components } from "./generated/schema";

// Auth

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type ChangePasswordRequest =
  components["schemas"]["ChangePasswordRequest"];

export type RequestPasswordResetRequest = {
  email: string;
};

export type ValidateResetTokenRequest = {
  token: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ValidateResetTokenResponse = {
  valid: boolean;
};

export type SetPasswordRequest = components["schemas"]["SetPasswordRequest"];

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type MeResponse = {
  id: string;
  organisationId: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
};

// Organisations

export type UpdateOrganisationRequest =
  components["schemas"]["UpdateOrganisationRequest"];
export type OrganisationResponse =
  components["schemas"]["OrganisationResponse"];

// Users

export type CreateUserRequest = components["schemas"]["CreateUserRequest"];
export type UpdateUserRequest = components["schemas"]["UpdateUserRequest"];
export type UserResponse = components["schemas"]["UserResponse"];

// Locations

export type CreateLocationRequest =
  components["schemas"]["CreateLocationRequest"];
export type UpdateLocationRequest =
  components["schemas"]["UpdateLocationRequest"];
export type LocationResponse = components["schemas"]["LocationResponse"];

// Lines

export type CreateLineRequest = components["schemas"]["CreateLineRequest"];
export type UpdateLineRequest = components["schemas"]["UpdateLineRequest"];
export type LineResponse = components["schemas"]["LineResponse"];

// Assets

export type CreateAssetRequest = components["schemas"]["CreateAssetRequest"];
export type UpdateAssetRequest = components["schemas"]["UpdateAssetRequest"];
export type AssetSummaryResponse =
  components["schemas"]["AssetSummaryResponse"];
export type AssetDetailResponse = components["schemas"]["AssetDetailResponse"];
export type AssetIdentifierRequest =
  components["schemas"]["AssetIdentifierRequest"];
export type AssetIdentifierResponse =
  components["schemas"]["AssetIdentifierResponse"];
export type IdentifierEntry = components["schemas"]["IdentifierEntry"];
export type AssetCustomFieldValueRequest =
  components["schemas"]["AssetCustomFieldValueRequest"];
export type AssetCustomFieldValueResponse =
  components["schemas"]["AssetCustomFieldValueResponse"];
export type FieldValue = components["schemas"]["FieldValue"];
export type AssetAssignmentResponse =
  components["schemas"]["AssetAssignmentResponse"];
export type AssignAssetUserRequest =
  components["schemas"]["AssignAssetUserRequest"];
export type AttachmentResponse = components["schemas"]["AttachmentResponse"];
export type AssetStatusResponse = components["schemas"]["AssetStatusResponse"];
export type AssetStatusHistoryResponse =
  components["schemas"]["AssetStatusHistoryResponse"];

export type AssetStatus =
  NonNullable<components["schemas"]["AssetSummaryResponse"]["status"]>;

// Compliance schedules

export type CreateComplianceScheduleRequest =
  components["schemas"]["CreateComplianceScheduleRequest"];
export type UpdateComplianceScheduleRequest =
  components["schemas"]["UpdateComplianceScheduleRequest"];
export type ComplianceScheduleResponse =
  components["schemas"]["ComplianceScheduleResponse"];

// Jobs

export type CreateJobRequest = components["schemas"]["CreateJobRequest"];
export type UpdateJobRequest = components["schemas"]["UpdateJobRequest"];
export type CompleteJobRequest = components["schemas"]["CompleteJobRequest"];
export type JobSummaryResponse = components["schemas"]["JobSummaryResponse"];
export type JobDetailResponse = components["schemas"]["JobDetailResponse"];
export type JobAssignmentResponse =
  components["schemas"]["JobAssignmentResponse"];
export type AssignJobUserRequest =
  components["schemas"]["AssignJobUserRequest"];
export type JobHistoryResponse = components["schemas"]["JobHistoryResponse"];

export type JobStatus =
  NonNullable<components["schemas"]["JobSummaryResponse"]["status"]>;
export type JobPriority =
  NonNullable<components["schemas"]["JobSummaryResponse"]["priority"]>;

// Categories

export type CreateCategoryRequest =
  components["schemas"]["CreateCategoryRequest"];
export type UpdateCategoryRequest =
  components["schemas"]["UpdateCategoryRequest"];
export type CategoryResponse = components["schemas"]["CategoryResponse"];
export type CategoryDetailResponse =
  components["schemas"]["CategoryDetailResponse"];
export type AssignCustomFieldsRequest =
  components["schemas"]["AssignCustomFieldsRequest"];

// Types

export type CreateTypeRequest = components["schemas"]["CreateTypeRequest"];
export type UpdateTypeRequest = components["schemas"]["UpdateTypeRequest"];
export type TypeResponse = components["schemas"]["TypeResponse"];

// Custom fields

export type CreateCustomFieldRequest =
  components["schemas"]["CreateCustomFieldRequest"];
export type UpdateCustomFieldRequest =
  components["schemas"]["UpdateCustomFieldRequest"];
export type CustomFieldResponse = components["schemas"]["CustomFieldResponse"];

// RBAC

export type PermissionResponse = components["schemas"]["PermissionResponse"];
export type PermissionGroupResponse =
  components["schemas"]["PermissionGroupResponse"];
export type CreateRoleRequest = components["schemas"]["CreateRoleRequest"];
export type UpdateRoleRequest = components["schemas"]["UpdateRoleRequest"];
export type RoleSummaryResponse = components["schemas"]["RoleSummaryResponse"];
export type RoleDetailResponse = components["schemas"]["RoleDetailResponse"];
export type AssignPermissionsRequest =
  components["schemas"]["AssignPermissionsRequest"];
export type AssignRolesRequest = components["schemas"]["AssignRolesRequest"];
export type UserRoleAssignmentResponse =
  components["schemas"]["UserRoleAssignmentResponse"];
