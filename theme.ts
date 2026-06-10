"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
  },
  defaultColorScheme: "light",
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
