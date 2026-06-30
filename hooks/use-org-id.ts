"use client";

import { useAuth } from "@/hooks/use-auth";

export function useOrgId(): string | undefined {
  return useAuth().user?.organisationId ?? undefined;
}
