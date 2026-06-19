"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import SearchIcon from "@mui/icons-material/Search";
import useSWR from "swr";
import AddEquipmentWizard from "@/components/assets/add-equipment-wizard";
import AssetCard from "@/components/assets/asset-card";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import SyncLocationFromPath from "@/components/layout/sync-location-from-path";
import AddPersonWizard from "@/components/users/add-person-wizard";
import {
  getOrganisationLocation,
  listCategories,
  listLocationAssets,
  listOrganisationLocations,
} from "@/lib/api/api";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import type { AssetStatus } from "@/lib/api/types";
import { locationPath } from "@/lib/routes";

const PAGE_SIZE = 9;

const STATUSES: AssetStatus[] = [
  "OPERATIONAL",
  "UNDER_MAINTENANCE",
  "INACTIVE",
  "DECOMMISSIONED",
];

function needsAttentionStatus(status?: AssetStatus) {
  return status === "UNDER_MAINTENANCE" || status === "INACTIVE";
}

function EquipmentDashboardContent({
  orgId,
  locationId,
}: {
  orgId: string;
  locationId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);

  const status = (searchParams.get("status") as AssetStatus | null) ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const apiFilters = useMemo(() => ({ status, categoryId }), [status, categoryId]);

  const { data: assets, error, isLoading, mutate } = useSWR(
    ["location-assets", locationId, apiFilters],
    () => listLocationAssets(locationId, apiFilters)
  );

  const { data: location } = useSWR(
    ["organisation-location", orgId, locationId],
    () => getOrganisationLocation(orgId, locationId)
  );

  const { data: categories } = useSWR("categories", listCategories);
  const { data: locations } = useSWR(
    ["organisation-locations", orgId],
    () => listOrganisationLocations(orgId)
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assets ?? [];
    return (assets ?? []).filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.typeName?.toLowerCase().includes(q) ||
        a.categoryName?.toLowerCase().includes(q) ||
        a.modelNumber?.toLowerCase().includes(q) ||
        a.lineName?.toLowerCase().includes(q)
    );
  }, [assets, search]);

  const total = filtered.length;
  const operational = filtered.filter((a) => a.status === "OPERATIONAL").length;
  const needsAttention = filtered.filter((a) => needsAttentionStatus(a.status)).length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageAssets = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
    setPage(1);
  }

  function exportCsv() {
    const rows = [
      ["Name", "Type", "Category", "Status", "Line", "Model", "ID"],
      ...filtered.map((a) => [
        a.name ?? "",
        a.typeName ?? "",
        a.categoryName ?? "",
        a.status ?? "",
        a.lineName ?? "",
        a.modelNumber ?? "",
        a.id ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `equipment-${locationId.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) return <LoadingState label="Loading equipment…" />;
  if (error) return <ErrorState error={error} onRetry={() => mutate()} />;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fff",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search assets, locations, serial numbers…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{ flex: 1, minWidth: 240 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <StatBlock label="TOTAL ASSETS" value={total} />
            <Divider orientation="vertical" flexItem />
            <StatBlock
              label="OPERATIONAL"
              value={operational}
              sub={`${total ? Math.round((operational / total) * 100) : 0}% of total`}
              color={DARCA_COLORS.success}
            />
            <Divider orientation="vertical" flexItem />
            <StatBlock
              label="NEEDS ATTENTION"
              value={needsAttention}
              sub={`${total ? Math.round((needsAttention / total) * 100) : 0}% of total`}
              color={DARCA_COLORS.warning}
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={exportCsv}
            disabled={!filtered.length}
          >
            Export
          </Button>

          <ButtonGroup variant="contained">
            <Button
              startIcon={<AddIcon />}
              onClick={(e) => setAddMenuAnchor(e.currentTarget)}
            >
              Add Asset
            </Button>
            <Button size="small" onClick={(e) => setAddMenuAnchor(e.currentTarget)}>
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Menu
            anchorEl={addMenuAnchor}
            open={!!addMenuAnchor}
            onClose={() => setAddMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setAddMenuAnchor(null);
                setEquipmentOpen(true);
              }}
            >
              <PrecisionManufacturingOutlinedIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Equipment
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Asset, system or component
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAddMenuAnchor(null);
                setPersonOpen(true);
              }}
            >
              <PeopleOutlinedIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Person
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Team member or technician
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Sub-header */}
      <Box sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h5">Equipment</Typography>
            <Typography variant="body2" color="text.secondary">
              {location?.name ?? "Location"} · {total} assets
            </Typography>
          </Box>
          {locations && locations.length > 1 ? (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Site</InputLabel>
              <Select
                label="Site"
                value={locationId}
                onChange={(e) =>
                  router.push(locationPath(orgId, e.target.value, "/assets"))
                }
              >
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search machines, systems, components…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{ flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
          >
            Filter
            {(status || categoryId) && (
              <Chip label="Active" size="small" color="primary" sx={{ ml: 1, height: 20 }} />
            )}
          </Button>
          <Popover
            open={!!filterAnchor}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Box sx={{ p: 2, width: 280, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={status ?? ""}
                  onChange={(e) => updateFilter("status", e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={categoryId ?? ""}
                  onChange={(e) => updateFilter("categoryId", e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories?.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                size="small"
                onClick={() => {
                  router.replace(pathname);
                  setFilterAnchor(null);
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            </Box>
          </Popover>
        </Box>

        {pageAssets.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              bgcolor: "#fff",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              No equipment found
            </Typography>
            <Button variant="contained" onClick={() => setEquipmentOpen(true)} sx={{ mt: 1 }}>
              Add equipment
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {pageAssets.map((asset) => (
              <Grid key={asset.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <AssetCard asset={asset} locationId={locationId} />
              </Grid>
            ))}
          </Grid>
        )}

        {total > 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              py: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </Button>
              <Typography variant="body2">
                {page} / {totalPages}
              </Typography>
              <Button
                size="small"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        ) : null}
      </Box>

      <AddEquipmentWizard
        open={equipmentOpen}
        onClose={() => setEquipmentOpen(false)}
        locationId={locationId}
      />
      <AddPersonWizard
        open={personOpen}
        onClose={() => setPersonOpen(false)}
        orgId={orgId}
      />
    </Box>
  );
}

function StatBlock({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color?: string;
}) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 90 }}>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: "0.06em" }}
      >
        {label}
      </Typography>
      <Typography variant="h5" sx={{ color: color ?? "text.primary", fontWeight: 700, lineHeight: 1.2 }}>
        {value}
      </Typography>
      {sub ? (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      ) : null}
    </Box>
  );
}

export default function EquipmentDashboard({
  orgId,
  locationId,
}: {
  orgId: string;
  locationId: string;
}) {
  return (
    <>
      <SyncLocationFromPath orgId={orgId} locationId={locationId} />
      <Suspense fallback={<LoadingState label="Loading equipment…" />}>
        <EquipmentDashboardContent orgId={orgId} locationId={locationId} />
      </Suspense>
    </>
  );
}
