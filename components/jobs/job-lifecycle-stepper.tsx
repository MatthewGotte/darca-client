"use client";

import { Steps } from "antd";
import type { JobStatus } from "@/lib/api/types";

const JOB_STEPS: { key: JobStatus; title: string }[] = [
  { key: "PENDING", title: "Pending" },
  { key: "IN_PROGRESS", title: "In Progress" },
  { key: "COMPLETED", title: "Completed" },
  { key: "ARCHIVED", title: "Archived" },
];

function stepIndex(status?: JobStatus) {
  if (!status) return 0;
  const index = JOB_STEPS.findIndex((step) => step.key === status);
  return index >= 0 ? index : 0;
}

export default function JobLifecycleStepper({ status }: { status?: JobStatus }) {
  return (
    <Steps
      size="small"
      current={stepIndex(status)}
      items={JOB_STEPS.map((step) => ({ title: step.title }))}
      style={{ marginBottom: 24, maxWidth: 640 }}
    />
  );
}
