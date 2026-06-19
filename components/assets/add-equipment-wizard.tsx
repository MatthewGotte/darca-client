"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import useSWR, { mutate } from "swr";
import {
  createLocationAsset,
  listCategories,
  listLocationLines,
  listTypes,
} from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";
import { assetPath } from "@/lib/routes";

const STEPS = ["Identity", "Status", "Location", "Maintenance"];

type Props = {
  open: boolean;
  onClose: () => void;
  locationId: string;
};

export default function AddEquipmentWizard({ open, onClose, locationId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: categories } = useSWR(open ? "categories" : null, listCategories);
  const { data: types } = useSWR(open ? "types" : null, listTypes);
  const { data: lines } = useSWR(
    open ? ["location-lines", locationId] : null,
    () => listLocationLines(locationId)
  );

  const [form, setForm] = useState<Schema<"CreateAssetRequest">>({
    name: "",
    categoryId: "",
    typeId: "",
    status: "OPERATIONAL",
    criticality: "MEDIUM",
  });

  function reset() {
    setStep(0);
    setError(null);
    setForm({
      name: "",
      categoryId: "",
      typeId: "",
      status: "OPERATIONAL",
      criticality: "MEDIUM",
    });
  }

  function handleClose() {
    reset();
    onClose();
  }

  function canProceed() {
    if (step === 0) return !!form.name.trim() && !!form.categoryId && !!form.typeId;
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const asset = await createLocationAsset(locationId, form);
      await mutate(["location-assets", locationId]);
      handleClose();
      router.push(assetPath(asset.id!, locationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create equipment");
    } finally {
      setLoading(false);
    }
  }

  const selectedCategory = categories?.find((c) => c.id === form.categoryId);
  const previewId = selectedCategory?.name
    ? `${selectedCategory.name.slice(0, 3).toUpperCase()}-???`
    : "Auto-assigned on save";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PrecisionManufacturingOutlinedIcon sx={{ color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="h6">Add Equipment</Typography>
            <Typography variant="body2" color="text.secondary">
              Register a new asset, system, or component.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        {step === 0 ? (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Asset Identity
            </Typography>
            <TextField
              required
              label="Asset name"
              placeholder="e.g. Sector A Antenna Mount"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Asset ID / Code"
              value={previewId}
              disabled
              helperText="Assigned after creation — add identifiers on the asset detail page."
              fullWidth
            />
            <FormControl required fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                {categories?.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl required fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={form.typeId}
                onChange={(e) => setForm({ ...form, typeId: e.target.value })}
              >
                {types?.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Model number"
              value={form.modelNumber ?? ""}
              onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Manufacturer"
              value={form.manufacturer ?? ""}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
              fullWidth
            />
          </Stack>
        ) : null}

        {step === 1 ? (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Operational status
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status ?? "OPERATIONAL"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as Schema<"CreateAssetRequest">["status"],
                  })
                }
              >
                {["OPERATIONAL", "UNDER_MAINTENANCE", "INACTIVE", "DECOMMISSIONED"].map(
                  (s) => (
                    <MenuItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Criticality</InputLabel>
              <Select
                label="Criticality"
                value={form.criticality ?? "MEDIUM"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    criticality: e.target.value as Schema<"CreateAssetRequest">["criticality"],
                  })
                }
              >
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        ) : null}

        {step === 2 ? (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Physical location within this site
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Production line</InputLabel>
              <Select
                label="Production line"
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
              label="Specific location details"
              placeholder="e.g. Roof level, north sector"
              value={form.specificLocationDetails ?? ""}
              onChange={(e) =>
                setForm({ ...form, specificLocationDetails: e.target.value })
              }
              multiline
              minRows={2}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Latitude"
                type="number"
                value={form.geoLatitude ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    geoLatitude: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                fullWidth
              />
              <TextField
                label="Longitude"
                type="number"
                value={form.geoLongitude ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    geoLongitude: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                fullWidth
              />
            </Box>
          </Stack>
        ) : null}

        {step === 3 ? (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Maintenance & lifecycle
            </Typography>
            <TextField
              label="Purchase date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.purchaseDate ?? ""}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              fullWidth
            />
            <TextField
              label="Warranty expiry"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.warrantyExpiry ?? ""}
              onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })}
              fullWidth
            />
            <TextField
              label="Purchase cost"
              type="number"
              value={form.purchaseCost ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  purchaseCost: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              fullWidth
            />
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          {step > 0 ? (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep((s) => s - 1)}
              disabled={loading}
            >
              Back
            </Button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
            >
              {loading ? "Creating…" : "Create equipment"}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
