"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import Link from "@/components/link";
import {
  getJob,
  getLocationAsset,
  getOrganisation,
  getOrganisationLocation,
} from "@/lib/api/api";

type Crumb = { label: string; href?: string };

function useSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const orgMatch = pathname.match(/^\/organisations\/([^/]+)/);
  const orgId = orgMatch?.[1];

  const locationMatch = pathname.match(
    /^\/organisations\/[^/]+\/locations\/([^/]+)/
  );
  const locationId = locationMatch?.[1];

  const assetMatch = pathname.match(/^\/assets\/([^/]+)/);
  const assetId = assetMatch?.[1];

  const jobMatch = pathname.match(/^\/jobs\/([^/]+)/);
  const jobId = jobMatch?.[1];

  const assetLocationId = useSearchParam("locationId");

  const { data: org } = useSWR(
    orgId ? ["breadcrumb-org", orgId] : null,
    () => getOrganisation(orgId!)
  );

  const { data: location } = useSWR(
    orgId && locationId ? ["breadcrumb-location", orgId, locationId] : null,
    () => getOrganisationLocation(orgId!, locationId!)
  );

  const { data: asset } = useSWR(
    assetId && assetLocationId
      ? ["breadcrumb-asset", assetLocationId, assetId]
      : null,
    () => getLocationAsset(assetLocationId!, assetId!)
  );

  const { data: job } = useSWR(
    jobId ? ["breadcrumb-job", jobId] : null,
    () => getJob(jobId!)
  );

  const crumbs = useMemo((): Crumb[] => {
    const items: Crumb[] = [{ label: "Home", href: "/" }];

    if (pathname.startsWith("/settings")) {
      items.push({ label: "Settings" });
      const segment = pathname.split("/")[2];
      if (segment) {
        items.push({
          label: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        });
      }
      return items;
    }

    if (orgId) {
      items.push({
        label: org?.name ?? "Organisation",
        href: `/organisations/${orgId}`,
      });
    }

    if (locationId && orgId) {
      items.push({
        label: location?.name ?? "Location",
        href: `/organisations/${orgId}/locations/${locationId}`,
      });
    }

    if (assetId) {
      items.push({
        label: asset?.name ?? "Asset",
        href: `/assets/${assetId}${assetLocationId ? `?locationId=${assetLocationId}` : ""}`,
      });
    }

    if (jobId) {
      items.push({
        label: job?.title ?? "Job",
        href: `/jobs/${jobId}`,
      });
    }

    return items;
  }, [
    pathname,
    orgId,
    org?.name,
    locationId,
    location?.name,
    assetId,
    asset?.name,
    assetLocationId,
    jobId,
    job?.title,
  ]);

  if (crumbs.length <= 1) return null;

  return (
    <MuiBreadcrumbs sx={{ mb: 2 }}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        if (isLast || !crumb.href) {
          return (
            <Typography key={`${crumb.label}-${index}`} color="text.primary">
              {crumb.label}
            </Typography>
          );
        }
        return (
          <Link
            key={crumb.href}
            href={crumb.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {crumb.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
