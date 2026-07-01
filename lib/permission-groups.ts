import type { PermissionCode } from "@/lib/auth/permissions";

export type PermissionGroup = {
  domain: string;
  permissions: PermissionCode[];
};

const DOMAIN_LABELS: Record<string, string> = {
  organisation: "Organisation",
  user: "Users",
  role: "Roles",
  permission: "Permissions",
  location: "Locations",
  line: "Lines",
  category: "Categories",
  type: "Types",
  custom_field: "Custom Fields",
  asset: "Assets",
  asset_identifier: "Asset Identifiers",
  asset_attachment: "Asset Attachments",
  compliance_schedule: "Compliance Schedules",
  job: "Jobs",
  job_history: "Job History",
};

export function groupPermissionsByDomain(
  permissions: PermissionCode[]
): PermissionGroup[] {
  const groups = new Map<string, PermissionCode[]>();

  for (const permission of permissions) {
    const [domain] = permission.split(":");
    const key = domain ?? "other";
    const existing = groups.get(key) ?? [];
    existing.push(permission);
    groups.set(key, existing);
  }

  return Array.from(groups.entries())
    .map(([domain, perms]) => ({
      domain: DOMAIN_LABELS[domain] ?? domain,
      permissions: perms.sort(),
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain));
}
