# DARCA UI Redesign Plan

Per-view UX critique and improvement plan. Goal: consistent patterns, clearer hierarchy, better multi-select and badge usage, and reduced admin/ops friction.

## Design system targets (apply everywhere)

| Pattern | Current state | Target |
|---------|---------------|--------|
| Empty states | Ant Table default; `EmptyState` unused | Contextual empty states with primary CTA |
| Create/edit | Mix of Modal and Drawer with no rules | Short forms → Modal; multi-section → Drawer via `EntityFormDrawer` |
| Filters | Inconsistent; only ops Assets uses URL state | URL-synced filters + search on all list pages |
| Status | Shared tags exist but inconsistently applied | Semantic colors everywhere; overdue/warning states unified |
| Multi-select | Plain Ant `Select mode="multiple"` | Searchable, tag-overflow, group labels, “select all in group” |
| Permission denied | Plain `<p>` in `Can` fallbacks | Reuse `PermissionDenied` mini variant |
| Tables | 6–9 columns, horizontal scroll | Responsive column tiers; optional row expand for detail |
| Badges/counts | Rare on tabs and nav | Tab badges for counts; stat chips on list rows |

---

## 1. Home — `/`

**File:** `app/(dashboard)/page.tsx`

**Critique:** Stat cards and shortcuts work but “My assigned jobs” and location list use plain secondary text for empty states. Admin tile gating is good; no refresh indicator after mutations from other pages.

**Redesign:**
- Replace empty job/location text with `EmptyState` + link to relevant create/list page.
- Add “last updated” subtle timestamp on stat cards (from SWR `dataUpdatedAt`).
- Highlight overdue jobs in the queue with `PriorityTag` + red due date (match ops Jobs page).
- Consider compact “Recent activity” feed (job started/completed) when API supports it.

---

## 2. Settings — `/settings`

**File:** `app/(dashboard)/settings/page.tsx`

**Critique:** Organisation card is a stub. Effective permissions show raw permission codes (`user:read`) not human labels. Settings appears in both header and sidebar.

**Redesign:**
- Merge org summary into a richer profile header (avatar placeholder, name, email, roles as colored chips).
- Map permission codes to display names from `usePermissions()` grouped list.
- Remove duplicate Settings nav entry (keep sidebar OR header gear, not both).
- Add “View as role” read-only preview for admins debugging access (future).

---

## 3. Organisation settings — `/settings/organisation`

**File:** `app/(dashboard)/settings/organisation/page.tsx`

**Critique:** Single-field edit in modal; minimal information scent.

**Redesign:**
- Inline edit for name (click-to-edit) or always-visible form section.
- Show member count, location count, created date in a summary grid.
- Fix same `destroyOnHidden` + `setFieldsValue` pattern as role edit (use `afterOpenChange`).

---

## 4. Users list — `/admin/users`

**File:** `app/(dashboard)/admin/users/page.tsx`

**Critique:** No search; decommissioned toggle buried in header; no row actions; table doesn’t refresh after create (fixed via SWR); password field on create lacks guidance; status tags only green/red.

**Redesign:**
- **Header:** Search by name/email; filter chips: Active | Decommissioned | All.
- **Table columns:** Name (link), Email, Roles (summary chips, max 2 + “+N”), Status badge, Last active (if API adds), Actions (⋯ menu: Edit, Set password, Decommission).
- **Create modal:** Two-step or sections — Account (email, name, password optional with “invite later” toggle); show validation hints.
- **Empty state:** “No users yet” + Create User CTA.
- **Post-create:** Optional toast with “View user” action linking to detail page.

---

## 5. User detail — `/admin/users/[userId]`

**File:** `app/(dashboard)/admin/users/[userId]/page.tsx`

**Critique:** Profile tab is fine; org roles tab is a bare multi-select + Save with no dirty-state indicator; location roles require picking one location at a time — worst admin UX in the app.

**Redesign — Profile tab:**
- Hero card: name, email, status badge, created/decommissioned dates, action bar.

**Redesign — Organisation Roles tab:**
- Replace multi-select with **role assignment cards**: each role as a checkbox row with name, description, permission count badge.
- Sticky footer: “Unsaved changes” banner + Save / Discard.
- Show effective permission delta preview when roles change (optional).

**Redesign — Location Roles tab (high priority):**
- **Location × Role matrix** or split panel:
  - Left: searchable location list with role-count badge per location.
  - Right: role multi-select (tag mode) for selected location.
- **Summary table** below: Location | Assigned roles | Edit — all assignments visible without clicking each location.
- Use `Select` with `optionFilterProp="label"`, `maxTagCount="responsive"`, custom tag render for role names.
- Empty: “No location roles assigned” + guidance copy.

---

## 6. Roles list — `/admin/roles`

**File:** `app/(dashboard)/admin/roles/page.tsx`

**Critique:** Permission count is a number; no system/custom filter; no search.

**Redesign:**
- Columns: Name (link), Type badge (System / Custom), Permission count (link to permissions section on detail), User count (if API supports), Description (truncated).
- Filters: All | System | Custom; search by name.
- System roles: lock icon + tooltip “System roles cannot be deleted”.
- Empty state with Create Role CTA.

---

## 7. Role detail — `/admin/roles/[roleId]`

**File:** `app/(dashboard)/admin/roles/[roleId]/page.tsx`

**Critique:** Long accordion of checkboxes; no search within permissions; no group select-all; Save button easy to miss; overlaps cognitively with `/admin/permissions`.

**Redesign:**
- **Permissions editor:**
  - Search box filtering permissions across groups.
  - Each group header: “Select all / Clear” + `(N/M selected)` badge.
  - Two-column layout on desktop; sticky Save bar when draft ≠ server.
- **Role header:** Name, system badge, description, user count.
- **Diff view:** After editing, show added/removed permissions summary before save (optional).
- Distinguish from permissions reference page: this page is **editable**; reference page is **read-only catalog** with links to roles that grant each permission.

---

## 8. Permissions reference — `/admin/permissions`

**File:** `app/(dashboard)/admin/permissions/page.tsx`

**Critique:** Duplicate of role permission UI without actions; accordion-only navigation; no search.

**Redesign:**
- Search + group filter at top.
- Expand all / collapse all.
- Each permission row: name, description, code in monospace secondary, “Used by N roles” link (when API available).
- Clear subtitle: “Reference only — edit permissions on Role detail”.

---

## 9. Locations list — `/locations`

**File:** `app/(dashboard)/locations/page.tsx`

**Critique:** Timezone is free text; no asset/job counts per location.

**Redesign:**
- Timezone: searchable `Select` with IANA zones or grouped regions.
- Columns: Name, Address, Timezone, Assets count, Active jobs (if API), Status.
- Card grid option on mobile instead of wide table.

---

## 10. Location detail — `/locations/[locationId]`

**File:** `app/(dashboard)/locations/[locationId]/page.tsx`

**Critique:** No summary card; jumps straight to Lines/Assets tabs; New Asset drawer is heavy; asset filters not URL-synced; loading skeleton outside page shell.

**Redesign:**
- **Summary header card:** Name, address, timezone, decommission status, Edit / Decommission actions (not buried in modal-only flow).
- **Tabs:** Assets (default if user has asset:read) | Lines — with tab badges for counts.
- **Assets tab:** URL-synced filters (status, category); slimmer columns with row expand for details.
- **New Asset:** Keep Drawer; use stepped sections (Identity → Classification → Location details → Financial).
- Fix loading to use `PageLoadingSkeleton` inside shell.

---

## 11. Asset detail — `/locations/.../assets/[assetId]`

**Files:** `app/.../page.tsx`, `components/locations/asset/tabs/*.tsx`

**Critique:** 8 tabs with no counts; Modal vs Drawer inconsistency; identifier enum labels raw; assign-user modals lack form labels; compliance uses `<a onClick>` not `Link`.

**Redesign:**
- **Page header:** Asset name, `AssetStatusTag`, `CriticalityTag`, location breadcrumb, primary actions (Edit, Decommission) always visible — not only on Overview tab.
- **Tabs:** Badge counts (attachments, open jobs, overdue compliance).
- **Consolidate tabs:** Consider grouping “Configuration” (identifiers + custom fields) and “Work” (jobs + compliance).
- **Identifiers drawer:** Human labels for enum values; vertical form layout; validation per row.
- **Assignments / job assign:** Proper `Form.Item` labels; user picker with avatar + email subtitle.
- Standardize: create = Modal (short), edit complex entity = Drawer.

---

## 12. Job detail — `/locations/.../jobs/[jobId]`

**File:** `app/(dashboard)/locations/.../jobs/[jobId]/page.tsx`

**Critique:** Best lifecycle UX in app (stepper); assign modal still bare Select; edit Drawer vs complete Modal inconsistency.

**Redesign:**
- Keep stepper as hero element.
- Assign user: searchable user select with role/location context in option label.
- Lifecycle actions as primary button group aligned with stepper state.
- History tab: timeline view instead of flat table (optional phase 2).

---

## 13. Compliance schedule detail

**File:** `app/(dashboard)/locations/.../compliance/[scheduleId]/page.tsx`

**Critique:** Isolated page; redirect after delete may not restore compliance tab.

**Redesign:**
- Ensure return navigation honors `?tab=compliance` on asset page.
- Show linked jobs generated from schedule (when API exists).
- Due date prominence with overdue styling matching ops Compliance dashboard.

---

## 14. Operations — Assets — `/operations/assets`

**File:** `app/(dashboard)/operations/assets/page.tsx`

**Critique:** 9-column table; horizontal scroll; no text search; good URL filter pattern (keep as template).

**Redesign:**
- Add name/identifier search (debounced, URL param `q`).
- Column priority: Name, Location, Status, Criticality, Updated — hide Category/Type/Line behind expand or column picker.
- Row click → asset detail; status/criticality use semantic tags consistently.
- Export CSV (phase 2).

---

## 15. Operations — Jobs — `/operations/jobs`

**File:** `app/(dashboard)/operations/jobs/page.tsx`

**Critique:** Filters not URL-synced; overdue styling coupled to status filter; no “My jobs” quick filter.

**Redesign:**
- Mirror Assets URL filter pattern (`useUrlFilter`).
- Quick filters: My jobs | Overdue | Due this week | All.
- Slimmer columns; Start action as icon button with confirm for non-assignees.
- Sync invalidation with home “My jobs” widget (SWR — done).

---

## 16. Operations — Compliance — `/operations/compliance`

**File:** `app/(dashboard)/operations/compliance/page.tsx`

**Critique:** Stat cards from unfiltered fetch can disagree with filtered table.

**Redesign:**
- Compute stats from same filtered dataset OR label cards “Organisation totals” vs “Filtered view”.
- URL-sync filters; search by asset name.
- Overdue rows: left border accent + badge (consistent with Jobs).

---

## 17. Reference data (Categories, Types, Custom fields)

**Files:** `app/(dashboard)/reference/**`

**Critique:** List pages consistent; detail pages mix `DataTable` and raw `Table`; category field management uses multi-select without search.

**Redesign:**
- Unify on `DataTable` everywhere.
- Custom field data type tags: consistent color map (string=blue, number=green, etc.).
- Category detail “Manage fields”: dual-list transfer UI (available ↔ assigned) instead of plain multi-select.

---

## 18. Shared overlays

| Overlay type | Issues | Target |
|--------------|--------|--------|
| Create Modals | No shared footer pattern | `EntityFormDrawer` / shared `FormModal` with `afterOpenChange` population |
| ConfirmDelete | Good | Add optional “type name to confirm” for destructive org-level deletes |
| Mobile nav Drawer | OK | — |

**Form modal fix (applied):** Never call `setFieldsValue` before modal open when using `destroyOnHidden`; use `afterOpenChange` or `initialValues`.

---

## Implementation phases

### Phase 1 — Foundations (1–2 sprints)
- Wire `EmptyState` on all list pages.
- URL-sync filters on Jobs + Compliance.
- User location roles matrix (biggest admin pain).
- Role permissions search + group select-all.
- Standardize form modal lifecycle (`afterOpenChange`).

### Phase 2 — Ops polish
- Ops table column reduction + search.
- Asset detail header + tab badges.
- Location detail summary card.
- Permission reference search + role links.

### Phase 3 — Delight
- Timeline views (job history).
- Export, saved views, column picker.
- Profile/org enrichment when APIs exist.

---

## Success metrics

- Zero manual page refreshes after mutations (SWR invalidation — addressed in `lib/api/swr.ts`).
- Admin can assign all location roles for a user in ≤3 clicks (vs N locations today).
- Ops user can find overdue compliance item in ≤10s from `/operations/compliance`.
- Consistent empty/error/loading patterns on every list page.
