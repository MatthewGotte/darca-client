export const PERMISSIONS = {
  ORGANISATION_READ: "organisation:read",
  ORGANISATION_UPDATE: "organisation:update",

  USER_READ: "user:read",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DECOMMISSION: "user:decommission",
  USER_ASSIGN_ROLES: "user:assign_roles",

  ROLE_READ: "role:read",
  ROLE_CREATE: "role:create",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_ASSIGN_PERMISSIONS: "role:assign_permissions",

  PERMISSION_READ: "permission:read",

  LOCATION_READ: "location:read",
  LOCATION_CREATE: "location:create",
  LOCATION_UPDATE: "location:update",
  LOCATION_DECOMMISSION: "location:decommission",

  LINE_READ: "line:read",
  LINE_CREATE: "line:create",
  LINE_UPDATE: "line:update",
  LINE_DECOMMISSION: "line:decommission",

  CATEGORY_READ: "category:read",
  CATEGORY_MANAGE: "category:manage",
  TYPE_READ: "type:read",
  TYPE_MANAGE: "type:manage",
  CUSTOM_FIELD_READ: "custom_field:read",
  CUSTOM_FIELD_MANAGE: "custom_field:manage",

  ASSET_READ: "asset:read",
  ASSET_CREATE: "asset:create",
  ASSET_UPDATE: "asset:update",
  ASSET_DECOMMISSION: "asset:decommission",
  ASSET_ASSIGN: "asset:assign",
  ASSET_IDENTIFIER_MANAGE: "asset_identifier:manage",
  ASSET_ATTACHMENT_READ: "asset_attachment:read",
  ASSET_ATTACHMENT_MANAGE: "asset_attachment:manage",

  COMPLIANCE_SCHEDULE_READ: "compliance_schedule:read",
  COMPLIANCE_SCHEDULE_CREATE: "compliance_schedule:create",
  COMPLIANCE_SCHEDULE_UPDATE: "compliance_schedule:update",
  COMPLIANCE_SCHEDULE_DECOMMISSION: "compliance_schedule:decommission",

  JOB_READ: "job:read",
  JOB_CREATE: "job:create",
  JOB_UPDATE: "job:update",
  JOB_ASSIGN: "job:assign",
  JOB_EXECUTE: "job:execute",
  JOB_RECORD_COMPLIANCE: "job:record_compliance",
  JOB_ARCHIVE: "job:archive",
  JOB_HISTORY_READ: "job_history:read",
} as const;

export type PermissionCode =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
