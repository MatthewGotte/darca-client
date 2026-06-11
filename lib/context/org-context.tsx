"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants/storage";

type OrgContextValue = {
  orgId: string | null;
  setOrgId: (id: string) => void;
  isReady: boolean;
};

const OrgContext = createContext<OrgContextValue | null>(null);

function readStoredOrgId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.orgId);
}

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [orgId, setOrgIdState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readStoredOrgId();
    const envOrgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ?? null;
    setOrgIdState(stored ?? envOrgId);
    setIsReady(true);
  }, []);

  const setOrgId = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEYS.orgId, id);
    setOrgIdState(id);
  }, []);

  const value = useMemo(
    () => ({ orgId, setOrgId, isReady }),
    [orgId, setOrgId, isReady]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrgContext() {
  const ctx = useContext(OrgContext);
  if (!ctx) {
    throw new Error("useOrgContext must be used within OrgProvider");
  }
  return ctx;
}
