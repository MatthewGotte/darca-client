# DARCA Client

Next.js frontend for DARCA Asset Intelligence. API types and endpoint functions are generated from the [`darca-service`](../darca-service/) OpenAPI spec.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default, the app talks to the local backend at `http://localhost:8080/api/v1`. Start `darca-service` locally before making API calls.

### Targeting a remote backend

| Command | API base URL |
|---------|--------------|
| `npm run dev` | `http://localhost:8080/api/v1` |
| `npm run dev:development` | `https://darca-service-development.up.railway.app/api/v1` |
| `npm run dev -- --remote-host=development` | Railway develop (same as above) |

You can also set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` (see `.env.example`).

## Pulling API types

Types are generated from the SpringDoc OpenAPI document (`/v3/api-docs`) and written to `lib/api/generated/schema.ts`. Re-run this whenever the backend API changes.

**Prerequisite:** the backend must be reachable at the time you run the command.

### From local backend

Start `darca-service` on port 8080, then:

```bash
npm run types:pull
```

This fetches `http://localhost:8080/v3/api-docs`, caches a snapshot at `openapi/darca-api.json` (gitignored), and regenerates `lib/api/generated/schema.ts`.

### From Railway develop

If the local backend is not running:

```bash
npm run types:pull:development
```

This pulls the spec from `https://darca-service-development.up.railway.app/v3/api-docs`.

### What gets updated

| Output | Committed? | Purpose |
|--------|------------|---------|
| `openapi/darca-api.json` | No (gitignored) | Cached spec snapshot used during generation |
| `lib/api/generated/schema.ts` | Yes | OpenAPI-derived `paths` and `components` types |

Named schema types live in `lib/api/schema-types.ts` and are re-exported from `lib/api/types.ts` — import types like `OrganisationResponse` rather than importing from the generated file directly.

## API usage

All endpoints are exposed as typed async functions in `lib/api/api.ts`. Each function returns the response body (not the raw Axios response), which keeps them easy to use as SWR fetchers.

```typescript
import { getOrganisation, listAssetJobs } from "@/lib/api/api";

const org = await getOrganisation(organisationId);

const jobs = await listAssetJobs(assetId, {
  status: "PENDING",
  priority: "HIGH",
});
```

Errors from the backend are normalized to `ApiError` (from `@/lib/api/axios-config`) with a `status` code and optional `body` payload.

Browse `lib/api/api.ts` for the full list of functions — naming follows `{verb}{Resource}` (e.g. `updateOrganisation`, `listOrganisationLocations`, `startJob`).

## SWR usage

SWR is not installed yet, but the API layer is shaped for it: every function in `api.ts` is a standalone fetcher that returns `Promise<T>`.

### Setup

```bash
npm install swr
```

SWR hooks must run in Client Components (`"use client"`).

### Basic fetch

```tsx
"use client";

import useSWR from "swr";
import { getOrganisation } from "@/lib/api/api";
import { ApiError } from "@/lib/api/axios-config";

export function OrganisationPanel({ organisationId }: { organisationId: string }) {
  const { data, error, isLoading } = useSWR(
    ["organisation", organisationId],
    () => getOrganisation(organisationId)
  );

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>{(error as ApiError).message}</p>;

  return <h1>{data?.name}</h1>;
}
```

### List with filters

Use the filter object as part of the cache key so SWR refetches when filters change:

```tsx
"use client";

import useSWR from "swr";
import { listAssetJobs } from "@/lib/api/api";
import type { JobPriority, JobStatus } from "@/lib/api/types";

type JobFilters = {
  status?: JobStatus;
  priority?: JobPriority;
};

export function AssetJobsList({
  assetId,
  filters,
}: {
  assetId: string;
  filters?: JobFilters;
}) {
  const { data: jobs, isLoading } = useSWR(
    ["asset-jobs", assetId, filters],
    () => listAssetJobs(assetId, filters)
  );

  if (isLoading) return <p>Loading jobs…</p>;

  return (
    <ul>
      {jobs?.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
  );
}
```

### Mutations and revalidation

After a mutation, call `mutate` on the relevant cache key to refresh:

```tsx
"use client";

import useSWR, { mutate } from "swr";
import { getJob, startJob } from "@/lib/api/api";

export function StartJobButton({ jobId }: { jobId: string }) {
  const { data: job } = useSWR(["job", jobId], () => getJob(jobId));

  async function handleStart() {
    await startJob(jobId);
    await mutate(["job", jobId]);
  }

  return (
    <button onClick={handleStart} disabled={job?.status !== "PENDING"}>
      Start job
    </button>
  );
}
```

### Cache key conventions

Keep keys consistent and include every input that affects the response:

| Pattern | Example key |
|---------|-------------|
| Single resource | `["organisation", id]` |
| Nested list | `["organisation-locations", organisationId]` |
| Filtered list | `["asset-jobs", assetId, { status, priority }]` |

Matching keys across components lets `mutate` invalidate related data after writes.
