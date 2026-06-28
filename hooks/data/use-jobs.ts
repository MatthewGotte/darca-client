"use client";

import useSWR from "swr";
import {
  archiveJob,
  assignJobUser,
  completeJob,
  createAssetJob,
  getJob,
  getJobHistory,
  listAssetJobs,
  startJob,
  unassignJobUser,
  updateJob,
} from "@/lib/api/api";
import { queryKeys } from "@/lib/api/query-keys";
import { useApiMutation } from "@/lib/api/swr";
import type {
  AssignJobUserRequest,
  CompleteJobRequest,
  CreateJobRequest,
  JobPriority,
  JobStatus,
  UpdateJobRequest,
} from "@/lib/api/types";

export function useAssetJobs(
  assetId: string | undefined,
  params?: { status?: JobStatus; priority?: JobPriority }
) {
  return useSWR(
    assetId ? queryKeys.jobs(assetId, params) : null,
    () => listAssetJobs(assetId!, params)
  );
}

export function useJob(jobId: string | undefined) {
  return useSWR(
    jobId ? queryKeys.job(jobId) : null,
    () => getJob(jobId!)
  );
}

export function useJobHistory(jobId: string | undefined) {
  return useSWR(
    jobId ? queryKeys.jobHistory(jobId) : null,
    () => getJobHistory(jobId!)
  );
}

export function useCreateAssetJob(assetId: string) {
  return useApiMutation<
    CreateJobRequest,
    Awaited<ReturnType<typeof createAssetJob>>
  >(
    `mutation:create-job:${assetId}`,
    (body) => createAssetJob(assetId, body),
    { invalidate: [queryKeys.jobs(assetId)] }
  );
}

export function useUpdateJob(jobId: string, assetId: string) {
  return useApiMutation<
    UpdateJobRequest,
    Awaited<ReturnType<typeof updateJob>>
  >(
    `mutation:update-job:${jobId}`,
    (body) => updateJob(jobId, body),
    {
      invalidate: [
        queryKeys.job(jobId),
        queryKeys.jobs(assetId),
      ],
    }
  );
}

export function useStartJob(jobId: string, assetId: string) {
  return useApiMutation<void, Awaited<ReturnType<typeof startJob>>>(
    `mutation:start-job:${jobId}`,
    () => startJob(jobId),
    {
      invalidate: [
        queryKeys.job(jobId),
        queryKeys.jobs(assetId),
        queryKeys.jobHistory(jobId),
      ],
    }
  );
}

export function useCompleteJob(jobId: string, assetId: string) {
  return useApiMutation<
    CompleteJobRequest,
    Awaited<ReturnType<typeof completeJob>>
  >(
    `mutation:complete-job:${jobId}`,
    (body) => completeJob(jobId, body),
    {
      invalidate: [
        queryKeys.job(jobId),
        queryKeys.jobs(assetId),
        queryKeys.jobHistory(jobId),
      ],
    }
  );
}

export function useArchiveJob(jobId: string, assetId: string) {
  return useApiMutation<void, Awaited<ReturnType<typeof archiveJob>>>(
    `mutation:archive-job:${jobId}`,
    () => archiveJob(jobId),
    {
      invalidate: [
        queryKeys.job(jobId),
        queryKeys.jobs(assetId),
        queryKeys.jobHistory(jobId),
      ],
    }
  );
}

export function useAssignJobUser(jobId: string) {
  return useApiMutation<
    AssignJobUserRequest,
    Awaited<ReturnType<typeof assignJobUser>>
  >(
    `mutation:assign-job-user:${jobId}`,
    (body) => assignJobUser(jobId, body),
    { invalidate: [queryKeys.job(jobId)] }
  );
}

export function useUnassignJobUser(jobId: string, userId: string) {
  return useApiMutation<void, void>(
    `mutation:unassign-job-user:${jobId}:${userId}`,
    () => unassignJobUser(jobId, userId),
    { invalidate: [queryKeys.job(jobId)] }
  );
}
