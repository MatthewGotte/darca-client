"use client";

import { Tag } from "antd";
import type { JobStatus, JobPriority } from "@/lib/api/types";

type Criticality = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const STATUS_COLORS: Record<JobStatus, string> = {
  PENDING: "default",
  IN_PROGRESS: "processing",
  COMPLETED: "success",
  ARCHIVED: "default",
};

const STATUS_LABELS: Record<JobStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

const PRIORITY_COLORS: Record<JobPriority, string> = {
  LOW: "blue",
  MEDIUM: "orange",
  HIGH: "volcano",
  CRITICAL: "red",
};

const CRITICALITY_COLORS: Record<Criticality, string> = {
  LOW: "green",
  MEDIUM: "gold",
  HIGH: "orange",
  CRITICAL: "red",
};

export function StatusTag({ status }: { status?: JobStatus | string }) {
  if (!status) return null;
  const s = status as JobStatus;
  return (
    <Tag color={STATUS_COLORS[s] ?? "default"}>
      {STATUS_LABELS[s] ?? status}
    </Tag>
  );
}

export function AssetStatusTag({ statusLabel }: { statusLabel?: string }) {
  if (!statusLabel) return null;
  return <Tag color="blue">{statusLabel}</Tag>;
}

export function PriorityTag({ priority }: { priority?: JobPriority | string }) {
  if (!priority) return null;
  const p = priority as JobPriority;
  return (
    <Tag color={PRIORITY_COLORS[p] ?? "default"}>
      {p.charAt(0) + p.slice(1).toLowerCase()}
    </Tag>
  );
}

export function CriticalityTag({
  criticality,
}: {
  criticality?: Criticality | string;
}) {
  if (!criticality) return null;
  const c = criticality as Criticality;
  return (
    <Tag color={CRITICALITY_COLORS[c] ?? "default"}>
      {c.charAt(0) + c.slice(1).toLowerCase()}
    </Tag>
  );
}

export function ComplianceResultTag({
  result,
}: {
  result?: "PASS" | "FAIL" | "NOT_APPLICABLE" | string;
}) {
  if (!result) return null;
  const colors: Record<string, string> = {
    PASS: "success",
    FAIL: "error",
    NOT_APPLICABLE: "default",
  };
  const labels: Record<string, string> = {
    PASS: "Pass",
    FAIL: "Fail",
    NOT_APPLICABLE: "N/A",
  };
  return <Tag color={colors[result] ?? "default"}>{labels[result] ?? result}</Tag>;
}
