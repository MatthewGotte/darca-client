# DARCA Permission QA Matrix

Manual verification checklist for RBAC across the POC UI.

## Roles to test

Use seeded users from `darca-service/scripts/starter.sql`:

- **ORG_ADMIN** — full org access
- **LOCATION_MANAGER** — location-scoped operations
- **TECHNICIAN** — limited job/asset execution
- **VIEWER** — read-only subsets

## Layer 1: Navigation

| Check | Expected |
|-------|----------|
| Home visible | All authenticated users |
| Settings in sidebar | All authenticated users |
| Admin section | Any of `user:read`, `role:read`, `permission:read` |
| Operations children | Per `location:read`, `asset:read`, `job:read`, `compliance_schedule:read` |
| Reference section | Per `category:read`, `type:read`, `custom_field:read` |

## Layer 2: Route guards

Direct-navigate without permission → expect `PermissionDenied`:

- `/admin/users`, `/admin/roles`, `/admin/permissions`
- `/reference/categories`, `/reference/types`, `/reference/custom-fields`
- `/locations`, `/operations/assets`, `/operations/jobs`, `/operations/compliance`
- `/settings/organisation` (`organisation:read`)

## Layer 3: Action gates

| Page | Action | Permission |
|------|--------|------------|
| Users list | Create user | `user:create` |
| User detail | Set password | `user:update` |
| User detail | Assign roles | `user:assign_roles` |
| Roles detail | Permission matrix save | `role:assign_permissions` |
| Location detail | New line / asset | `line:create` / `asset:create` |
| Asset overview | Edit / decommission | `asset:update` / `asset:decommission` |
| Asset identifiers | Manage | `asset_identifier:manage` |
| Asset attachments | Upload / delete | `asset_attachment:manage` |
| Job detail | Start / Complete / Archive | `job:execute` / `job:record_compliance` / `job:archive` |

## Layer 4: Tab visibility

| Page | Tab | Permission |
|------|-----|------------|
| Location detail | Lines / Assets | `line:read` / `asset:read` |
| Asset detail | Attachments / Compliance / Jobs | `asset_attachment:read` / `compliance_schedule:read` / `job:read` |

## Automated smoke

```bash
cd darca-service && ./mvnw test
cd darca-client && npm run build
```
