"use client";

import { useEffect } from "react";
import { useLocationContext } from "@/lib/context/location-context";
import { useOrgContext } from "@/lib/context/org-context";

export default function SyncLocationFromPath({
  orgId,
  locationId,
}: {
  orgId: string;
  locationId: string;
}) {
  const { setLocationId } = useLocationContext();
  const { setOrgId } = useOrgContext();

  useEffect(() => {
    setOrgId(orgId);
    setLocationId(locationId);
  }, [orgId, locationId, setLocationId, setOrgId]);

  return null;
}
