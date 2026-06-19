"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import Link from "@/components/link";
import { DARCA_COLORS } from "@/lib/constants/darca-theme";
import type { Schema } from "@/lib/api/types";
import { assetPath } from "@/lib/routes";

function displayAssetId(asset: Schema<"AssetSummaryResponse">) {
  if (asset.modelNumber) return asset.modelNumber;
  const id = asset.id ?? "";
  return id.slice(0, 8).toUpperCase();
}

function needsAttention(asset: Schema<"AssetSummaryResponse">) {
  return (
    asset.status === "UNDER_MAINTENANCE" ||
    asset.status === "INACTIVE" ||
    asset.criticality === "CRITICAL" ||
    asset.criticality === "HIGH"
  );
}

export default function AssetCard({
  asset,
  locationId,
}: {
  asset: Schema<"AssetSummaryResponse">;
  locationId: string;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <Card
      sx={{
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 4px 20px rgba(15, 39, 68, 0.12)" },
      }}
    >
      <Box
        sx={{
          bgcolor: DARCA_COLORS.cardHeader,
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <QrCode2Icon sx={{ color: "#fff", fontSize: 22 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              component={Link}
              href={assetPath(asset.id!, locationId)}
              variant="subtitle2"
              sx={{
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {asset.name}
            </Typography>
            {needsAttention(asset) ? (
              <StarIcon sx={{ fontSize: 14, color: DARCA_COLORS.accent }} />
            ) : null}
          </Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
            {asset.typeName ?? asset.categoryName ?? "Equipment"}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ color: "rgba(255,255,255,0.7)" }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
          <MenuItem
            component={Link}
            href={assetPath(asset.id!, locationId)}
            onClick={() => setAnchor(null)}
          >
            View details
          </MenuItem>
        </Menu>
      </Box>

      <Box sx={{ px: 2, py: 1.5 }}>
        <DetailRow label="Owner" value={asset.lineName ?? asset.categoryName ?? "—"} />
        <DetailRow label="Asset ID" value={displayAssetId(asset)} />
        <DetailRow label="Status" value={asset.status?.replace(/_/g, " ") ?? "—"} />
      </Box>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 0.75,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderBottom: 0 },
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}
