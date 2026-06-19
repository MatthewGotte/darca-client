export function orgPath(orgId: string, path = "") {
  return `/organisations/${orgId}${path}`;
}

export function locationPath(orgId: string, locationId: string, path = "") {
  return `/organisations/${orgId}/locations/${locationId}${path}`;
}

export function assetPath(
  assetId: string,
  locationId?: string,
  path = "",
  query?: Record<string, string>
) {
  const base = `/assets/${assetId}${path}`;
  const params = new URLSearchParams();
  if (locationId) params.set("locationId", locationId);
  if (query) {
    Object.entries(query).forEach(([key, value]) => params.set(key, value));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function jobPath(jobId: string, path = "") {
  return `/jobs/${jobId}${path}`;
}
