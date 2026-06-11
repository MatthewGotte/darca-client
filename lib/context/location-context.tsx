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

type LocationContextValue = {
  locationId: string | null;
  setLocationId: (id: string | null) => void;
  isReady: boolean;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationId, setLocationIdState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.locationId);
    setLocationIdState(stored);
    setIsReady(true);
  }, []);

  const setLocationId = useCallback((id: string | null) => {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.locationId, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.locationId);
    }
    setLocationIdState(id);
  }, []);

  const value = useMemo(
    () => ({ locationId, setLocationId, isReady }),
    [locationId, setLocationId, isReady]
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocationContext must be used within LocationProvider");
  }
  return ctx;
}
