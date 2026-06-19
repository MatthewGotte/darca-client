"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "#0f2744",
          dark: "#0a1a2e",
          light: "#1a3a5c",
        },
        secondary: {
          main: "#e85d04",
        },
        background: {
          default: "#f4f6f8",
          paper: "#ffffff",
        },
        text: {
          primary: "#1a2332",
          secondary: "#5c6b7a",
        },
        divider: "#e2e8f0",
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#60a5fa",
          dark: "#3b82f6",
          light: "#93c5fd",
        },
        secondary: {
          main: "#fb923c",
        },
        background: {
          default: "#0b1220",
          paper: "#1e293b",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#94a3b8",
        },
        divider: "#334155",
      },
    },
  },
  defaultColorScheme: "light",
  typography: {
    fontFamily: "var(--font-roboto)",
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: "0.02em" },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(15, 39, 68, 0.08)",
        },
      },
    },
  },
});

export default theme;
