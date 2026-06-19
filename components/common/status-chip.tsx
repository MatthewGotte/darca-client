"use client";

import Chip from "@mui/material/Chip";

const STATUS_COLORS: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  OPERATIONAL: "success",
  UNDER_MAINTENANCE: "warning",
  INACTIVE: "default",
  DECOMMISSIONED: "error",
  PENDING: "default",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  ARCHIVED: "default",
  LOW: "default",
  MEDIUM: "info",
  HIGH: "warning",
  CRITICAL: "error",
  PASS: "success",
  FAIL: "error",
  NOT_APPLICABLE: "default",
};

export default function StatusChip({ label }: { label?: string }) {
  if (!label) return null;
  const color = STATUS_COLORS[label] ?? "default";
  return (
    <Chip
      label={label.replace(/_/g, " ")}
      color={color}
      size="small"
      variant="outlined"
    />
  );
}
