"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import { ColorSchemeProvider } from "@/lib/context/color-scheme-context";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme} defaultMode="light">
      <ColorSchemeProvider>
        <CssBaseline />
        {children}
      </ColorSchemeProvider>
    </ThemeProvider>
  );
}
