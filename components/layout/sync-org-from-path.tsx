"use client";

import { useEffect } from "react";
import { useOrgContext } from "@/lib/context/org-context";

export default function SyncOrgFromPath({ orgId }: { orgId: string }) {
  const { setOrgId } = useOrgContext();

  useEffect(() => {
    setOrgId(orgId);
  }, [orgId, setOrgId]);

  return null;
}
