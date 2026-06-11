"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { mutate } from "swr";
import { replaceAssetIdentifiers } from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";

const IDENTIFIER_TYPES = [
  "SERIAL_NUMBER",
  "BARCODE",
  "QR_CODE",
  "RFID",
  "TAG",
  "ASSET_TAG",
] as const;

type Entry = Schema<"IdentifierEntry">;

export default function AssetIdentifiersTab({
  assetId,
  identifiers,
}: {
  assetId: string;
  identifiers?: Schema<"AssetIdentifierResponse">[];
}) {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEntries(
      identifiers?.map((i) => ({
        type: i.type!,
        value: i.value ?? "",
        active: i.active ?? true,
      })) ?? []
    );
  }, [identifiers]);

  function addEntry() {
    setEntries([...entries, { type: "SERIAL_NUMBER", value: "", active: true }]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await replaceAssetIdentifiers(assetId, { identifiers: entries });
      if (locationId) await mutate(["location-asset", locationId, assetId]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 640 }}>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        {entries.map((entry, index) => (
          <Stack key={index} direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={entry.type}
                onChange={(e) => {
                  const next = [...entries];
                  next[index] = { ...entry, type: e.target.value as Entry["type"] };
                  setEntries(next);
                }}
              >
                {IDENTIFIER_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Value"
              value={entry.value}
              onChange={(e) => {
                const next = [...entries];
                next[index] = { ...entry, value: e.target.value };
                setEntries(next);
              }}
            />
            <Button
              color="error"
              onClick={() => setEntries(entries.filter((_, i) => i !== index))}
            >
              Remove
            </Button>
          </Stack>
        ))}
        <Stack direction="row" spacing={1}>
          <Button onClick={addEntry}>Add identifier</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            Save identifiers
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
