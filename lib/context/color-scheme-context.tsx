"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "@mui/material/styles";
import {
  STORAGE_KEYS,
  type ColorSchemePreference,
} from "@/lib/constants/storage";

type ColorSchemeContextValue = {
  mode: ColorSchemePreference;
  setMode: (mode: ColorSchemePreference) => void;
  isReady: boolean;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

function readStoredColorScheme(): ColorSchemePreference | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.colorScheme);
  return stored === "dark" || stored === "light" ? stored : null;
}

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, setMode: setMuiMode } = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readStoredColorScheme();
    if (stored) {
      setMuiMode(stored);
    }
    setIsReady(true);
  }, [setMuiMode]);

  const resolvedMode: ColorSchemePreference = mode === "dark" ? "dark" : "light";

  const setMode = useCallback(
    (next: ColorSchemePreference) => {
      localStorage.setItem(STORAGE_KEYS.colorScheme, next);
      setMuiMode(next);
    },
    [setMuiMode]
  );

  const value = useMemo(
    () => ({ mode: resolvedMode, setMode, isReady }),
    [resolvedMode, setMode, isReady]
  );

  return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>;
}

export function useColorSchemePreference() {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx) {
    throw new Error("useColorSchemePreference must be used within ColorSchemeProvider");
  }
  return ctx;
}
