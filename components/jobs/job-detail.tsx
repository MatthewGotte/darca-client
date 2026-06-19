"use client";

import { useEffect, useState } from "react";
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
import JobAssignmentsSection from "@/components/jobs/job-assignments-section";
import JobHistoryTimeline from "@/components/jobs/job-history-timeline";
import {
  archiveJob,
  completeJob,
  getJob,
  startJob,
  updateJob,
} from "@/lib/api/api";
import type { Schema } from "@/lib/api/types";
import { assetPath } from "@/lib/routes";

export default function JobDetail({ jobId }: { jobId: string }) {
  const [tab, setTab] = useState(0);
  const { data, error, isLoading } = useSWR(["job", jobId], () => getJob(jobId));
  const [form, setForm] = useState<Schema<"UpdateJobRequest">>({
    title: "",
    dueDate: new Date().toISOString(),
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [complianceResult, setComplianceResult] =
    useState<Schema<"CompleteJobRequest">["complianceResult"]>("PASS");
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title ?? "",
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ?? new Date().toISOString(),
      });
    }
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateJob(jobId, form);
      await mutate(["job", jobId]);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function runAction(action: () => Promise<unknown>) {
    setActionLoading(true);
    try {
      await action();
      await mutate(["job", jobId]);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <Box>
      <PageHeader
        title={data?.title ?? "Job"}
        actions={
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <StatusChip label={data?.status} />
            {data?.status === "PENDING" ? (
              <Button variant="contained" onClick={() => setStartOpen(true)}>
                Start
              </Button>
            ) : null}
            {data?.status === "IN_PROGRESS" ? (
              <Button variant="contained" onClick={() => setCompleteOpen(true)}>
                Complete
              </Button>
            ) : null}
            {data?.status === "COMPLETED" ? (
              <Button variant="outlined" onClick={() => setArchiveOpen(true)}>
                Archive
              </Button>
            ) : null}
            {data?.assetId ? (
              <Button component={Link} href={assetPath(data.assetId)} variant="text">
                View asset
              </Button>
            ) : null}
          </Stack>
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Assignments" />
        <Tab label="History" />
      </Tabs>

      {tab === 0 ? (
        <Stack spacing={2} sx={{ maxWidth: 560 }}>
          {saveError ? <Alert severity="error">{saveError}</Alert> : null}
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <FormControl>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={form.priority ?? "MEDIUM"}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value as Schema<"UpdateJobRequest">["priority"],
                })
              }
            >
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="datetime-local"
            label="Due date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={form.dueDate.slice(0, 16)}
            onChange={(e) =>
              setForm({ ...form, dueDate: new Date(e.target.value).toISOString() })
            }
          />
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            Save changes
          </Button>
        </Stack>
      ) : null}

      {tab === 1 ? (
        <JobAssignmentsSection jobId={jobId} assignments={data?.assignments} />
      ) : null}

      {tab === 2 ? <JobHistoryTimeline jobId={jobId} /> : null}

      <ConfirmDialog
        open={startOpen}
        title="Start job"
        message="Mark this job as in progress?"
        confirmLabel="Start"
        confirmColor="primary"
        loading={actionLoading}
        onClose={() => setStartOpen(false)}
        onConfirm={async () => {
          await runAction(() => startJob(jobId));
          setStartOpen(false);
        }}
      />

      <Dialog open={completeOpen} onClose={() => setCompleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete job</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl>
            <InputLabel>Compliance result</InputLabel>
            <Select
              label="Compliance result"
              value={complianceResult}
              onChange={(e) =>
                setComplianceResult(
                  e.target.value as Schema<"CompleteJobRequest">["complianceResult"]
                )
              }
            >
              {["PASS", "FAIL", "NOT_APPLICABLE"].map((r) => (
                <MenuItem key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Notes"
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={actionLoading}
            onClick={async () => {
              await runAction(() =>
                completeJob(jobId, {
                  complianceResult,
                  notes: notes || undefined,
                })
              );
              setCompleteOpen(false);
            }}
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={archiveOpen}
        title="Archive job"
        message="Archive this completed job?"
        confirmLabel="Archive"
        confirmColor="primary"
        loading={actionLoading}
        onClose={() => setArchiveOpen(false)}
        onConfirm={async () => {
          await runAction(() => archiveJob(jobId));
          setArchiveOpen(false);
        }}
      />
    </Box>
  );
}
