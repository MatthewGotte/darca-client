import Image from "next/image";
import { Suspense } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Image
            src="/darca-logo.jpeg"
            alt="DARCA Asset Management"
            width={360}
            height={98}
            priority
            style={{ height: 98, width: "auto" }}
          />
        </Box>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Suspense fallback={<CircularProgress size={24} />}>
            <ResetPasswordForm />
          </Suspense>
        </Paper>
      </Container>
    </Box>
  );
}
