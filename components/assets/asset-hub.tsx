"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import useSWR, { mutate } from "swr";
import Link from "@/components/link";
import ConfirmDialog from "@/components/common/confirm-dialog";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import PageHeader from "@/components/common/page-header";
import StatusChip from "@/components/common/status-chip";
import AssetAssignmentsTab from "@/components/assets/asset-assignments-tab";
import AssetAttachmentsTab from "@/components/assets/asset-attachments-tab";
import AssetCustomFieldsTab from "@/components/assets/asset-custom-fields-tab";
import AssetIdentifiersTab from "@/components/assets/asset-identifiers-tab";
import {
  deleteLocationAsset,
  getLocationAsset,
  listLocationLines,
  updateLocationAsset,
} from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";
import { useOrgContext } from "@/lib/context/org-context";
import { assetPath, locationPath } from "@/lib/routes";

type TabValue =
  | "overview"
  | "identifiers"
  | "custom-fields"
  | "attachments"
  | "assignments"
  | "jobs"
  | "compliance";

export default function AssetHub({ assetId }: { assetId: string }) {
  const router = useRouter();
  const { orgId } = useOrgContext();
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const tab = (searchParams.get("tab") as TabValue) || "overview";

  const { data, error, isLoading } = useSWR(
    locationId ? ["location-asset", locationId, assetId] : null,
    () => getLocationAsset(locationId!, assetId)
  );

  const { data: lines } = useSWR(
    locationId ? ["location-lines", locationId] : null,
    () => listLocationLines(locationId!)
  );

  const [form, setForm] = useState<Schema<"UpdateAssetRequest">>({ name: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name ?? "",
        lineId: data.lineId,
        modelNumber: data.modelNumber,
        manufacturer: data.manufacturer,
        status: data.status,
        criticality: data.criticality,
        purchaseDate: data.purchaseDate,
        purchaseCost: data.purchaseCost,
        warrantyExpiry: data.warrantyExpiry,
        specificLocationDetails: data.specificLocationDetails,
        geoLatitude: data.geoLatitude,
        geoLongitude: data.geoLongitude,
      });
    }
  }, [data]);

  if (!locationId) {
    return (
      <Alert severity="warning">
        Missing locationId query parameter. Open this asset from a location assets list.
      </Alert>
    );
  }

  const resolvedLocationId = locationId;

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  function setTab(next: TabValue) {
    router.replace(assetPath(assetId, resolvedLocationId, "", { tab: next }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateLocationAsset(resolvedLocationId, assetId, form);
      await mutate(["location-asset", resolvedLocationId, assetId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDecommission() {
    await deleteLocationAsset(resolvedLocationId, assetId);
    if (orgId) {
      router.push(locationPath(orgId, resolvedLocationId, "/assets"));
    }
  }

  return (
    <Box>
      <PageHeader
        title={data?.name ?? "Asset"}
        description={`${data?.categoryName ?? ""} · ${data?.typeName ?? ""}`}
        actions={
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <StatusChip label={data?.status} />
            <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>
              Decommission
            </Button>
          </Stack>
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" value="overview" />
        <Tab label="Identifiers" value="identifiers" />
        <Tab label="Custom fields" value="custom-fields" />
        <Tab label="Attachments" value="attachments" />
        <Tab label="Assignments" value="assignments" />
        <Tab label="Jobs" value="jobs" />
        <Tab label="Compliance" value="compliance" />
      </Tabs>

      {tab === "overview" ? (
        <Stack spacing={2} sx={{ maxWidth: 560 }}>
          {saveError ? <Alert severity="error">{saveError}</Alert> : null}
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormControl>
            <InputLabel>Line</InputLabel>
            <Select
              label="Line"
              value={form.lineId ?? ""}
              onChange={(e) =>
                setForm({ ...form, lineId: e.target.value || undefined })
              }
            >
              <MenuItem value="">None</MenuItem>
              {lines?.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Model number"
            value={form.modelNumber ?? ""}
            onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
          />
          <TextField
            label="Manufacturer"
            value={form.manufacturer ?? ""}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          />
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={form.status ?? "OPERATIONAL"}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as Schema<"UpdateAssetRequest">["status"] })
              }
            >
              {["OPERATIONAL", "UNDER_MAINTENANCE", "INACTIVE", "DECOMMISSIONED"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Criticality</InputLabel>
            <Select
              label="Criticality"
              value={form.criticality ?? "MEDIUM"}
              onChange={(e) =>
                setForm({
                  ...form,
                  criticality: e.target.value as Schema<"UpdateAssetRequest">["criticality"],
                })
              }
            >
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.name.trim()}>
            Save changes
          </Button>
        </Stack>
      ) : null}

      {tab === "identifiers" ? (
        <AssetIdentifiersTab assetId={assetId} identifiers={data?.identifiers} />
      ) : null}

      {tab === "custom-fields" ? (
        <AssetCustomFieldsTab
          assetId={assetId}
          categoryId={data?.categoryId}
          customFields={data?.customFields}
        />
      ) : null}

      {tab === "attachments" ? (
        <AssetAttachmentsTab assetId={assetId} />
      ) : null}

      {tab === "assignments" ? (
        <AssetAssignmentsTab assetId={assetId} assignments={data?.assignments} />
      ) : null}

      {tab === "jobs" ? (
        <Button component={Link} href={assetPath(assetId, resolvedLocationId, "/jobs")} variant="contained">
          View jobs
        </Button>
      ) : null}

      {tab === "compliance" ? (
        <Button
          component={Link}
          href={assetPath(assetId, resolvedLocationId, "/compliance-schedules")}
          variant="contained"
        >
          View compliance schedules
        </Button>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title="Decommission asset"
        message="This will decommission the asset. Continue?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDecommission}
      />
    </Box>
  );
}
