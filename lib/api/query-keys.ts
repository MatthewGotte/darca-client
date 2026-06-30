export const queryKeys = {
  me: () => ["me"] as const,

  organisation: (id: string) => ["organisation", id] as const,

  users: (orgId: string, params?: object) =>
    ["organisation", orgId, "users", params ?? {}] as const,
  user: (orgId: string, userId: string) =>
    ["organisation", orgId, "user", userId] as const,

  locations: (orgId: string) => ["organisation", orgId, "locations"] as const,
  location: (orgId: string, locationId: string) =>
    ["organisation", orgId, "location", locationId] as const,

  lines: (locationId: string) => ["location", locationId, "lines"] as const,
  line: (locationId: string, lineId: string) =>
    ["location", locationId, "line", lineId] as const,

  assets: (locationId: string, params?: object) =>
    ["location", locationId, "assets", params ?? {}] as const,
  organisationAssets: (orgId: string, params?: object) =>
    ["organisation", orgId, "assets", params ?? {}] as const,
  asset: (locationId: string, assetId: string) =>
    ["location", locationId, "asset", assetId] as const,
  assetStatuses: () => ["asset-statuses"] as const,
  assetStatusHistory: (assetId: string) =>
    ["asset", assetId, "status-history"] as const,
  assetAttachments: (assetId: string) =>
    ["asset", assetId, "attachments"] as const,

  complianceSchedules: (assetId: string) =>
    ["asset", assetId, "compliance-schedules"] as const,
  complianceSchedule: (assetId: string, scheduleId: string) =>
    ["asset", assetId, "compliance-schedule", scheduleId] as const,

  jobs: (assetId: string, params?: object) =>
    ["asset", assetId, "jobs", params ?? {}] as const,
  organisationJobs: (orgId: string, params?: object) =>
    ["organisation", orgId, "jobs", params ?? {}] as const,
  job: (jobId: string) => ["job", jobId] as const,
  jobHistory: (jobId: string) => ["job", jobId, "history"] as const,

  categories: () => ["categories"] as const,
  category: (id: string) => ["category", id] as const,

  types: () => ["types"] as const,
  type: (id: string) => ["type", id] as const,

  customFields: () => ["custom-fields"] as const,
  customField: (id: string) => ["custom-field", id] as const,

  permissions: () => ["permissions"] as const,
  roles: (orgId: string) => ["organisation", orgId, "roles"] as const,
  role: (orgId: string, roleId: string) =>
    ["organisation", orgId, "role", roleId] as const,
  userOrganisationRoles: (userId: string) =>
    ["user", userId, "organisation-roles"] as const,
  userLocationRoles: (userId: string, locationId: string) =>
    ["user", userId, "location", locationId, "roles"] as const,
};
